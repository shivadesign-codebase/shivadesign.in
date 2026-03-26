import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import connect_db from "@/config/db"
import Client from "@/app/models/client"
import { findPotentialClientDuplicate, normalizeClientPayload } from "@/lib/client-utils"
import { searchClientsWithSummary } from "@/lib/client-search"

async function ensureAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value || ""
  return token === "logged_in"
}

export async function GET(request: NextRequest) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connect_db()

    const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""
    const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || 20), 100)
    const clients = await searchClientsWithSummary(search, limit)

    return NextResponse.json({ clients }, { status: 200 })
  } catch (error) {
    console.error("[Admin Clients] Failed to fetch clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connect_db()

    const body = await request.json()
    const payload = normalizeClientPayload(body)

    if (!payload.name) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 })
    }

    const duplicate = await findPotentialClientDuplicate(payload)
    if (duplicate) {
      return NextResponse.json(
        { error: "A client with the same mobile number or email already exists", duplicate },
        { status: 409 }
      )
    }

    const client = await Client.create(payload)

    return NextResponse.json({ client }, { status: 201 })
  } catch (error) {
    console.error("[Admin Clients] Failed to create client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
