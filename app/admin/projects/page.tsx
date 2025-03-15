"use client"

import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import AddProjectForm from "@/components/admin/add-project-form"
import ManageProjects from "@/components/admin/manage-projects"

// Mock data for demonstration
const mockProjects = [
  {
    _id: "1",
    title: "Commercial Complex",
    category: "Interior Design" as const,
    type: "Commercial",
    description: "Modern commercial building with innovative structural solutions.",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    _id: "2",
    title: "Residential Tower",
    category: "3D Elevation" as const,
    type: "Residential",
    description: "High-rise residential building with earthquake-resistant design.",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    _id: "3",
    title: "Highway Bridge",
    category: "AutoCAD 2D Design" as const,
    type: "Infrastructure",
    description: "Modern suspension bridge with innovative engineering solutions.",
    image: "/placeholder.svg?height=200&width=300",
    isActive: false,
    createdAt: new Date("2023-06-22"),
    updatedAt: new Date("2023-06-22"),
  },
]

function ProjectsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
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
          <Suspense fallback={<ProjectsLoading />}>
            <AddProjectForm />
          </Suspense>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Suspense fallback={<ProjectsLoading />}>
            <ManageProjects projects={mockProjects} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
