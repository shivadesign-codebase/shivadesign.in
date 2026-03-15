import { NextRequest, NextResponse } from "next/server"
import connect_db from "@/config/db"
import BlogTopic from "@/app/models/blog-topic"
import Blog from "@/app/models/blog"
import { generateBlogContent } from "@/lib/openai"

/**
 * Cron endpoint — called daily by Vercel Cron.
 * Protected by CRON_SECRET header check.
 *
 * Picks the oldest unused topic, generates a blog post with OpenAI,
 * publishes it, and marks the topic as used.
 *
 * Also accessible manually via GET /api/cron/publish-blog
 * with the correct Authorization header for testing.
 */
export async function GET(request: NextRequest) {
  // ── Security ──────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── Pick next unused topic ─────────────────────────────────────────────────
  await connect_db()

  const topic = await BlogTopic.findOne({ isUsed: false }).sort({ queueOrder: 1, createdAt: 1 })

  if (!topic) {
    console.info("[Cron] No unused blog topics found. Skipping.")
    return NextResponse.json({ message: "No topics available" })
  }

  console.info(`[Cron] Generating blog for topic: "${topic.title}"`)

  // ── Generate content via OpenAI ────────────────────────────────────────────
  try {
    const { title, description, content, tags } = await generateBlogContent(
      topic.title,
      topic.description ?? ""
    )

    // ── Unique slug ────────────────────────────────────────────────────────────
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    let slug = baseSlug
    let count = 1
    while (await Blog.exists({ slug })) {
      slug = `${baseSlug}-${count++}`
    }

    // ── Save blog ──────────────────────────────────────────────────────────────
    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      image: topic.thumbnail ?? null,
      tags,
      isPublished: true,
    })

    // ── Mark topic as used ─────────────────────────────────────────────────────
    await BlogTopic.findByIdAndUpdate(topic._id, {
      isUsed: true,
      usedAt: new Date(),
      blogId: blog._id.toString(),
    })

    console.info(`[Cron] Published blog "${title}" (id: ${blog._id})`)

    return NextResponse.json({
      message: "Blog published successfully",
      blogId: blog._id.toString(),
      title,
    })
  } catch (error) {
    console.error("[Cron] Error generating/publishing blog:", error)
    return NextResponse.json({ error: "Failed to generate blog" }, { status: 500 })
  }
}
