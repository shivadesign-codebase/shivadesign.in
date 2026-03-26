"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DEFAULT_PINTEREST_EXPORT_COLUMNS,
  PINTEREST_EXPORT_COLUMNS,
  type PinterestExportColumn,
} from "@/lib/blog-pinterest-export"
import { Trash2, Globe, EyeOff, Loader2, Pencil, Download, Search } from "lucide-react"
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

const DEFAULT_COLUMN_SELECTION = [...DEFAULT_PINTEREST_EXPORT_COLUMNS]

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<PinterestExportColumn[]>(DEFAULT_COLUMN_SELECTION)
  const [daysFilter, setDaysFilter] = useState("")
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([])
  const [blogSearch, setBlogSearch] = useState("")

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

  const publishedBlogs = blogs.filter((blog) => blog.isPublished)
  const publishedBlogIds = publishedBlogs.map((blog) => blog._id)
  const filteredPublishedBlogs = publishedBlogs.filter((blog) => {
    const query = blogSearch.trim().toLowerCase()
    if (!query) return true
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  useEffect(() => {
    setSelectedBlogIds((current) => current.filter((id) => publishedBlogIds.includes(id)))
  }, [blogs])

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

  const toggleColumn = (column: PinterestExportColumn, checked: boolean) => {
    setSelectedColumns((current) => {
      if (checked) {
        return PINTEREST_EXPORT_COLUMNS
          .map((item) => item.key)
          .filter((key) => key === column || current.includes(key))
      }
      return current.filter((key) => key !== column)
    })
  }

  const toggleBlogSelection = (blogId: string, checked: boolean) => {
    setSelectedBlogIds((current) => {
      if (checked) {
        return current.includes(blogId) ? current : [...current, blogId]
      }
      return current.filter((id) => id !== blogId)
    })
  }

  const resetExportOptions = () => {
    setSelectedColumns(DEFAULT_COLUMN_SELECTION)
    setDaysFilter("")
    setSelectedBlogIds([])
    setBlogSearch("")
  }

  const downloadPinterestCsv = () => {
    if (selectedColumns.length === 0) {
      toast("Select columns", { description: "Choose at least one CSV column." })
      return
    }

    const trimmedDays = daysFilter.trim()
    if (trimmedDays && (!/^\d+$/.test(trimmedDays) || Number(trimmedDays) < 1)) {
      toast("Invalid days", { description: "Days filter must be a positive number." })
      return
    }

    const params = new URLSearchParams({
      format: "csv",
      columns: selectedColumns.join(","),
    })

    if (trimmedDays) {
      params.set("days", trimmedDays)
    }

    if (selectedBlogIds.length > 0) {
      params.set("blogIds", selectedBlogIds.join(","))
    }

    window.location.href = `/api/admin/blog-pinterest-export?${params.toString()}`
    setIsExportDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const exportButton = (
    <Button
      variant="outline"
      onClick={() => setIsExportDialogOpen(true)}
      disabled={publishedBlogs.length === 0}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Pinterest CSV
    </Button>
  )

  if (blogs.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex justify-end">
            {exportButton}
          </div>
          <p className="text-muted-foreground text-sm py-10 text-center">No blog articles yet. Write your first one!</p>
        </div>
        <PinterestExportDialog
          isOpen={isExportDialogOpen}
          onOpenChange={setIsExportDialogOpen}
          selectedColumns={selectedColumns}
          onColumnToggle={toggleColumn}
          daysFilter={daysFilter}
          onDaysFilterChange={setDaysFilter}
          selectedBlogIds={selectedBlogIds}
          onBlogToggle={toggleBlogSelection}
          onReset={resetExportOptions}
          onExport={downloadPinterestCsv}
          blogSearch={blogSearch}
          onBlogSearchChange={setBlogSearch}
          filteredPublishedBlogs={filteredPublishedBlogs}
          publishedBlogsCount={publishedBlogs.length}
          onSelectAllBlogs={() => setSelectedBlogIds(publishedBlogIds)}
          onClearBlogs={() => setSelectedBlogIds([])}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        {exportButton}
      </div>

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

      <PinterestExportDialog
        isOpen={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        selectedColumns={selectedColumns}
        onColumnToggle={toggleColumn}
        daysFilter={daysFilter}
        onDaysFilterChange={setDaysFilter}
        selectedBlogIds={selectedBlogIds}
        onBlogToggle={toggleBlogSelection}
        onReset={resetExportOptions}
        onExport={downloadPinterestCsv}
        blogSearch={blogSearch}
        onBlogSearchChange={setBlogSearch}
        filteredPublishedBlogs={filteredPublishedBlogs}
        publishedBlogsCount={publishedBlogs.length}
        onSelectAllBlogs={() => setSelectedBlogIds(publishedBlogIds)}
        onClearBlogs={() => setSelectedBlogIds([])}
      />

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

type PinterestExportDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedColumns: PinterestExportColumn[]
  onColumnToggle: (column: PinterestExportColumn, checked: boolean) => void
  daysFilter: string
  onDaysFilterChange: (value: string) => void
  selectedBlogIds: string[]
  onBlogToggle: (blogId: string, checked: boolean) => void
  onReset: () => void
  onExport: () => void
  blogSearch: string
  onBlogSearchChange: (value: string) => void
  filteredPublishedBlogs: Blog[]
  publishedBlogsCount: number
  onSelectAllBlogs: () => void
  onClearBlogs: () => void
}

function PinterestExportDialog({
  isOpen,
  onOpenChange,
  selectedColumns,
  onColumnToggle,
  daysFilter,
  onDaysFilterChange,
  selectedBlogIds,
  onBlogToggle,
  onReset,
  onExport,
  blogSearch,
  onBlogSearchChange,
  filteredPublishedBlogs,
  publishedBlogsCount,
  onSelectAllBlogs,
  onClearBlogs,
}: PinterestExportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pinterest CSV Export</DialogTitle>
          <DialogDescription>
            Choose the CSV columns and filter published blogs by recent days or specific articles.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <Label>CSV Columns</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Select the fields admin wants in the export file.
                </p>
              </div>
              <div className="grid gap-3 rounded-lg border p-4">
                {PINTEREST_EXPORT_COLUMNS.map((column) => (
                  <label key={column.key} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={selectedColumns.includes(column.key)}
                      onCheckedChange={(checked) => onColumnToggle(column.key, checked === true)}
                    />
                    <span>{column.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="pinterest-days">Recent Days Filter</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to include all published blogs.
                </p>
              </div>
              <Input
                id="pinterest-days"
                type="number"
                min="1"
                placeholder="Example: 30"
                value={daysFilter}
                onChange={(event) => onDaysFilterChange(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="blog-search">Blog Filter</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Select individual published blogs, or keep none selected to export all.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {selectedBlogIds.length > 0 ? `${selectedBlogIds.length} selected` : `${publishedBlogsCount} available`}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="blog-search"
                placeholder="Search blogs by title or tag"
                value={blogSearch}
                onChange={(event) => onBlogSearchChange(event.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={onSelectAllBlogs}>
                Select All
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onClearBlogs}>
                Clear
              </Button>
            </div>

            <ScrollArea className="h-72 rounded-lg border">
              <div className="space-y-2 p-4">
                {filteredPublishedBlogs.length > 0 ? (
                  filteredPublishedBlogs.map((blog) => (
                    <label
                      key={blog._id}
                      className="flex items-start gap-3 rounded-md border p-3 text-sm"
                    >
                      <Checkbox
                        checked={selectedBlogIds.includes(blog._id)}
                        onCheckedChange={(checked) => onBlogToggle(blog._id, checked === true)}
                      />
                      <div className="min-w-0">
                        <p className="font-medium leading-5">{blog.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {blog.tags.length > 0 ? ` • ${blog.tags.join(", ")}` : ""}
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No published blogs match this search.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" onClick={onExport} disabled={selectedColumns.length === 0}>
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
