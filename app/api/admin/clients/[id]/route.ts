import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import connect_db from "@/config/db"
import Client from "@/app/models/client"
import Project from "@/app/models/project"
import SharedDocument from "@/app/models/document"
import { normalizeClientPayload } from "@/lib/client-utils"

async function ensureAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value || ""
  return token === "logged_in"
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    await connect_db()

    const client = await Client.findById(id).lean()
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const [projects, documents] = await Promise.all([
      Project.find({ clientId: id })
        .sort({ createdAt: -1 })
        .select("_id title category type isActive createdAt")
        .lean(),
      SharedDocument.find({ clientId: id })
        .sort({ createdAt: -1 })
        .select("_id title fileName allowDownload isClientAccessRevoked expiresAt createdAt accessKey")
        .lean(),
    ])

    return NextResponse.json(
      {
        client,
        summary: {
          projectCount: projects.length,
          activeProjectCount: projects.filter((project: any) => project.isActive).length,
          documentCount: documents.length,
          activeDocumentCount: documents.filter((doc: any) => !doc.isClientAccessRevoked).length,
        },
        projects,
        documents,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Admin Clients] Failed to fetch client detail:", error)
    return NextResponse.json({ error: "Failed to fetch client detail" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
    }

    await connect_db()

    const body = await request.json()
    const payload = normalizeClientPayload(body)
    if (!payload.name) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 })
    }

    const updatedClient = await Client.findByIdAndUpdate(id, payload, { new: true })
    if (!updatedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const snapshot = {
      clientName: updatedClient.name,
      clientMobile: updatedClient.mobile ?? null,
      clientEmail: updatedClient.email ?? null,
    }

    await Promise.all([
      Project.updateMany({ clientId: id }, snapshot),
      SharedDocument.updateMany({ clientId: id }, snapshot),
    ])

    return NextResponse.json({ client: updatedClient }, { status: 200 })
  } catch (error) {
    console.error("[Admin Clients] Failed to update client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}
