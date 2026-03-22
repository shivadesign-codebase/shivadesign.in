import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import BlogTopic from "@/app/models/blog-topic"

type TopicContentImageInput = {
  url: string
  alt: string
  caption?: string
  order: number
}

function normalizeContentImages(input: unknown): TopicContentImageInput[] {
  if (!Array.isArray(input)) return []

  const cleaned = input
    .filter((img): img is Partial<TopicContentImageInput> => !!img && typeof img === "object")
    .map((img, idx) => ({
      url: typeof img.url === "string" ? img.url.trim() : "",
      alt: typeof img.alt === "string" ? img.alt.trim() : "",
      caption: typeof img.caption === "string" ? img.caption.trim() : "",
      order: idx + 1,
    }))
    .filter((img) => img.url)

  return cleaned.slice(0, 5)
}

function validateContentImages(images: TopicContentImageInput[]) {
  if (images.length > 5) {
    return "Only up to 5 content images are allowed"
  }

  for (const image of images) {
    if (!image.url) {
      return "Each content image must include a URL"
    }
    if (!image.alt) {
      return "Each content image must include alt text"
    }
    if (image.alt.length > 160) {
      return "Image alt text must be 160 characters or less"
    }
    if ((image.caption ?? "").length > 240) {
      return "Image caption must be 240 characters or less"
    }
  }

  return null
}

// GET all topics
export async function GET() {
  try {
    await connect_db()
    const topics = await BlogTopic.find({}).sort({ queueOrder: 1, createdAt: 1 }).lean()
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

    const contentImages = normalizeContentImages(body.contentImages)
    const contentImageValidationError = validateContentImages(contentImages)
    if (contentImageValidationError) {
      return NextResponse.json({ error: contentImageValidationError }, { status: 400 })
    }

    await connect_db()
    const lastTopic = (await BlogTopic.findOne({}).sort({ queueOrder: -1 }).lean()) as any
    const nextQueueOrder = typeof lastTopic?.queueOrder === "number" ? lastTopic.queueOrder + 1 : 1

    const topic = await BlogTopic.create({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      thumbnail: body.thumbnail ?? null,
      contentImages,
      queueOrder: nextQueueOrder,
    })

    return NextResponse.json({ message: "Topic added", topic }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH manage a topic (edit/move/reset)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 })
    }

    const contentImages = normalizeContentImages(body.contentImages)
    const contentImageValidationError = Array.isArray(body.contentImages)
      ? validateContentImages(contentImages)
      : null
    if (contentImageValidationError) {
      return NextResponse.json({ error: contentImageValidationError }, { status: 400 })
    }

    await connect_db()

    const topic = await BlogTopic.findById(id)
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    if (action === "move-up" || action === "move-down") {
      if (topic.isUsed) {
        return NextResponse.json({ error: "Published topics cannot be reordered" }, { status: 400 })
      }

      const comparator = action === "move-up" ? "$lt" : "$gt"
      const direction = action === "move-up" ? -1 : 1

      const neighbor = await BlogTopic.findOne({
        isUsed: false,
        queueOrder: { [comparator]: topic.queueOrder },
      }).sort({ queueOrder: direction })

      if (!neighbor) {
        return NextResponse.json({ message: "Already at boundary", topic })
      }

      const currentOrder = topic.queueOrder
      topic.queueOrder = neighbor.queueOrder
      neighbor.queueOrder = currentOrder

      await topic.save()
      await neighbor.save()

      return NextResponse.json({ message: "Queue order updated" })
    }

    if (action === "reset") {
      const lastPending = (await BlogTopic.findOne({ isUsed: false }).sort({ queueOrder: -1 }).lean()) as any
      const nextQueueOrder = typeof lastPending?.queueOrder === "number" ? lastPending.queueOrder + 1 : topic.queueOrder

      topic.isUsed = false
      topic.usedAt = null
      topic.blogId = null
      topic.queueOrder = nextQueueOrder
      await topic.save()
      return NextResponse.json({ message: "Topic reset to pending", topic })
    }

    // default edit action
    if (typeof body.title === "string") {
      topic.title = body.title.trim()
    }
    if (typeof body.description === "string") {
      topic.description = body.description.trim()
    }
    if (typeof body.thumbnail === "string" || body.thumbnail === null) {
      topic.thumbnail = body.thumbnail
    }
    if (Array.isArray(body.contentImages)) {
      topic.contentImages = contentImages
    }

    await topic.save()
    return NextResponse.json({ message: "Topic updated", topic })
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
