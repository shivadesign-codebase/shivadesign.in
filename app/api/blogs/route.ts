import { NextResponse } from "next/server"
import connect_db from "@/config/db"
import Blog from "@/app/models/blog"

// GET all published blogs (public)
export async function GET() {
  try {
    await connect_db()
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("title slug description image tags createdAt")
      .lean()
    return NextResponse.json({ blogs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
