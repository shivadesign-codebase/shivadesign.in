import HeroSection from "@/components/hero-section"
import ProjectCard from "@/components/project-card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ScrollAnimations from "@/components/scroll-animations"
import ScrollToTop from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ServicesSection from "@/components/home/servises-section"

export default function Home() {
  const projects = [
    {
      title: "Commercial Complex ",
      category: "Commercial",
      description: "Modern commercial building with innovative structural solutions.",
      image: "/placeholder.svg?height=300&width=400",
      link: "/projects/commercial-complex",
      badgeColor: "default" as "default",
    },
    {
      title: "Residential Tower",
      category: "Residential",
      description: "High-rise residential building with earthquake-resistant design.",
      image: "/placeholder.svg?height=300&width=400",
      link: "/projects/residential-tower",
      badgeColor: "secondary" as "secondary",
    },
    {
      title: "Highway Bridge",
      category: "Infrastructure",
      description: "Modern suspension bridge with innovative engineering solutions.",
      image: "/placeholder.svg?height=300&width=400",
      link: "/projects/highway-bridge",
      badgeColor: "outline" as "outline",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "GreenSpace Developers",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      text: "Working with ER. Harsh Verma and Shiva Consultant was an excellent experience. Their attention to detail in the structural design of our commercial complex was impeccable. They provided innovative solutions that saved us both time and construction costs.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Horizon Homes",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      text: "The team at Shiva Consultant delivered exceptional 3D elevation designs for our residential project. Their visualizations helped us market the properties effectively, and the final construction matched the renderings perfectly.",
    },
    {
      id: 3,
      name: "Sanjay Patel",
      company: "City Infrastructure",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      text: "The site inspection services provided by Shiva Consultant ensured our project met all quality standards and building codes. Their detailed reports and recommendations were invaluable throughout the construction process.",
    },
  ]

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <ScrollAnimations className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of successful engineering projects
            </p>
          </ScrollAnimations>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
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

          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-8">Trusted by Leading Organizations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="bg-muted h-16 w-full max-w-[200px] rounded flex items-center justify-center text-muted-foreground">
                    Client Logo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <ScrollAnimations>
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Contact Shiva Consultant today for a consultation and bring your construction vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </ScrollAnimations>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}
