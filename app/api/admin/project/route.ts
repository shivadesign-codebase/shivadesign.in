import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Project from "@/app/models/project"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    await connect_db()

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 6
    const search = (searchParams.get("search") || "").trim()

    const skip = (page - 1) * limit

    const query: any = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ]
    }

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(query),
    ])

    return NextResponse.json(
      {
        projects,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  } catch (error) {
    console.error("Error fetching admin projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// CREATE a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await connect_db()

    const newProject = new Project({
      title: body.title,
      category: body.category,
      type: body.type,
      description: body.description,
      image: body.image || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
    })

    const savedProject = await newProject.save()

    return NextResponse.json({ message: "Project created successfully", project: savedProject })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connect_db()

    const deletedProject = await Project.findByIdAndDelete(id)
    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE an existing project
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connect_db()

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(), // ensure updatedAt is refreshed if not handled by Mongoose
      },
      { new: true }
    )

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project updated successfully", project: updatedProject })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
