"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ImageIcon, Trash2 } from "lucide-react"

type Banner = {
  _id: string
  title?: string
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export default function BannersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    isActive: true,
  })

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/banner", { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch banners")
      }

      const normalized: Banner[] = (data.banners || []).map((banner: any) => ({
        _id: String(banner._id),
        title: banner.title || "",
        imageUrl: banner.imageUrl || banner.link || "",
        isActive: Boolean(banner.isActive),
        createdAt: banner.createdAt,
      }))

      setBanners(normalized)
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to load banners." })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const activeBannerCount = useMemo(() => banners.filter((item) => item.isActive).length, [banners])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageUrl) {
      toast("Error", { description: "Please upload a banner image first." })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create banner")
      }

      toast("Banner added", { description: "Banner saved successfully." })
      setFormData({ title: "", imageUrl: "", isActive: true })
      await fetchBanners()
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to save banner." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const setBannerActive = async (banner: Banner, makeActive: boolean) => {
    try {
      const response = await fetch("/api/admin/banner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner._id, isActive: makeActive }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update banner")
      }

      toast("Updated", {
        description: makeActive ? "Banner is now active on hero." : "Banner marked inactive.",
      })
      await fetchBanners()
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to update banner." })
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return

    try {
      const response = await fetch("/api/admin/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete banner")
      }

      toast("Deleted", { description: "Banner removed successfully." })
      await fetchBanners()
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to delete banner." })
    }
  }

  const handleImageUpload = (result: any) => {
    const url = result?.info?.secure_url

    if (!url) {
      toast("Error", { description: "Image upload failed. Please try again." })
      return
    }

    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <p className="text-muted-foreground">
          Add hero background banners and choose one active banner for homepage.
        </p>
      </div>

      <Tabs defaultValue="add">
        <TabsList>
          <TabsTrigger value="add">Add New Banner</TabsTrigger>
          <TabsTrigger value="manage">Manage Existing Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title (optional)</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Premium Home Design"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="border border-dashed rounded-md p-8 text-center space-y-4">
                    {formData.imageUrl ? (
                      <div className="relative mx-auto h-52 w-full max-w-3xl overflow-hidden rounded-md">
                        <Image src={formData.imageUrl} alt="Banner preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Upload hero banner image</p>
                        <p className="text-xs text-muted-foreground">Recommended size: 1920x1080</p>
                      </>
                    )}

                    <CldUploadButton
                      uploadPreset="shivadesign"
                      onSuccess={handleImageUpload}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer"
                    >
                      {formData.imageUrl ? "Change Image" : "Upload Image"}
                    </CldUploadButton>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="active">Set as active hero banner</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Banner"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Existing Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-muted-foreground">
                Active banners: {activeBannerCount} (Recommended: 1)
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading banners...</p>
              ) : banners.length === 0 ? (
                <p className="text-sm text-muted-foreground">No banners found.</p>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div key={banner._id} className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-full md:w-1/3 h-40 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={banner.imageUrl}
                            alt={banner.title || "Banner"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{banner.title || "Untitled banner"}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Added {new Date(banner.createdAt).toLocaleDateString("en-IN")}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`active-${banner._id}`}
                                checked={banner.isActive}
                                onCheckedChange={(checked) => setBannerActive(banner, checked)}
                              />
                              <Label htmlFor={`active-${banner._id}`}>
                                {banner.isActive ? "Active on Hero" : "Inactive"}
                              </Label>
                            </div>

                            <Button variant="destructive" size="sm" onClick={() => deleteBanner(banner._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
