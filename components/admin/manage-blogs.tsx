"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Globe, EyeOff, Loader2, Pencil } from "lucide-react"
import EditBlogDialog from "@/components/admin/edit-blog-dialog"
import { toast } from "sonner"

type Blog = {
  _id: string
  title: string
  description: string
  content?: string
  image?: string
  tags: string[]
  isPublished: boolean
  createdAt: string
}

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blog")
      const data = await res.json()
      setBlogs(data.blogs ?? [])
    } catch {
      toast("Error", { description: "Failed to load blogs." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBlogs() }, [])

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      })
      if (!res.ok) throw new Error()
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isPublished: !current } : b))
      )
      toast("Updated", { description: `Blog ${!current ? "published" : "unpublished"}.` })
    } catch {
      toast("Error", { description: "Failed to update blog status." })
    }
  }

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      toast("Deleted", { description: "Blog deleted successfully." })
    } catch {
      toast("Error", { description: "Failed to delete blog." })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (blogs.length === 0) {
    return <p className="text-muted-foreground text-sm py-10 text-center">No blog articles yet. Write your first one!</p>
  }

  return (
    <>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card key={blog._id}>
            <CardContent className="p-4 flex gap-4 items-start">
              {blog.image && (
                <div className="relative w-24 h-20 shrink-0 rounded overflow-hidden">
                  <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{blog.title}</h3>
                  <Badge variant={blog.isPublished ? "default" : "secondary"}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{blog.description}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingBlog(blog)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublish(blog._id, blog.isPublished)}
                >
                  {blog.isPublished ? (
                    <><EyeOff className="h-4 w-4 mr-1" /> Unpublish</>
                  ) : (
                    <><Globe className="h-4 w-4 mr-1" /> Publish</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBlog(blog._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingBlog && (
        <EditBlogDialog
          blog={editingBlog}
          isOpen={Boolean(editingBlog)}
          onClose={() => setEditingBlog(null)}
          onUpdated={(updatedBlog) => {
            setBlogs((prev) => prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog)))
          }}
        />
      )}
    </>
  )
}
