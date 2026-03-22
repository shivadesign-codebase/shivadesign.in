import { NextRequest, NextResponse } from "next/server"
import connect_db from "@/config/db"
import Lead from "@/app/models/lead"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const source = typeof body.source === "string" ? body.source.trim() : "home"
    const pagePath = typeof body.pagePath === "string" ? body.pagePath.trim() : ""

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Provide at least one contact method: email or mobile number" },
        { status: 400 }
      )
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    await connect_db()

    const lead = await Lead.create({
      name,
      email: email || null,
      phone: phone || null,
      source: ["home", "blogs", "blog-detail"].includes(source) ? source : "home",
      pagePath,
    })

    return NextResponse.json({ message: "Lead submitted", id: lead._id.toString() }, { status: 201 })
  } catch (error) {
    console.error("[Leads] Error while saving lead:", error)
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 })
  }
}
