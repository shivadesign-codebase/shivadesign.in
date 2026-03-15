import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Blog from "@/app/models/blog"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// GET all blogs (admin — published + drafts)
export async function GET() {
  try {
    await connect_db()
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ blogs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await connect_db()

    const baseSlug = generateSlug(body.title)
    let slug = baseSlug
    let count = 1

    // Ensure slug uniqueness
    while (await Blog.exists({ slug })) {
      slug = `${baseSlug}-${count++}`
    }

    const newBlog = new Blog({
      title: body.title,
      slug,
      description: body.description,
      content: body.content,
      image: body.image || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      isPublished: body.isPublished ?? false,
    })

    const saved = await newBlog.save()
    return NextResponse.json({ message: "Blog created successfully", blog: saved }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH update a blog
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    await connect_db()

    const updated = await Blog.findByIdAndUpdate(id, { ...body }, { new: true })
    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog updated successfully", blog: updated })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a blog
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    await connect_db()

    const deleted = await Blog.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
