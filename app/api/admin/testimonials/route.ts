import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Testimonial from "@/app/models/testimonial"

export async function GET() {
  try {
    await connect_db()
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ testimonials }, { status: 200 })
  } catch (error) {
    console.error("[Admin Testimonials] Failed to fetch testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 })
    }

    await connect_db()

    const testimonial = await Testimonial.findById(id)
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    const nextPublicStatus = typeof body.isPublic === "boolean" ? body.isPublic : !testimonial.isPublic
    testimonial.isPublic = nextPublicStatus
    await testimonial.save()

    return NextResponse.json({ message: "Testimonial updated", testimonial }, { status: 200 })
  } catch (error) {
    console.error("[Admin Testimonials] Failed to update testimonial:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}
