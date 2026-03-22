import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import cloudinary from "@/lib/cloudinary"
import {
  getDocumentAccessCookieName,
  verifyDocumentAccessToken,
} from "@/lib/document-security"

export const runtime = "nodejs"

function getFileFormat(doc: any) {
  const fromName = String(doc.fileName || "").split(".").pop()?.toLowerCase() || ""
  const normalizedFromName = fromName === "jpeg" ? "jpg" : fromName

  if (normalizedFromName) return normalizedFromName

  if (doc.mimeType === "application/pdf") return "pdf"
  if (String(doc.mimeType || "").includes("png")) return "png"
  if (String(doc.mimeType || "").includes("jpeg") || String(doc.mimeType || "").includes("jpg")) return "jpg"

  return undefined
}

async function authorizeDocument(accessKey: string, downloadRequested: boolean) {
  await connect_db()

  const doc = (await SharedDocument.findOne({ accessKey }).lean()) as any

  if (!doc) {
    return { error: NextResponse.json({ error: "Document not found" }, { status: 404 }) }
  }

  if (doc.isClientAccessRevoked) {
    return { error: NextResponse.json({ error: "Access revoked" }, { status: 403 }) }
  }

  if (doc.expiresAt && new Date(doc.expiresAt).getTime() < Date.now()) {
    return { error: NextResponse.json({ error: "Document expired" }, { status: 410 }) }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(getDocumentAccessCookieName(accessKey))?.value || ""

  if (!token || !verifyDocumentAccessToken(token, accessKey)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  if (downloadRequested && !doc.allowDownload) {
    return { error: NextResponse.json({ error: "Downloading is disabled for this file" }, { status: 403 }) }
  }

  return { doc }
}

export async function HEAD(request: NextRequest, { params }: { params: Promise<{ accessKey: string }> }) {
  try {
    const { accessKey } = await params
    const downloadRequested = request.nextUrl.searchParams.get("download") === "1"

    const result = await authorizeDocument(accessKey, downloadRequested)

    if (result.error) {
      return result.error
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[Shared Documents] Failed to validate document access:", error)
    return NextResponse.json({ error: "Failed to validate document access" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ accessKey: string }> }) {
  try {
    const { accessKey } = await params
    const downloadRequested = request.nextUrl.searchParams.get("download") === "1"

    const result = await authorizeDocument(accessKey, downloadRequested)

    if (result.error) {
      return result.error
    }

    const doc = result.doc

    const expiresAt = Math.floor(Date.now() / 1000) + 60
    const isImagePreview = !downloadRequested && String(doc.mimeType || "").startsWith("image/")

    let signedUrl = ""
    if (isImagePreview) {
      signedUrl = cloudinary.url(doc.cloudinaryPublicId, {
        resource_type: doc.cloudinaryResourceType,
        type: "authenticated",
        sign_url: true,
        secure: true,
        expires_at: expiresAt,
        transformation: [
          { width: 900, crop: "limit" },
          { quality: "20" },
          { effect: "blur:300" },
          { fetch_format: "jpg" },
        ],
      })
    } else {
      const fileFormat = getFileFormat(doc)
      const resolvedFileFormat = fileFormat || ""

      if (!resolvedFileFormat) {
        return NextResponse.json({ error: "Unable to infer file format" }, { status: 500 })
      }

      signedUrl = cloudinary.utils.private_download_url(doc.cloudinaryPublicId, resolvedFileFormat, {
        resource_type: doc.cloudinaryResourceType,
        type: "authenticated",
        expires_at: expiresAt,
        attachment: false,
      })
    }

    const upstream = await fetch(signedUrl, { cache: "no-store" })
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        {
          error: "Unable to retrieve file",
          details: `Cloudinary responded with ${upstream.status}`,
        },
        { status: 502 }
      )
    }

    const dispositionType = downloadRequested ? "attachment" : "inline"

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || doc.mimeType || "application/octet-stream",
        "Content-Disposition": `${dispositionType}; filename="${doc.fileName}"`,
        "Cache-Control": "private, no-store, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "X-Robots-Tag": "noindex, noarchive",
      },
    })
  } catch (error) {
    console.error("[Shared Documents] Failed to stream file:", error)
    return NextResponse.json({ error: "Failed to stream document" }, { status: 500 })
  }
}
