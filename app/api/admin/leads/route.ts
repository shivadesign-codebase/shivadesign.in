import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Lead from "@/app/models/lead"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    await connect_db()
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      { leads },
      { status: 200, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  } catch (error) {
    console.error("[Admin Leads] Failed to fetch leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    await connect_db()

    const lead = await Lead.findById(id)
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const nextReadStatus = typeof body.isRead === "boolean" ? body.isRead : !lead.isRead
    lead.isRead = nextReadStatus
    await lead.save()

    return NextResponse.json({ message: "Lead updated", lead }, { status: 200 })
  } catch (error) {
    console.error("[Admin Leads] Failed to update lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}
