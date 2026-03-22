import ProjectCard from "@/components/project-card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ScrollAnimations from "@/components/scroll-animations"
import ScrollToTop from "@/components/scroll-to-top"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ServicesSection from "@/components/home/services-section"
import FounderProfile from "@/components/founder-profile"
import TrustedClientsSection from "@/components/home/trusted-client-section"
import getProjectsAction from "./Actions/get-paginated-projects"
import { IProject } from "./models/project"
import HeroSection from "@/components/theme-based/theme-hero-section"
import getSettingsAction from "./Actions/get-settings"
import ConsultationCtaCard from "@/components/consultation-cta-card"
import getPublicTestimonialsAction from "./Actions/get-public-testimonials"
import { getActiveBanner } from "./services/getActiveBanner"

export default async function Home() {
  const projects = await getProjectsAction({ limit: 3 })
  const parsedProjects: IProject[] = JSON.parse(projects)
  const settings = await getSettingsAction()
  const testimonials = await getPublicTestimonialsAction()
  const activeBannerUrl = await getActiveBanner()

  return (
    <>
      <HeroSection settings={settings} bannerImageUrl={activeBannerUrl} />

      <ServicesSection />

      <FounderProfile />

      {/* Projects */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">

          <ScrollAnimations className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of successful engineering projects
            </p>
          </ScrollAnimations>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {parsedProjects.map((project, index) => (
              <ScrollAnimations key={index}>
                <ProjectCard {...project} />
              </ScrollAnimations>
            ))}
          </div>

          <ScrollAnimations className="text-center mt-14">
            <Button asChild variant="outline" size="lg">
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

      <ConsultationCtaCard
        source="home"
        pagePath="/"
        displayMode="popup"
        dismissible
        className="max-w-md sm:max-w-xl"
      />

      <ScrollToTop />
    </>
  )
}
