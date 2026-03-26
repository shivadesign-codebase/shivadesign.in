import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Contact from "@/app/models/contact"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    await connect_db()
    const inquiries = await Contact.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      { inquiries },
      { status: 200, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  } catch (error) {
    console.error("[Admin Inquiries] Failed to fetch inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid inquiry ID" }, { status: 400 })
    }

    await connect_db()

    const update: { status?: "new" | "replied" | "closed"; isRead?: boolean } = {}

    if (typeof body.status === "string" && ["new", "replied", "closed"].includes(body.status)) {
      update.status = body.status as "new" | "replied" | "closed"
    }

    if (typeof body.isRead === "boolean") {
      update.isRead = body.isRead
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const inquiry = await Contact.findByIdAndUpdate(id, update, { new: true })
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Inquiry updated", inquiry }, { status: 200 })
  } catch (error) {
    console.error("[Admin Inquiries] Failed to update inquiry:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid inquiry ID" }, { status: 400 })
    }

    await connect_db()

    const deleted = await Contact.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Inquiry deleted" }, { status: 200 })
  } catch (error) {
    console.error("[Admin Inquiries] Failed to delete inquiry:", error)
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}