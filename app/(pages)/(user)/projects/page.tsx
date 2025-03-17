"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import ScrollAnimations from "@/components/scroll-animations"
import ScrollToTop from "@/components/scroll-to-top"
import { IProject } from "@/types/project"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch Projects Function
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

  // Scroll Handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchProjects()
    }
  }, [loading, hasMore])

  // Add/Remove Scroll Listener
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

  // Initial Fetch
  useEffect(() => {
    fetchProjects()
  }, [])

  const categories = ["All", ...new Set(projects.map((project) => project.category))]

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <div
      className="px-4 md:px-6 py-12 md:py-24 overflow-y-auto h-screen"
      ref={containerRef}
    >
      <ScrollAnimations className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Our Projects</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our portfolio of successful engineering and design projects across various categories
        </p>
      </ScrollAnimations>

      <ScrollAnimations>
        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto p-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-4 py-2">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ScrollAnimations key={project._id}>
                    <ProjectCard
                      title={project.title}
                      category={project.category}
                      description={project.description}
                      image={project.image}
                      link={`/projects/${project._id}`}
                      badgeColor="default"
                    />
                  </ScrollAnimations>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ScrollAnimations>

      {loading && (
        <div className="text-center py-6">
          <p className="text-muted-foreground">Loading more projects...</p>
        </div>
      )}

      <ScrollToTop />
    </div>
  )
}
