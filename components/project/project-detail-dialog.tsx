import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Tag, X } from "lucide-react"
import type { IProject } from "@/types/project"

interface ProjectDetailDialogProps {
  project: IProject | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectDetailDialog({ project, isOpen, onClose }: ProjectDetailDialogProps) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="relative bg-black flex items-center justify-center min-h-[300px]">
            <div
              className={"absolute inset-0 bg-contain bg-no-repeat bg-center transition-opacity duration-300 opacity-100"}
              style={{ backgroundImage: `url(${project.image || "/placeholder.svg?height=600&width=800"})` }}
            ></div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-2 py-1">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  {project.category}
                </Badge>
                <Badge variant="outline" className="px-2 py-1">
                  <User className="h-3.5 w-3.5 mr-1" />
                  {project.type}
                </Badge>
                {project.createdAt && (
                  <Badge variant="outline" className="px-2 py-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{project.isActive ? "Active" : "Completed"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Professional design and implementation</li>
                  <li>Adherence to industry standards</li>
                  <li>Quality materials and craftsmanship</li>
                  <li>Timely completion within budget</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
