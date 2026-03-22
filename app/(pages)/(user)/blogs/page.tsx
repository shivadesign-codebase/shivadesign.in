import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
import { ArrowUpRight, CalendarDays } from "lucide-react"
import connect_db from "@/config/db"
import Blog from "@/app/models/blog"
import ConsultationCtaCard from "@/components/consultation-cta-card"

export const metadata: Metadata = {
  title: "Blog | Shiva Design Associates",
  description:
    "Read articles on architecture, interior design, Vastu, and construction tips from the experts at Shiva Design Associates, Maharajganj.",
}

type BlogSummary = {
  _id: string
  title: string
  description: string
  image?: string
  tags: string[]
  createdAt: string
}

async function getPublishedBlogs(): Promise<BlogSummary[]> {
  await connect_db()
  const blogs = await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .select("title description image tags createdAt")
    .lean()
  return blogs.map((b: any) => ({
    _id: b._id.toString(),
    title: b.title,
    description: b.description,
    image: b.image ?? null,
    tags: b.tags ?? [],
    createdAt: b.createdAt.toISOString(),
  }))
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs()

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">

      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-orange-100 via-background to-amber-100 px-7 py-10 md:px-10 md:py-14 mb-16">
        <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-orange-200/60 blur-2xl" />
        <div className="absolute -bottom-10 left-14 h-24 w-24 rounded-full bg-amber-300/40 blur-xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knowledge Library</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif font-semibold">Architecture & Design Insights</h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            In-depth articles on architecture, interior design, Vastu, and practical construction decisions for homes across Maharajganj and nearby cities.
          </p>
        </div>
      </div>

      <ConsultationCtaCard
        source="blogs"
        pagePath="/blogs"
        displayMode="popup"
        dismissible
        className="max-w-md sm:max-w-xl"
      />

      {blogs.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No articles published yet. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
            >

              {blog.image ? (
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-52 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No cover image</span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                <h2 className="font-semibold text-lg leading-snug group-hover:underline line-clamp-2">
                  {blog.title}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                  {blog.description}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>

            </Link>
          ))}
        </div>
      )}

    </section>
  )
}
