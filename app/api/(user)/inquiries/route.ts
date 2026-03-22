import { NextRequest, NextResponse } from "next/server"
import connect_db from "@/config/db"
import Contact from "@/app/models/contact"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const subject = typeof body.subject === "string" ? body.subject.trim() : ""
    const service = typeof body.service === "string" ? body.service.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const consent = Boolean(body.consent)

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject and message are required" }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    await connect_db()

    const inquiry = await Contact.create({
      name,
      email,
      phone,
      subject,
      service,
      message,
      consent: true,
      status: "new",
      isRead: false,
    })

    return NextResponse.json({ message: "Inquiry submitted", id: inquiry._id.toString() }, { status: 201 })
  } catch (error) {
    console.error("[Inquiries] Error while saving inquiry:", error)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}