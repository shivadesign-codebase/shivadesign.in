import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Banner from "@/app/models/banner"

export async function GET() {
  try {
    await connect_db()

    const banners = await Banner.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ banners }, { status: 200 })
  } catch (error) {
    console.error("[Admin Banner] Failed to fetch banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : ""
    const isActive = Boolean(body.isActive)

    if (!imageUrl) {
      return NextResponse.json({ error: "Banner image is required" }, { status: 400 })
    }

    await connect_db()

    if (isActive) {
      await Banner.updateMany({}, { isActive: false })
    }

    const banner = await Banner.create({
      title,
      imageUrl,
      isActive,
    })

    return NextResponse.json({ message: "Banner created", banner }, { status: 201 })
  } catch (error) {
    console.error("[Admin Banner] Failed to create banner:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 })
    }

    await connect_db()

    const updates: Record<string, unknown> = {}

    if (typeof body.title === "string") {
      updates.title = body.title.trim()
    }

    if (typeof body.imageUrl === "string") {
      const trimmed = body.imageUrl.trim()
      if (!trimmed) {
        return NextResponse.json({ error: "Image URL cannot be empty" }, { status: 400 })
      }
      updates.imageUrl = trimmed
    }

    if (typeof body.isActive === "boolean") {
      updates.isActive = body.isActive
      if (body.isActive) {
        await Banner.updateMany({ _id: { $ne: id } }, { isActive: false })
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const banner = await Banner.findByIdAndUpdate(id, updates, { new: true })
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banner updated", banner }, { status: 200 })
  } catch (error) {
    console.error("[Admin Banner] Failed to update banner:", error)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 })
    }

    await connect_db()

    const deleted = await Banner.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banner deleted" }, { status: 200 })
  } catch (error) {
    console.error("[Admin Banner] Failed to delete banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
