"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon } from "lucide-react"
import { toast } from "sonner"

type BlogFormValues = {
  title: string
  description: string
  content: string
  image: string
  tags: string
  isPublished: boolean
}

export default function PublishBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      image: "",
      tags: "",
      isPublished: false,
    },
  })

  const contentValue = watch("content")
  const isPublishedValue = watch("isPublished")

  const handleImageUpload = (result: any) => {
    const url = result?.info?.secure_url
    if (url) {
      setValue("image", url)
      setImagePreview(url)
    } else {
      toast("Error", { description: "Failed to upload image. Please try again." })
    }
  }

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true)

      const tags = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tags }),
      })

      if (!response.ok) throw new Error("Failed to publish blog")

      toast("Success", { description: "Blog article published successfully." })
      reset()
      setImagePreview(null)
    } catch {
      toast("Error", { description: "There was a problem saving the blog. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write New Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter article title"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="A brief summary shown on the listing page"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g. Interior Design, Vastu, Architecture"
            />
          </div>

          {/* Cover Image */}
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
                    className="mx-auto rounded-md object-cover h-[220px] w-full"
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

          {/* Markdown Content with Preview */}
          <div className="space-y-2">
            <Label>Content <span className="text-muted-foreground text-xs">(Markdown supported)</span></Label>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  {...register("content", { required: "Content is required" })}
                  placeholder={`# Heading\n\nWrite your article here using **Markdown**...\n\n- List item\n- Another item`}
                  rows={20}
                  className="font-mono text-sm"
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[300px] border rounded-md p-4 markdown-content">
                  {contentValue ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentValue}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="isPublished"
              checked={isPublishedValue}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <Label htmlFor="isPublished">
              {isPublishedValue ? "Publish immediately" : "Save as draft"}
            </Label>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : isPublishedValue ? "Publish Article" : "Save Draft"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
