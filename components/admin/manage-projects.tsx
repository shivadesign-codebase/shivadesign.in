"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import EditProjectDialog from "./edit-project-dialog"
import { IProject } from "@/types/project"
import { Skeleton } from "../ui/skeleton"

export function ProjectsLoading() {
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

export default function ManageProjects() {
  const [projects, setProjects] = useState<IProject[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const fetchProjects = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const res = await fetch(`/api/projects?page=${page}&limit=5`)
      const data = await res.json()
      if (data.projects.length < 5) setHasMore(false)
      setProjects((prev) => [...prev, ...data.projects])
      setPage((prev) => prev + 1)
    } catch (error) {
      toast("Error", { description: "Failed to load projects." })
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchProjects()
    }
  }, [loading, hasMore])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEditProject = (project: IProject) => {
    setSelectedProject(project)
    setIsEditDialogOpen(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/admin/project`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: projectId }),
        })

        if (!response.ok) throw new Error("Failed to delete project")

        toast("Project deleted", {
          description: "The project has been deleted successfully.",
        })
        setProjects((prev) => prev.filter((p) => p._id !== projectId))
      } catch (error) {
        toast("Error", { description: "Problem deleting the project." })
      }
    }
  }

  const handleStatusChange = async (projectId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/project?id=${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) throw new Error("Failed to update project status")

      toast("Status updated", {
        description: `Project is now ${isActive ? "active" : "inactive"}.`,
      })
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, isActive } : p))
      )
    } catch (error) {
      toast("Error", { description: "Problem updating status." })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Existing Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="h-[80vh] overflow-y-auto space-y-4"
          >
            {projects.length === 0 && !loading ? (
              <p className="text-center text-muted-foreground py-8">
                No projects found
              </p>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id.toString()}
                  className="border rounded-md p-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 rounded-md overflow-hidden">
                      {project.image ? (
                        <Image
                          src={project.image}
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
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                              {project.category}
                            </span>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                              {project.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`active-${project._id}`}
                            checked={project.isActive}
                            onCheckedChange={(checked) =>
                              handleStatusChange(
                                project._id.toString(),
                                checked
                              )
                            }
                          />
                          <Label
                            htmlFor={`active-${project._id}`}
                            className="text-sm"
                          >
                            {project.isActive ? "Active" : "Inactive"}
                          </Label>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground my-2">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
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
              ))
            )}
            {loading && <ProjectsLoading />}
            {!hasMore && !loading && projects.length > 0 && (
              <p className="text-center text-muted-foreground py-4">
                No more projects
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedProject && (
        <EditProjectDialog
          project={selectedProject}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedProject(null)
          }}
        />
      )}
    </>
  )
}
