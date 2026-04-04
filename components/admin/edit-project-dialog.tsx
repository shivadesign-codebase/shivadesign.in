"use client"

import { useEffect, useState } from "react"
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
import ClientSelector from "@/components/admin/client-selector"
import type { IProject, ProjectFormValues } from "@/types/project"
import type { Client } from "@/types/client"
import { toast } from "sonner"
import { services } from "@/app/(pages)/(user)/services/data/data"

const SERVICE_SAMPLE_OPTIONS = services.map((service) => ({
  slug: service.slug,
  title: service.title,
}))

const normalizeSampleServiceSlugs = (values?: string[]) => {
  if (!values?.length) return []

  return [...new Set(
    values
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().toLowerCase().replace(/[\s_]+/g, "-"))
      .filter(Boolean)
  )]
}

interface EditProjectDialogProps {
  project: IProject
  isOpen: boolean
  onClose: () => void
  onSaved?: () => Promise<void> | void
}

export default function EditProjectDialog({ project, isOpen, onClose, onSaved }: EditProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(project.image || null)
  const [selectedClient, setSelectedClient] = useState<Client | null>({
    _id: project.clientId,
    name: project.clientName,
    mobile: project.clientMobile ?? null,
    email: project.clientEmail ?? null,
    createdAt: new Date(project.createdAt).toISOString(),
    updatedAt: new Date(project.updatedAt).toISOString(),
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: project.title,
      category: project.category,
      type: project.type,
      description: project.description,
      image: project.image,
      sampleServiceSlugs: normalizeSampleServiceSlugs(project.sampleServiceSlugs),
      clientId: project.clientId,
      clientName: project.clientName,
      clientMobile: project.clientMobile ?? "",
      clientEmail: project.clientEmail ?? "",
      isActive: project.isActive,
    },
  })

  useEffect(() => {
    reset({
      title: project.title,
      category: project.category,
      type: project.type,
      description: project.description,
      image: project.image,
      sampleServiceSlugs: normalizeSampleServiceSlugs(project.sampleServiceSlugs),
      clientId: project.clientId,
      clientName: project.clientName,
      clientMobile: project.clientMobile ?? "",
      clientEmail: project.clientEmail ?? "",
      isActive: project.isActive,
    })
    setImagePreview(project.image || null)
    setSelectedClient({
      _id: project.clientId,
      name: project.clientName,
      mobile: project.clientMobile ?? null,
      email: project.clientEmail ?? null,
      createdAt: new Date(project.createdAt).toISOString(),
      updatedAt: new Date(project.updatedAt).toISOString(),
    })
  }, [project, reset])

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
    if (!selectedClient) {
      toast("Missing client", { description: "Please select a client for this project." })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/project?id=${project._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          clientId: selectedClient._id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      toast("Project updated", {
        description: "The project has been updated successfully.",
      })
      await onSaved?.()
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
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <ClientSelector
            value={selectedClient?._id || ""}
            selectedClient={selectedClient}
            onChange={(client) => {
              setSelectedClient(client)
              setValue("clientId", client._id)
              setValue("clientName", client.name)
              setValue("clientMobile", client.mobile ?? "")
              setValue("clientEmail", client.email ?? "")
            }}
            description="Change the client linked to this project if needed."
          />

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
            <Label>Show As Sample On Service Pages</Label>
            <p className="text-xs text-muted-foreground">
              Select one or more services where this project should appear in the samples section.
            </p>
            <Controller
              name="sampleServiceSlugs"
              control={control}
              render={({ field }) => {
                const selected = normalizeSampleServiceSlugs(field.value)

                return (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SERVICE_SAMPLE_OPTIONS.map((option) => (
                      <label
                        key={option.slug}
                        className="flex cursor-pointer items-center gap-2 rounded-md border p-2"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selected.includes(option.slug)}
                          onChange={() => {
                            const nextValues = selected.includes(option.slug)
                              ? selected.filter((item) => item !== option.slug)
                              : [...selected, option.slug]

                            field.onChange(normalizeSampleServiceSlugs(nextValues))
                          }}
                        />
                        <span className="text-sm">{option.title}</span>
                      </label>
                    ))}
                  </div>
                )
              }}
            />
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
                    className="mx-auto rounded-md object-cover h-50"
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
