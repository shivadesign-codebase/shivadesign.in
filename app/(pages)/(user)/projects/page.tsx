"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ScrollToTop from "@/components/scroll-to-top"
import ProjectCard from "@/components/project/project-card"
import ScrollAnimations from "@/components/scroll-animations"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectSkeleton from "@/components/project/project-skeleton"
import type { IProject } from "@/types/project"

const ProjectDetailDialog = dynamic(() => import("@/components/project/project-detail-dialog"))

export default function ProjectsPage() {

  const ITEMS_PER_PAGE = 6

  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // fetch projects
  const fetchProjects = async (
    pageNumber = 1,
    reset = false,
    search = searchQuery,
    category = activeCategory
  ) => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })

      if (search) params.append("search", search)
      if (category !== "All") params.append("category", category)

      const res = await fetch(`/api/projects?${params}`)
      const data = await res.json()

      if (reset) {
        setProjects(data.projects)
      } else {
        setProjects((prev) => [...prev, ...data.projects])
      }

      setTotalPages(data.totalPages)
      setPage(pageNumber)

    } catch (error) {
      console.error(error)
      toast("Error", { description: "Failed to load projects." })
    } finally {
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    fetchProjects(1, true)
  }, [])

  // search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects(1, true, searchQuery, activeCategory)
  }

  // category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    fetchProjects(1, true, searchQuery, category)
  }

  // load more
  const loadMore = () => {
    if (page < totalPages) {
      fetchProjects(page + 1)
    }
  }

  const openProjectDetail = (project: IProject) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">

      {/* Heading */}
      <ScrollAnimations className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
          Our Projects
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          A curated showcase of architectural excellence and engineering precision.
        </p>
      </ScrollAnimations>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        <Button type="submit">Search</Button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading && projects.length === 0 ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <ScrollAnimations key={i}>
                <ProjectSkeleton />
              </ScrollAnimations>
            ))
        ) : (
          projects.map((project) => (
            <ScrollAnimations key={project._id}>
              <ProjectCard
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image || "/placeholder.svg"}
                link="#"
                onClick={() => openProjectDetail(project)}
              />
            </ScrollAnimations>
          ))
        )}

      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} className="px-8 py-6 rounded-full">
            Load More Projects
          </Button>
        </div>
      )}

      <div className="text-center py-8 text-muted-foreground">
        <p>You've reached the end of our project showcase.</p>
      </div>

      <ProjectDetailDialog
        project={selectedProject}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <ScrollToTop />
    </div>
  )
}
