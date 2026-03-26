"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import EditProjectDialog from "./edit-project-dialog"
import { IProject } from "@/types/project"
import { Skeleton } from "../ui/skeleton"
import { Input } from "../ui/input"

const LIMIT = 6

const optimizeImage = (url: string) => {
  if (!url.includes("cloudinary")) return url
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_400/")
}

export default function ManageProjects() {

  const [projects, setProjects] = useState<IProject[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setProjects([])
      setPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const fetchProjects = async (currentPage: number) => {

    setLoading(true)

    try {

      const res = await fetch(
        `/api/admin/project?page=${currentPage}&limit=${LIMIT}&search=${debouncedSearch}`,
        { cache: "no-store" }
      )

      const data = await res.json()

      if (currentPage === 1) {
        setProjects(data.projects)
      } else {
        setProjects(prev => [...prev, ...data.projects])
      }

      setTotalPages(data.totalPages)

    } catch {
      toast("Error", { description: "Failed to load projects." })
    } finally {
      setLoading(false)
    }
  }

  // initial + search reload
  useEffect(() => {
    fetchProjects(1)
  }, [debouncedSearch])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProjects(nextPage)
  }

  const handleEditProject = (project: IProject) => {
    setSelectedProject(project)
    setIsEditDialogOpen(true)
  }

  const handleDeleteProject = async (projectId: string) => {

    if (!confirm("Are you sure you want to delete this project?")) return

    try {

      const response = await fetch(`/api/admin/project`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      })

      if (!response.ok) throw new Error()

      toast("Project deleted", {
        description: "The project has been deleted successfully.",
      })

      setProjects(prev => prev.filter(p => p._id !== projectId))

    } catch {
      toast("Error", { description: "Problem deleting the project." })
    }
  }

  const handleStatusChange = async (projectId: string, isActive: boolean) => {

    try {

      const response = await fetch(`/api/admin/project?id=${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) throw new Error()

      toast("Status updated", {
        description: `Project is now ${isActive ? "active" : "inactive"}.`,
      })

      setProjects(prev =>
        prev.map(p => (p._id === projectId ? { ...p, isActive } : p))
      )

    } catch {
      toast("Error", { description: "Problem updating status." })
    }
  }

  const noMoreProjects = page >= totalPages

  return (
    <>
      <Card>

        <CardHeader>
          <CardTitle>Existing Projects</CardTitle>
        </CardHeader>

        <CardContent>

          {/* SEARCH */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search by project, client, email, mobile..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">

            {projects.length === 0 && !loading && (
              <p className="text-center text-muted-foreground py-8">
                No projects found
              </p>
            )}

            {projects.map(project => (

              <div key={project._id.toString()} className="border rounded-md p-4">

                <div className="flex flex-col md:flex-row gap-4">

                  {/* IMAGE */}
                  <div className="w-full md:w-1/4 rounded-md overflow-hidden">
                    {project.image ? (
                      <Image
                        src={optimizeImage(project.image)}
                        alt={project.title}
                        width={300}
                        height={300}
                        className="aspect-square object-cover"
                      />
                    ) : (
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">

                    <div className="flex justify-between items-start">

                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          For {project.clientName}
                          {project.clientMobile ? ` • ${project.clientMobile}` : ""}
                          {project.clientEmail ? ` • ${project.clientEmail}` : ""}
                        </p>

                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {project.category}
                          </span>

                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                            {project.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">

                        <Switch
                          checked={project.isActive}
                          onCheckedChange={(checked) =>
                            handleStatusChange(project._id.toString(), checked)
                          }
                        />

                        <Label className="text-sm">
                          {project.isActive ? "Active" : "Inactive"}
                        </Label>

                      </div>

                    </div>

                    <p className="text-sm text-muted-foreground my-2">
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center mt-2">

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteProject(project._id.toString())
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>

                      </div>

                    </div>

                  </div>
                </div>
              </div>

            ))}

            {loading && (
              <>
                <Skeleton className="h-50" />
                <Skeleton className="h-50" />
              </>
            )}

          </div>

          {/* LOAD MORE */}
          {!noMoreProjects && !loading && (
            <div className="flex justify-center mt-6">
              <Button onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}

          {noMoreProjects && (
            <p className="text-center text-muted-foreground mt-6">
              No more projects
            </p>
          )}

        </CardContent>
      </Card>

      {selectedProject && (
        <EditProjectDialog
          project={selectedProject}
          isOpen={isEditDialogOpen}
          onSaved={() => fetchProjects(1)}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedProject(null)
          }}
        />
      )}
    </>
  )
}
