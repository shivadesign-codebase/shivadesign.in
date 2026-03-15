import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import BlogTopic from "@/app/models/blog-topic"

// GET all topics
export async function GET() {
  try {
    await connect_db()
    const topics = await BlogTopic.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ topics })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST add a new topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    await connect_db()
    const topic = await BlogTopic.create({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      thumbnail: body.thumbnail ?? null,
    })

    return NextResponse.json({ message: "Topic added", topic }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a topic
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 })
    }

    await connect_db()
    const deleted = await BlogTopic.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Topic deleted" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
