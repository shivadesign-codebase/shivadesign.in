import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
import { CalendarDays } from "lucide-react"
import connect_db from "@/config/db"
import Blog from "@/app/models/blog"

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
    <section className="max-w-6xl mx-auto px-6 py-24">

      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold">Blog</h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Insights on architecture, interior design, Vastu, and construction — straight from our studio.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No articles published yet. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog._id}`} className="group flex flex-col rounded-xl overflow-hidden border hover:shadow-md transition-shadow">

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
              </div>

            </Link>
          ))}
        </div>
      )}

    </section>
  )
}
