import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import cloudinary from "@/lib/cloudinary"
import { encryptDocumentPassword, hashDocumentPassword } from "@/lib/document-security"

export const runtime = "nodejs"

async function ensureAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value || ""
  return token === "logged_in"
}

function parseExpiresAt(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T23:59:59.999Z`)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
    }

    await connect_db()

    const body = await request.json()

    const updates: Record<string, unknown> = {}

    if (typeof body.title === "string") {
      updates.title = body.title.trim()
    }

    if (typeof body.clientName === "string") {
      updates.clientName = body.clientName.trim()
    }

    if (typeof body.clientMobile === "string") {
      updates.clientMobile = body.clientMobile.trim() || null
    }

    if (typeof body.allowDownload === "boolean") {
      updates.allowDownload = body.allowDownload
    }

    if (typeof body.isClientAccessRevoked === "boolean") {
      updates.isClientAccessRevoked = body.isClientAccessRevoked
    }

    if (typeof body.password === "string" && body.password.trim()) {
      const trimmed = body.password.trim()
      updates.accessPasswordHash = hashDocumentPassword(trimmed)
      updates.accessPasswordEncrypted = encryptDocumentPassword(trimmed)
    }

    if (body.expiresAt === null || body.expiresAt === "") {
      updates.expiresAt = null
    } else if (typeof body.expiresAt === "string") {
      updates.expiresAt = parseExpiresAt(body.expiresAt)
    }

    const updated = await SharedDocument.findByIdAndUpdate(id, updates, { new: true })

    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Document updated", document: updated }, { status: 200 })
  } catch (error) {
    console.error("[Admin Documents] Failed to update document:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
    }

    await connect_db()

    const doc = await SharedDocument.findByIdAndDelete(id)

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    try {
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
        resource_type: doc.cloudinaryResourceType,
        type: "authenticated",
      })
    } catch (cloudinaryError) {
      console.error("[Admin Documents] Cloudinary delete failed:", cloudinaryError)
    }

    return NextResponse.json({ message: "Document deleted" }, { status: 200 })
  } catch (error) {
    console.error("[Admin Documents] Failed to delete document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
