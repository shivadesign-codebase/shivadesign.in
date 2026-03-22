import { NextResponse } from "next/server"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import cloudinary from "@/lib/cloudinary"
import { createDocumentAccessKey, hashDocumentPassword } from "@/lib/document-security"

export const runtime = "nodejs"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/jpg"])

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
    await connect_db()

    const documents = await SharedDocument.find({}).sort({ createdAt: -1 }).lean()
    const now = Date.now()

    const normalized = documents.map((item: any) => ({
      _id: String(item._id),
      title: item.title,
      clientName: item.clientName,
      fileName: item.fileName,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      expiresAt: item.expiresAt,
      allowDownload: item.allowDownload,
      isClientAccessRevoked: item.isClientAccessRevoked,
      accessKey: item.accessKey,
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
    await connect_db()

    const formData = await request.formData()
    const title = String(formData.get("title") || "").trim()
    const clientName = String(formData.get("clientName") || "").trim()
    const password = String(formData.get("password") || "")
    const expiresAtInput = String(formData.get("expiresAt") || "")
    const allowDownload = String(formData.get("allowDownload") || "false") === "true"
    const file = formData.get("file") as File | null

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!clientName) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 })
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

    const doc = await SharedDocument.create({
      title,
      clientName,
      accessKey: createDocumentAccessKey(),
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      cloudinaryPublicId: uploaded.public_id,
      cloudinaryResourceType: uploaded.resource_type || "raw",
      accessPasswordHash: hashDocumentPassword(password),
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
