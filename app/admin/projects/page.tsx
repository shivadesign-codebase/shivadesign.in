"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveProject } from "@/lib/actions"
import { toast } from "sonner"

import { ImageIcon, Trash2, Edit } from "lucide-react"

export default function ProjectsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await saveProject(formData)
      toast("Project saved", {
        description: "The project has been saved successfully.",
      })
      setFormData({
        title: "",
        category: "",
        description: "",
        image: "",
        isActive: true,
      })
    } catch (error) {
      toast("Error", {
        description: "There was a problem saving the project. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const existingProjects = [
    {
      id: 1,
      title: "Commercial Complex",
      category: "Commercial",
      description: "Modern commercial building with innovative structural solutions.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      id: 2,
      title: "Residential Tower",
      category: "Residential",
      description: "High-rise residential building with earthquake-resistant design.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      id: 3,
      title: "Highway Bridge",
      category: "Infrastructure",
      description: "Modern suspension bridge with innovative engineering solutions.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Management</h1>
        <p className="text-muted-foreground">Add and manage portfolio projects</p>
      </div>

      <Tabs defaultValue="add">
        <TabsList>
          <TabsTrigger value="add">Add New Project</TabsTrigger>
          <TabsTrigger value="manage">Manage Existing Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Project Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
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
                  {isSubmitting ? "Saving..." : "Save Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Existing Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingProjects.map((project) => (
                  <div key={project.id} className="border rounded-md p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/4 bg-muted rounded-md overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            Project Image
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary mt-1">
                              {project.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id={`active-${project.id}`} checked={project.isActive} />
                            <Label htmlFor={`active-${project.id}`} className="text-sm">
                              {project.isActive ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground my-2">{project.description}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
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

