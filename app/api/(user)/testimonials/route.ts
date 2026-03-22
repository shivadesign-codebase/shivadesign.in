import { NextRequest, NextResponse } from "next/server"
import connect_db from "@/config/db"
import Testimonial from "@/app/models/testimonial"

function isValidRating(rating: number) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

export async function GET() {
  try {
    await connect_db()
    const testimonials = await Testimonial.find({ isPublic: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ testimonials }, { status: 200 })
  } catch (error) {
    console.error("[Testimonials] Failed to fetch public testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const designation = typeof body.designation === "string" ? body.designation.trim() : ""
    const rating = Number(body.rating)

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: "Feedback message is required" }, { status: 400 })
    }

    if (!isValidRating(rating)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    await connect_db()

    const testimonial = await Testimonial.create({
      name,
      message,
      rating,
      designation: designation || "",
      isPublic: false,
    })

    return NextResponse.json(
      {
        message: "Thanks for your feedback. It will be visible after admin review.",
        id: testimonial._id.toString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Testimonials] Failed to save testimonial:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
