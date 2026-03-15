"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Trash2, Loader2, CheckCircle2, Clock, Pencil, ChevronUp, ChevronDown, RotateCcw, Save, X } from "lucide-react"
import { toast } from "sonner"

type Topic = {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  queueOrder: number
  isUsed: boolean
  usedAt?: string
  createdAt: string
}

type FormValues = {
  title: string
  description: string
}

export default function ManageBlogTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editThumbnail, setEditThumbnail] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
  })

  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/admin/blog-topics")
      const data = await res.json()
      setTopics(data.topics ?? [])
    } catch {
      toast("Error", { description: "Failed to load topics." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTopics() }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true)
      const res = await fetch("/api/admin/blog-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, thumbnail }),
      })
      if (!res.ok) throw new Error()
      const { topic } = await res.json()
      setTopics((prev) => [topic, ...prev])
      reset()
      setThumbnail(null)
      toast("Added", { description: "Topic added to the queue." })
    } catch {
      toast("Error", { description: "Failed to add topic." })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteTopic = async (id: string) => {
    if (!confirm("Delete this topic?")) return
    try {
      const res = await fetch("/api/admin/blog-topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setTopics((prev) => prev.filter((t) => t._id !== id))
      toast("Deleted", { description: "Topic removed from queue." })
    } catch {
      toast("Error", { description: "Failed to delete topic." })
    }
  }

  const startEditing = (topic: Topic) => {
    setEditingId(topic._id)
    setEditTitle(topic.title)
    setEditDescription(topic.description ?? "")
    setEditThumbnail(topic.thumbnail ?? null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditThumbnail(null)
  }

  const saveTopic = async (id: string) => {
    try {
      const res = await fetch("/api/admin/blog-topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle,
          description: editDescription,
          thumbnail: editThumbnail,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTopics((prev) => prev.map((t) => (t._id === id ? data.topic : t)))
      cancelEditing()
      toast("Updated", { description: "Topic updated successfully." })
    } catch {
      toast("Error", { description: "Failed to update topic." })
    }
  }

  const moveTopic = async (id: string, action: "move-up" | "move-down") => {
    try {
      const res = await fetch("/api/admin/blog-topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      })
      if (!res.ok) throw new Error()
      await fetchTopics()
    } catch {
      toast("Error", { description: "Failed to reorder queue." })
    }
  }

  const resetTopic = async (id: string) => {
    try {
      const res = await fetch("/api/admin/blog-topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reset" }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTopics((prev) => prev.map((t) => (t._id === id ? data.topic : t)))
      toast("Reset", { description: "Topic moved back to pending queue." })
    } catch {
      toast("Error", { description: "Failed to reset topic." })
    }
  }

  const triggerPublish = async () => {
    const cronSecret = prompt("Enter CRON_SECRET to trigger publish manually:")
    if (!cronSecret) return
    try {
      const res = await fetch("/api/cron/publish-blog", {
        headers: { Authorization: `Bearer ${cronSecret}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast("Published!", { description: `"${data.title}" has been published.` })
      fetchTopics()
    } catch (e: any) {
      toast("Error", { description: e.message ?? "Failed to trigger publish." })
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Add Topic Form ── */}
      <Card>
        <CardHeader>
          <CardTitle>Add Blog Topic to Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="title">Topic Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. How to plan a Vastu-compliant home in Maharajganj"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Additional Context{" "}
                <span className="text-muted-foreground text-xs">(hints for AI — optional)</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="e.g. Focus on north-facing home tips, mention Maharajganj audience"
                rows={3}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Thumbnail Image <span className="text-muted-foreground text-xs">(used as blog cover)</span></Label>
              <div className="border border-dashed rounded-md p-4 text-center">
                {thumbnail ? (
                  <div className="mb-3">
                    <Image
                      src={thumbnail}
                      alt="Thumbnail preview"
                      width={400}
                      height={200}
                      className="mx-auto rounded-md object-cover h-40 w-full"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload a cover image for this topic</p>
                  </div>
                )}
                <CldUploadButton
                  uploadPreset="shivadesign"
                  onSuccess={(result: any) => {
                    const url = result?.info?.secure_url
                    if (url) setThumbnail(url)
                  }}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-9 px-4 py-2 cursor-pointer mt-2"
                >
                  {thumbnail ? "Change Image" : "Upload Image"}
                </CldUploadButton>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Adding..." : "Add to Queue"}
              </Button>
              <Button type="button" variant="outline" onClick={triggerPublish}>
                ▶ Publish Now (manual)
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* ── Topic Queue ── */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Topic Queue{" "}
          <span className="text-muted-foreground font-normal text-sm">
            ({topics.filter((t) => !t.isUsed).length} pending)
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : topics.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No topics in the queue yet. Add one above!
          </p>
        ) : (
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <Card key={topic._id} className={topic.isUsed ? "opacity-60" : ""}>
                <CardContent className="p-4 flex gap-4 items-start">

                  {topic.thumbnail && (
                    <div className="relative w-20 h-16 shrink-0 rounded overflow-hidden">
                      <Image src={topic.thumbnail} alt={topic.title} fill className="object-cover" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">#{index + 1} {topic.title}</h3>
                      {topic.isUsed ? (
                        <Badge variant="default" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </div>

                    {editingId === topic._id ? (
                      <div className="space-y-2 mt-2">
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Topic title" />
                        <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} placeholder="Additional context" />
                        <div className="border border-dashed rounded-md p-3 text-center">
                          {editThumbnail && (
                            <div className="mb-2">
                              <Image
                                src={editThumbnail}
                                alt="Topic thumbnail"
                                width={300}
                                height={140}
                                className="mx-auto rounded-md object-cover h-28 w-full"
                              />
                            </div>
                          )}
                          <CldUploadButton
                            uploadPreset="shivadesign"
                            onSuccess={(result: any) => {
                              const url = result?.info?.secure_url
                              if (url) setEditThumbnail(url)
                            }}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-8 px-3 py-1.5 cursor-pointer"
                          >
                            {editThumbnail ? "Change thumbnail" : "Upload thumbnail"}
                          </CldUploadButton>
                        </div>
                      </div>
                    ) : (
                      topic.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                      )
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      Added {new Date(topic.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                      {topic.usedAt && ` · Published ${new Date(topic.usedAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {editingId === topic._id ? (
                      <>
                        <Button size="sm" variant="default" onClick={() => saveTopic(topic._id)}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEditing(topic)}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        {!topic.isUsed && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => moveTopic(topic._id, "move-up")}>
                              <ChevronUp className="h-4 w-4 mr-1" /> Up
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => moveTopic(topic._id, "move-down")}>
                              <ChevronDown className="h-4 w-4 mr-1" /> Down
                            </Button>
                          </>
                        )}
                        {topic.isUsed && (
                          <Button size="sm" variant="outline" onClick={() => resetTopic(topic._id)}>
                            <RotateCcw className="h-4 w-4 mr-1" /> Reset
                          </Button>
                        )}
                        {!topic.isUsed && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTopic(topic._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
