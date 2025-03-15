"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import ScrollAnimations from "@/components/scroll-animations"
import ScrollToTop from "@/components/scroll-to-top"

// Sample project data
const projects = [
  {
    id: 1,
    title: "Commercial Complex",
    category: "Architecture",
    description: "Modern commercial building with innovative structural solutions.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/commercial-complex",
    badgeColor: "default",
  },
  {
    id: 2,
    title: "Luxury Villa Interior",
    category: "Interior",
    description: "Contemporary interior design for a luxury villa with premium finishes.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/luxury-villa-interior",
    badgeColor: "secondary",
  },
  {
    id: 3,
    title: "Residential Tower",
    category: "Architecture",
    description: "High-rise residential building with earthquake-resistant design.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/residential-tower",
    badgeColor: "secondary",
  },
  {
    id: 4,
    title: "Highway Bridge",
    category: "Infrastructure",
    description: "Modern suspension bridge with innovative engineering solutions.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/highway-bridge",
    badgeColor: "outline",
  },
  {
    id: 5,
    title: "Corporate Office Design",
    category: "Interior",
    description: "Ergonomic and modern office space design for a corporate headquarters.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/corporate-office",
    badgeColor: "default",
  },
  {
    id: 6,
    title: "Shopping Mall Elevation",
    category: "3D Elevation",
    description: "Stunning 3D elevation design for a multi-story shopping mall.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/shopping-mall",
    badgeColor: "secondary",
  },
  {
    id: 7,
    title: "Residential Complex",
    category: "3D Elevation",
    description: "Detailed 3D elevation for a large residential housing complex.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/residential-complex",
    badgeColor: "default",
  },
  {
    id: 8,
    title: "Hospital Building",
    category: "Architecture",
    description: "Modern hospital design with efficient space utilization and healing environment.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/hospital-building",
    badgeColor: "outline",
  },
  {
    id: 9,
    title: "Vastu Compliant Home",
    category: "Vastu Design",
    description: "Residential design following traditional Vastu principles for harmony.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/vastu-home",
    badgeColor: "default",
  },
  {
    id: 10,
    title: "Government Office Complex",
    category: "Government Approval",
    description: "Comprehensive design and approval documentation for a government office complex.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/government-office",
    badgeColor: "secondary",
  },
  {
    id: 11,
    title: "Retail Store Interior",
    category: "Interior",
    description: "Modern retail store interior design with optimal customer flow and display areas.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/retail-store",
    badgeColor: "default",
  },
  {
    id: 12,
    title: "Township Master Plan",
    category: "Architecture",
    description: "Comprehensive master planning for a self-contained township development.",
    image: "/assets/cad.jpg?height=300&width=400",
    link: "/projects/township-plan",
    badgeColor: "outline",
  },
]

// Get unique categories for tabs
const categories = ["All", ...new Set(projects.map((project) => project.category))]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
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
                  <ScrollAnimations key={project.id}>
                    <ProjectCard
                      title={project.title}
                      category={project.category}
                      description={project.description}
                      image={project.image}
                      link={project.link}
                      badgeColor={project.badgeColor as "default" | "secondary" | "outline"}
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

      <ScrollToTop />
    </div>
  )
}
