import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Banner from "@/app/models/banner"

// UPDATE the banner link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { link } = body

    if (!link) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 })
    }

    await connect_db()

    const banner = await Banner.findOneAndUpdate(
      {},
      { link },
      { new: true, upsert: true }
    )

    return NextResponse.json({ message: "Banner link updated successfully", banner })
  } catch (error) {
    console.error("Error updating banner link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
