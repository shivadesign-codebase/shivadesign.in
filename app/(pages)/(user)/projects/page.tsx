"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { toast } from "sonner"
import Fuse from "fuse.js"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ScrollToTop from "@/components/scroll-to-top"
import ProjectCard from "@/components/project/project-card"
import ScrollAnimations from "@/components/scroll-animations"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectSkeleton from "@/components/project/project-skeleton"
import ProjectDetailDialog from "@/components/project/project-detail-dialog"
import type { IProject } from "@/types/project"

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [displayedProjects, setDisplayedProjects] = useState<IProject[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const ITEMS_PER_PAGE = 6

  // Initialize Fuse for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(allProjects, {
      keys: ["title", "description", "category", "type"],
      threshold: 0.4,
      includeScore: true,
    })
  }, [allProjects])

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allProjects.map((project) => project.category))
    return ["All", ...Array.from(uniqueCategories)]
  }, [allProjects])

  // Fetch initial projects
  const fetchInitialProjects = async () => {
    setInitialLoading(true)
    try {
      // In a real app, you would fetch from an API
      const res = await fetch('/api/projects?limit=100')
      const data = await res.json()
      setAllProjects(data.projects)

      // Set initial displayed projects
      setDisplayedProjects(data.projects.slice(0, ITEMS_PER_PAGE))
      setPage(2)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      toast("Error", { description: "Failed to load projects." })
    } finally {
      setInitialLoading(false)
    }
  }

  // Load more projects
  const loadMoreProjects = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = page * ITEMS_PER_PAGE

      // In a real app with API:
      const res = await fetch(`/api/projects?page=${page}&limit=${ITEMS_PER_PAGE}`)
      const data = await res.json()
      const newProjects = getFilteredProjects().slice(startIndex, endIndex)

      if (newProjects.length === 0) {
        setHasMore(false)
      } else {
        setDisplayedProjects((prev) => {
          // Create a Set of existing IDs to prevent duplicates
          const existingIds = new Set(prev.map((p) => p._id))
          // Only add projects that aren't already displayed
          const uniqueNewProjects = newProjects.filter((p) => !existingIds.has(p._id))
          return [...prev, ...uniqueNewProjects]
        })
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Failed to load more projects:", error)
      toast("Error", { description: "Failed to load more projects." })
    } finally {
      setLoadingMore(false)
    }
  }

  // Filter projects based on category and search query
  const getFilteredProjects = useCallback(() => {
    let filtered = allProjects

    // Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((project) => project.category === activeCategory)
    }

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const results = fuse.search(searchQuery)
      filtered = results.map((result) => result.item)
    }

    return filtered
  }, [allProjects, activeCategory, searchQuery, fuse])

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setSearchQuery("") // Clear search when changing category
    setPage(1)
    setHasMore(true)

    // Reset displayed projects when changing category
    setTimeout(() => {
      const filtered = category === "All" ? allProjects : allProjects.filter((project) => project.category === category)

      setDisplayedProjects(filtered.slice(0, ITEMS_PER_PAGE))
      setPage(2)
    }, 0)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)

    const filtered = getFilteredProjects()
    setDisplayedProjects(filtered.slice(0, ITEMS_PER_PAGE))
    setPage(2)
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }

  // Open project detail dialog
  const openProjectDetail = (project: IProject) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  // Setup Intersection Observer for infinite scrolling
  useEffect(() => {
    if (initialLoading) return

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreProjects()
      }
    }, options)

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, initialLoading, activeCategory, searchQuery])

  // Fetch initial data
  useEffect(() => {
    fetchInitialProjects()

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Update displayed projects when filters change
  useEffect(() => {
    if (!initialLoading && !loadingMore) {
      const filtered = getFilteredProjects()
      setHasMore(filtered.length > displayedProjects.length)
    }
  }, [activeCategory, searchQuery, getFilteredProjects, initialLoading, loadingMore, displayedProjects.length])

  // SEO metadata
  const pageTitle = "Our Projects | Shiva Design Associates"
  const pageDescription =
    "Explore our portfolio of successful engineering and design projects across various categories including architecture, interior design, and infrastructure."

  return (
    <>
      {/* SEO metadata */}
      <div className="hidden">
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </div>

      <div className="container px-4 md:px-6 py-12 md:py-24">
        <ScrollAnimations className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Projects</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful engineering and design projects across various categories
          </p>
        </ScrollAnimations>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Tabs defaultValue="All" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="flex flex-nowrap">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="px-4 py-2 whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialLoading ? (
            // Initial loading skeletons
            Array(6)
              .fill(0)
              .map((_, index) => (
                <ScrollAnimations key={`skeleton-${index}`}>
                  <ProjectSkeleton />
                </ScrollAnimations>
              ))
          ) : displayedProjects.length > 0 ? (
            // Displayed projects
            displayedProjects.map((project) => (
              <ScrollAnimations key={project._id}>
                <div onClick={() => openProjectDetail(project)}>
                  <ProjectCard
                    title={project.title}
                    category={project.category}
                    description={project.description}
                    image={project.image || "/placeholder.svg?height=300&width=400"}
                    link="#"
                    badgeColor="default"
                    onClick={(e) => {
                      e.preventDefault()
                      openProjectDetail(project)
                    }}
                  />
                </div>
              </ScrollAnimations>
            ))
          ) : (
            // No projects found
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("All")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More Indicator */}
        {!initialLoading && hasMore && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-8 mt-4">
            {loadingMore ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Loading more projects...</p>
              </div>
            ) : (
              <div className="h-8" />
            )}
          </div>
        )}

        {/* No more projects indicator */}
        {!initialLoading && !hasMore && displayedProjects.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end of our project showcase.</p>
          </div>
        )}

        {/* Project Detail Dialog */}
        <ProjectDetailDialog project={selectedProject} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

        <ScrollToTop />
      </div>
    </>
  )
}
