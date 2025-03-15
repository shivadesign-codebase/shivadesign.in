"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import EditProjectDialog from "./edit-project-dialog"
import { IProject } from "@/types/project"

interface ManageProjectsProps {
  projects: IProject[]
}

export default function ManageProjects({ projects }: ManageProjectsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)

  const handleEditProject = (project: IProject) => {
    setSelectedProject(project)
    setIsEditDialogOpen(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        // Implement delete functionality
        toast("Project deleted", {
          description: "The project has been deleted successfully.",
        })
      } catch (error) {
        toast("Error", {
          description: "There was a problem deleting the project. Please try again.",
        })
      }
    }
  }

  const handleStatusChange = async (projectId: string, isActive: boolean) => {
    try {
      // Implement status change functionality
      toast("Status updated", {
        description: `Project is now ${isActive ? "active" : "inactive"}.`,
      })
    } catch (error) {
      toast("Error", {
        description: "There was a problem updating the project status. Please try again.",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Existing Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No projects found</p>
            ) : (
              projects.map((project) => (
                <div key={project._id.toString()} className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 rounded-md overflow-hidden">
                      {project.image ? (
                        <Image
                          src={project.image || "/assets/cad.jpg"}
                          alt={project.title}
                          width={300}
                          height={300}
                          className="aspect-square object-cover"
                        />
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">No Image</div>
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
                            onCheckedChange={(checked) => handleStatusChange(project._id.toString(), checked)}
                          />
                          <Label htmlFor={`active-${project._id}`} className="text-sm">
                            {project.isActive ? "Active" : "Inactive"}
                          </Label>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground my-2">{project.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProject(project._id.toString())}
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
