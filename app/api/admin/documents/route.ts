import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import cloudinary from "@/lib/cloudinary"
import { getClientSnapshot } from "@/lib/client-utils"
import {
  createDocumentAccessKey,
  decryptDocumentPassword,
  encryptDocumentPassword,
  hashDocumentPassword,
} from "@/lib/document-security"

export const runtime = "nodejs"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/jpg"])

async function ensureAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value || ""
  return token === "logged_in"
}

function parseExpiresAt(value: string | null) {
  if (!value) return null
  const date = new Date(`${value}T23:59:59.999Z`)
  if (Number.isNaN(date.getTime())) return null
  return date
}

async function uploadBufferToCloudinary(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const resourceType = mimeType === "application/pdf" ? "raw" : "image"

  return await new Promise<any>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "shiva-design/documents",
        resource_type: resourceType,
        type: "authenticated",
        use_filename: true,
        unique_filename: true,
        filename_override: fileName,
        format: mimeType === "application/pdf" ? "pdf" : undefined,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(new Error("No upload result returned by Cloudinary"))
          return
        }

        resolve(result)
      }
    )

    upload.end(fileBuffer)
  })
}

export async function GET() {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connect_db()

    const documents = await SharedDocument.find({}).sort({ createdAt: -1 }).lean()
    const now = Date.now()

    const normalized = documents.map((item: any) => ({
      _id: String(item._id),
      title: item.title,
      clientName: item.clientName,
      clientMobile: item.clientMobile || "",
      clientEmail: item.clientEmail || "",
      clientId: item.clientId ? String(item.clientId) : "",
      fileName: item.fileName,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      expiresAt: item.expiresAt,
      allowDownload: item.allowDownload,
      isClientAccessRevoked: item.isClientAccessRevoked,
      accessKey: item.accessKey,
      accessPassword: decryptDocumentPassword(item.accessPasswordEncrypted || ""),
      createdAt: item.createdAt,
      isExpired: item.expiresAt ? new Date(item.expiresAt).getTime() < now : false,
    }))

    return NextResponse.json({ documents: normalized }, { status: 200 })
  } catch (error) {
    console.error("[Admin Documents] Failed to fetch documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connect_db()

    const formData = await request.formData()
    const title = String(formData.get("title") || "").trim()
    const clientId = String(formData.get("clientId") || "").trim()
    const password = String(formData.get("password") || "")
    const expiresAtInput = String(formData.get("expiresAt") || "")
    const allowDownload = String(formData.get("allowDownload") || "false") === "true"
    const file = formData.get("file") as File | null

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!clientId) {
      return NextResponse.json({ error: "Client selection is required" }, { status: 400 })
    }

    if (!password || password.length < 4) {
      return NextResponse.json({ error: "Password is required and must be at least 4 characters" }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PDF, PNG, and JPG files are allowed" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const uploaded = await uploadBufferToCloudinary(fileBuffer, file.name, file.type)
    const clientSnapshot = await getClientSnapshot(clientId)

    const doc = await SharedDocument.create({
      title,
      clientId: clientSnapshot.clientId,
      clientName: clientSnapshot.clientName,
      clientMobile: clientSnapshot.clientMobile,
      clientEmail: clientSnapshot.clientEmail,
      accessKey: createDocumentAccessKey(),
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      cloudinaryPublicId: uploaded.public_id,
      cloudinaryResourceType: uploaded.resource_type || "raw",
      accessPasswordHash: hashDocumentPassword(password),
      accessPasswordEncrypted: encryptDocumentPassword(password),
      expiresAt: parseExpiresAt(expiresAtInput),
      allowDownload,
      isClientAccessRevoked: false,
    })

    return NextResponse.json(
      {
        message: "Document uploaded successfully",
        document: {
          _id: String(doc._id),
          title: doc.title,
          clientName: doc.clientName,
          clientId: doc.clientId ? String(doc.clientId) : "",
          accessKey: doc.accessKey,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Admin Documents] Failed to upload document:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
}
