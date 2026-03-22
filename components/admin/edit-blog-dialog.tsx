"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageIcon } from "lucide-react"
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

type BlogFormValues = {
  title: string
  description: string
  content: string
  image: string
  tags: string
  isPublished: boolean
}

interface EditBlogDialogProps {
  blog: Blog
  isOpen: boolean
  onClose: () => void
  onUpdated: (blog: Blog) => void
}

export default function EditBlogDialog({ blog, isOpen, onClose, onUpdated }: EditBlogDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(blog.image ?? null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: blog.title,
      description: blog.description,
      content: blog.content ?? "",
      image: blog.image ?? "",
      tags: blog.tags.join(", "),
      isPublished: blog.isPublished,
    },
  })

  useEffect(() => {
    reset({
      title: blog.title,
      description: blog.description,
      content: blog.content ?? "",
      image: blog.image ?? "",
      tags: blog.tags.join(", "),
      isPublished: blog.isPublished,
    })
    setImagePreview(blog.image ?? null)
  }, [blog, reset])

  const isPublishedValue = watch("isPublished")

  const handleImageUpload = (result: any) => {
    const uploadedImageUrl = result?.info?.secure_url
    if (uploadedImageUrl) {
      setValue("image", uploadedImageUrl)
      setImagePreview(uploadedImageUrl)
      return
    }

    toast("Error", {
      description: "Failed to upload image. Please try again.",
    })
  }

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true)

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      const response = await fetch(`/api/admin/blog?id=${blog._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.content,
          image: data.image || null,
          tags,
          isPublished: data.isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog")
      }

      const result = (await response.json()) as { blog?: Blog }
      if (!result.blog) {
        throw new Error("Invalid response")
      }

      onUpdated(result.blog)

      toast("Blog updated", {
        description: "The blog has been updated successfully.",
      })

      onClose()
    } catch {
      toast("Error", {
        description: "There was a problem updating the blog. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter article title"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Short Description</Label>
            <Textarea
              id="edit-description"
              {...register("description", { required: "Description is required" })}
              placeholder="A brief summary shown on the listing page"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              {...register("tags")}
              placeholder="e.g. Interior Design, Vastu, Architecture"
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="border border-dashed rounded-md p-6 text-center">
              {!imagePreview ? (
                <>
                  <div className="flex justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Upload a cover image</p>
                  <p className="text-xs text-muted-foreground mb-4">PNG, JPG, GIF up to 10MB</p>
                </>
              ) : (
                <div className="mb-4">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    width={600}
                    height={300}
                    className="mx-auto rounded-md object-cover h-55 w-full"
                  />
                </div>
              )}

              <CldUploadButton
                uploadPreset="shivadesign"
                onSuccess={handleImageUpload}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer"
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </CldUploadButton>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              {...register("content", { required: "Content is required" })}
              placeholder="Write your article content in markdown"
              rows={14}
              className="font-mono text-sm"
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="edit-published"
              checked={isPublishedValue}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <Label htmlFor="edit-published">
              {isPublishedValue ? "Published" : "Draft"}
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}