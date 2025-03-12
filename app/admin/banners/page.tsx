"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveBanner } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, Trash2 } from "lucide-react"

export default function BannersPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await saveBanner(formData)
      toast({
        title: "Banner saved",
        description: "The banner has been saved successfully.",
      })
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        isActive: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the banner. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const existingBanners = [
    {
      id: 1,
      title: "Civil Engineering Excellence",
      subtitle: "Professional solutions for your construction needs",
      image: "/placeholder.svg?height=200&width=400",
      isActive: true,
    },
    {
      id: 2,
      title: "Innovative Structural Design",
      subtitle: "Building the future with precision and expertise",
      image: "/placeholder.svg?height=200&width=400",
      isActive: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <p className="text-muted-foreground">Add and manage website banners</p>
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
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter banner title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Banner Subtitle</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Enter banner subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Banner Image</Label>
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Upload an image or drag and drop</p>
                    <p className="text-xs text-muted-foreground mb-4">PNG, JPG, GIF up to 10MB</p>
                    <Button type="button" variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="active">Active</Label>
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
              <div className="space-y-4">
                {existingBanners.map((banner) => (
                  <div key={banner.id} className="border rounded-md p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3 bg-muted rounded-md overflow-hidden">
                        <div className="aspect-[2/1] relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">Banner Image</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{banner.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{banner.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch id={`active-${banner.id}`} checked={banner.isActive} />
                            <Label htmlFor={`active-${banner.id}`}>{banner.isActive ? "Active" : "Inactive"}</Label>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
