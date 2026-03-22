"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
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
  contentImages?: TopicContentImage[]
  queueOrder: number
  isUsed: boolean
  usedAt?: string
  createdAt: string
}

type TopicContentImage = {
  url: string
  alt: string
  caption?: string
  order: number
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
  const [contentImages, setContentImages] = useState<TopicContentImage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editThumbnail, setEditThumbnail] = useState<string | null>(null)
  const [editContentImages, setEditContentImages] = useState<TopicContentImage[]>([])

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

  const normalizeImages = (images: TopicContentImage[]) => {
    const clean = images
      .map((img, idx) => ({
        url: img.url?.trim() ?? "",
        alt: img.alt?.trim() ?? "",
        caption: img.caption?.trim() ?? "",
        order: idx + 1,
      }))
      .filter((img) => img.url)

    return clean.slice(0, 5)
  }

  const validateImages = (images: TopicContentImage[]) => {
    for (const image of images) {
      if (!image.alt) {
        return "Alt text is required for every provided content image link."
      }
    }
    return null
  }

  const addImageSlot = (setter: Dispatch<SetStateAction<TopicContentImage[]>>) => {
    setter((prev) => {
      if (prev.length >= 5) return prev
      return [...prev, { url: "", alt: "", caption: "", order: prev.length + 1 }]
    })
  }

  const removeImageSlot = (
    index: number,
    setter: Dispatch<SetStateAction<TopicContentImage[]>>
  ) => {
    setter((prev) => prev.filter((_, idx) => idx !== index).map((img, idx) => ({ ...img, order: idx + 1 })))
  }

  const updateImageField = (
    index: number,
    field: "url" | "alt" | "caption",
    value: string,
    setter: Dispatch<SetStateAction<TopicContentImage[]>>
  ) => {
    setter((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, [field]: value, order: idx + 1 } : img))
    )
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true)

      const normalizedImages = normalizeImages(contentImages)
      const imageValidationError = validateImages(normalizedImages)
      if (imageValidationError) {
        toast("Validation", { description: imageValidationError })
        setSubmitting(false)
        return
      }

      const res = await fetch("/api/admin/blog-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, thumbnail, contentImages: normalizedImages }),
      })
      if (!res.ok) throw new Error()
      const { topic } = await res.json()
      setTopics((prev) => [topic, ...prev])
      reset()
      setThumbnail(null)
      setContentImages([])
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
    setEditContentImages((topic.contentImages ?? []).map((img, idx) => ({
      url: img.url ?? "",
      alt: img.alt ?? "",
      caption: img.caption ?? "",
      order: idx + 1,
    })))
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditThumbnail(null)
    setEditContentImages([])
  }

  const saveTopic = async (id: string) => {
    try {
      const normalizedImages = normalizeImages(editContentImages)
      const imageValidationError = validateImages(normalizedImages)
      if (imageValidationError) {
        toast("Validation", { description: imageValidationError })
        return
      }

      const res = await fetch("/api/admin/blog-topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle,
          description: editDescription,
          thumbnail: editThumbnail,
          contentImages: normalizedImages,
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

            <div className="space-y-3">
              <div>
                <Label>Blog Content Images</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: add up to 5 Cloudinary image links. Use placeholders like {"{{img1}}"} in content positions.
                </p>
              </div>

              {contentImages.map((img, idx) => (
                <div key={`new-image-${idx}`} className="grid gap-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Image #{idx + 1}</p>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeImageSlot(idx, setContentImages)}>
                      Remove
                    </Button>
                  </div>
                  <Input
                    value={img.url}
                    onChange={(e) => updateImageField(idx, "url", e.target.value, setContentImages)}
                    placeholder="https://res.cloudinary.com/..."
                  />
                  <Input
                    value={img.alt}
                    onChange={(e) => updateImageField(idx, "alt", e.target.value, setContentImages)}
                    placeholder="Alt text for SEO"
                  />
                  <Input
                    value={img.caption ?? ""}
                    onChange={(e) => updateImageField(idx, "caption", e.target.value, setContentImages)}
                    placeholder="Caption (optional)"
                  />
                </div>
              ))}

              {contentImages.length < 5 && (
                <Button type="button" variant="outline" onClick={() => addImageSlot(setContentImages)}>
                  + Add content image link
                </Button>
              )}
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

                        <div className="space-y-2 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Content images for placeholders</p>
                            {editContentImages.length < 5 && (
                              <Button type="button" size="sm" variant="outline" onClick={() => addImageSlot(setEditContentImages)}>
                                + Add
                              </Button>
                            )}
                          </div>
                          {editContentImages.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No image links added.</p>
                          ) : (
                            editContentImages.map((img, idx) => (
                              <div key={`edit-image-${idx}`} className="grid gap-2 border rounded-md p-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Image #{idx + 1}</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeImageSlot(idx, setEditContentImages)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                                <Input
                                  value={img.url}
                                  onChange={(e) => updateImageField(idx, "url", e.target.value, setEditContentImages)}
                                  placeholder="https://res.cloudinary.com/..."
                                />
                                <Input
                                  value={img.alt}
                                  onChange={(e) => updateImageField(idx, "alt", e.target.value, setEditContentImages)}
                                  placeholder="Alt text for SEO"
                                />
                                <Input
                                  value={img.caption ?? ""}
                                  onChange={(e) => updateImageField(idx, "caption", e.target.value, setEditContentImages)}
                                  placeholder="Caption (optional)"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {topic.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                        )}
                        {(topic.contentImages?.length ?? 0) > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {(topic.contentImages ?? []).length} content image link(s) ready for placeholders.
                          </p>
                        )}
                      </>
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
