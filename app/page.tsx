import HeroSection from "@/components/hero-section"
import ProjectCard from "@/components/project-card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ScrollAnimations from "@/components/scroll-animations"
import ScrollToTop from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ServicesSection from "@/components/home/servises-section"
import FounderProfile from "@/components/founder-profile"
import TrustedClientsSection from "@/components/home/trusted-client-section"
import getProjectsAction from "./Actions/get-paginated-projects"
import { IProject } from "./models/project"

export default async function Home() {
  const projects = await getProjectsAction({ limit: 3 })
  const parsedProjects: IProject[] = JSON.parse(projects)

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "GreenSpace Developers",
      avatar: "/assets/cad.jpg?height=40&width=40",
      rating: 5,
      text: "Working with ER. Harsh Verma and Shiva Consultant was an excellent experience. Their attention to detail in the structural design of our commercial complex was impeccable. They provided innovative solutions that saved us both time and construction costs.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Horizon Homes",
      avatar: "/assets/cad.jpg?height=40&width=40",
      rating: 4,
      text: "The team at Shiva Consultant delivered exceptional 3D elevation designs for our residential project. Their visualizations helped us market the properties effectively, and the final construction matched the renderings perfectly.",
    },
    {
      id: 3,
      name: "Sanjay Patel",
      company: "City Infrastructure",
      avatar: "/assets/cad.jpg?height=40&width=40",
      rating: 5,
      text: "The site inspection services provided by Shiva Consultant ensured our project met all quality standards and building codes. Their detailed reports and recommendations were invaluable throughout the construction process.",
    },
  ]

  return (
    <>
      <HeroSection />

      <ServicesSection />

      {/* Add the Founder Profile section here */}
      <FounderProfile />

      {/* Projects */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <ScrollAnimations className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of successful engineering projects
            </p>
          </ScrollAnimations>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {parsedProjects.map((project, index) => (
              <ScrollAnimations key={index}>
                <ProjectCard {...project} />
              </ScrollAnimations>
            ))}
          </div>

          <ScrollAnimations className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </ScrollAnimations>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background" id="testimonial-section">
        <div className="container px-4 md:px-6">
          <ScrollAnimations className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear what our clients have to say about our civil engineering consultancy services
            </p>
          </ScrollAnimations>

          <ScrollAnimations>
            <TestimonialCarousel testimonials={testimonials} />
          </ScrollAnimations>
        </div>
        <TrustedClientsSection />
      </section>
      <ScrollToTop />
    </>
  )
}
