"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageIcon } from "lucide-react"
import type { IProject, ProjectFormValues } from "@/types/project"
import { toast } from "sonner"

interface EditProjectDialogProps {
  project: IProject
  isOpen: boolean
  onClose: () => void
}

export default function EditProjectDialog({ project, isOpen, onClose }: EditProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(project.image || null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: project.title,
      category: project.category,
      type: project.type,
      description: project.description,
      image: project.image,
      isActive: project.isActive,
    },
  })

  const handleImageUpload = (result: any) => {
    const uploadedImageUrl = result?.info?.secure_url
    if (uploadedImageUrl) {
      setValue("image", uploadedImageUrl)
      setImagePreview(uploadedImageUrl)
    } else {
      console.error("Image URL is invalid")
      toast("Error", {
        description: "Failed to upload image. Please try again.",
      })
    }
  }

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/project?id=${project._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      toast("Project updated", {
        description: "The project has been updated successfully.",
      })
      onClose()
    } catch (error) {
      toast("Error", {
        description: "There was a problem updating the project. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Project Title</Label>
            <Input
              id="edit-title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter project title"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Project Category</Label>
            <Input
              id="edit-category"
              {...register("category", { required: "Category is required" })}
              placeholder="e.g. Interior Design, 3D Elevation, etc."
            />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Project Type</Label>
            <Input
              id="edit-type"
              {...register("type", { required: "Type is required" })}
              placeholder="e.g. Residential, Commercial, etc."
            />
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Project Description</Label>
            <Textarea
              id="edit-description"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter project description"
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="border border-dashed rounded-md p-6 text-center">
              {!imagePreview ? (
                <>
                  <div className="flex justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Upload an image or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">PNG, JPG, GIF up to 10MB</p>
                </>
              ) : (
                <div className="mb-4">
                  <Image
                    src={imagePreview || "/assets/cad.jpg"}
                    alt="Project preview"
                    width={300}
                    height={200}
                    className="mx-auto rounded-md object-cover h-[200px]"
                  />
                </div>
              )}

              <CldUploadButton
                onSuccess={handleImageUpload}
                uploadPreset="shivadesign"
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                }}
              >
                <div>
                  {imagePreview ? "Change Image" : "Upload Image"}
                </div>
              </CldUploadButton>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch id="edit-isActive" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="edit-isActive">Active</Label>
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
