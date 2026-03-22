import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import cloudinary from "@/lib/cloudinary"
import { getDocumentAccessCookieName, verifyDocumentAccessToken } from "@/lib/document-security"

export const runtime = "nodejs"

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
    const signedUrl = cloudinary.url(doc.cloudinaryPublicId, {
      resource_type: doc.cloudinaryResourceType,
      type: "authenticated",
      sign_url: true,
      secure: true,
      expires_at: expiresAt,
    })

    const upstream = await fetch(signedUrl, { cache: "no-store" })
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Unable to retrieve file" }, { status: 502 })
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
