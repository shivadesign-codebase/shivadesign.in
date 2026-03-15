import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ArrowLeft } from "lucide-react"
import mongoose from "mongoose"
import connect_db from "@/config/db"
import Blog from "@/app/models/blog"
import BlogMarkdown from "@/components/blog-markdown"
import type { Metadata } from "next"

type BlogPageProps = {
  params: Promise<{ id: string }>
}

async function getBlog(id: string) {
  if (!mongoose.isValidObjectId(id)) return null
  await connect_db()
  const blog = await Blog.findOne({ _id: id, isPublished: true }).lean() as any
  if (!blog) return null
  return {
    _id: blog._id.toString(),
    title: blog.title,
    description: blog.description,
    content: blog.content,
    image: blog.image ?? null,
    tags: blog.tags ?? [],
    createdAt: (blog.createdAt as Date).toISOString(),
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { id } = await params
  const blog = await getBlog(id)
  if (!blog) return { title: "Blog | Shiva Design Associates" }
  return {
    title: `${blog.title} | Shiva Design Associates`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) notFound()

  return (
    <article className="max-w-3xl mx-auto px-6 py-24">

      {/* Back */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight">
        {blog.title}
      </h1>

      {/* Description */}
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {blog.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Cover Image */}
      {blog.image && (
        <div className="relative w-full h-80 mt-8 rounded-xl overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Markdown Content */}
      <div className="mt-12">
        <BlogMarkdown content={blog.content} />
      </div>

      {/* Footer CTA */}
      <div className="mt-16 border-t pt-10 text-center">
        <p className="text-muted-foreground mb-4">Have a project in mind?</p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
        >
          Book a Free Consultation
        </Link>
      </div>

    </article>
  )
}
