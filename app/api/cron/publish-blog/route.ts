import { NextRequest, NextResponse } from "next/server"
import connect_db from "@/config/db"
import BlogTopic from "@/app/models/blog-topic"
import Blog from "@/app/models/blog"
import Project from "@/app/models/project"
import { generateBlogContent, generateProjectBlogContent } from "@/lib/openai"

export const runtime = "nodejs"
export const maxDuration = 60

type TopicContentImage = {
  url: string
  alt: string
  caption?: string
  order: number
}

function buildSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function getUniqueSlug(baseTitle: string) {
  const baseSlug = buildSlug(baseTitle)
  let slug = baseSlug
  let count = 1

  while (await Blog.exists({ slug })) {
    slug = `${baseSlug}-${count++}`
  }

  return slug
}

function applyImagePlaceholders(content: string, images: TopicContentImage[]) {
  let finalContent = content

  images.forEach((image) => {
    const placeholder = `{{img${image.order}}}`
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const replacement = image.caption?.trim()
      ? `![${image.alt}](${image.url})\n\n*${image.caption.trim()}*`
      : `![${image.alt}](${image.url})`

    finalContent = finalContent.replace(new RegExp(escaped, "g"), replacement)
  })

  return finalContent.replace(/\{\{img\d+\}\}/g, "")
}

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
  const isVercelCron = request.headers.has("x-vercel-cron")
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")
  const isManualSecret = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (!isVercelCron && !isManualSecret) {
    console.warn("[Cron] Unauthorized publish attempt blocked")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.info(`[Cron] Publish requested via ${isVercelCron ? "vercel-cron" : "manual-secret"}`)

  // ── Pick next unused topic ─────────────────────────────────────────────────
  await connect_db()

  const topic = await BlogTopic.findOne({ isUsed: false }).sort({ queueOrder: 1, createdAt: 1 })

  if (!topic) {
    console.info("[Cron] No queued topics found. Falling back to project-based generation.")

    try {
      const usedProjectIds = await Blog.distinct("sourceProjectId", {
        sourceProjectId: { $ne: null },
      })

      const fallbackProject = await Project.findOne({
        isActive: true,
        _id: { $nin: usedProjectIds },
      })
        .sort({ createdAt: -1 })
        .lean() as any

      if (!fallbackProject) {
        console.info("[Cron] No eligible projects available for fallback generation.")
        return NextResponse.json({ message: "No topics or fallback projects available" })
      }

      const projectContent = await generateProjectBlogContent({
        title: fallbackProject.title,
        category: fallbackProject.category,
        type: fallbackProject.type,
        description: fallbackProject.description,
      })

      const slug = await getUniqueSlug(projectContent.title)

      const blog = await Blog.create({
        title: projectContent.title,
        slug,
        description: projectContent.description,
        content: projectContent.content,
        image: fallbackProject.image ?? null,
        sourceProjectId: fallbackProject._id.toString(),
        tags: projectContent.tags,
        isPublished: true,
      })

      console.info(`[Cron] Published fallback project blog "${projectContent.title}" (id: ${blog._id})`)

      return NextResponse.json({
        message: "Fallback project blog published successfully",
        blogId: blog._id.toString(),
        title: projectContent.title,
        source: "project-fallback",
      })
    } catch (error) {
      console.error("[Cron] Error during project fallback generation:", error)
      return NextResponse.json({ error: "Failed to generate fallback blog" }, { status: 500 })
    }
  }

  console.info(`[Cron] Generating blog for topic: "${topic.title}"`)

  // ── Generate content via OpenAI ────────────────────────────────────────────
  try {
    const topicImages = (topic.contentImages ?? []) as TopicContentImage[]

    const { title, description, content, tags } = await generateBlogContent(
      topic.title,
      topic.description ?? "",
      topicImages.length
    )
    const contentWithImages = applyImagePlaceholders(content, topicImages)

    // ── Unique slug ────────────────────────────────────────────────────────────
    const slug = await getUniqueSlug(title)

    // ── Save blog ──────────────────────────────────────────────────────────────
    const blog = await Blog.create({
      title,
      slug,
      description,
      content: contentWithImages,
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
