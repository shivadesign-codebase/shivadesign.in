import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, Users, Workflow, ArrowRight } from "lucide-react"

export default function AutoCADDraftingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2430] to-[#2a3142] text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-no-repeat bg-cover bg-center" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#5d9cec]/20 text-[#5d9cec] text-sm font-medium mb-2">
                Professional CAD Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AutoCAD Drafting <span className="text-[#5d9cec]">Services</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Precision drafting services using the latest AutoCAD technology to create detailed technical drawings
                for your construction and engineering projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">Request a Quote</Button>
                <Button variant="outline" className="border-[#5d9cec] text-[#5d9cec] hover:bg-[#5d9cec]/10">
                  View Sample Drawings
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              <Image src="/placeholder.svg?height=800&width=800" alt="AutoCAD Drafting" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#2a3142]/80 backdrop-blur-sm rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[#5d9cec]" />
                  <div>
                    <h3 className="font-medium">Precision Engineering</h3>
                    <p className="text-sm text-gray-300">Accurate to 0.01mm specifications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Drafting Solutions</h2>
            <p className="text-gray-300">
              Our AutoCAD drafting services cover a wide range of technical drawing needs for various industries and
              project types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Architectural Plans",
                description: "Detailed floor plans, elevations, sections, and construction details for buildings.",
                icon: <FileText className="h-6 w-6" />,
              },
              {
                title: "Structural Drawings",
                description: "Foundation plans, framing layouts, connection details, and reinforcement drawings.",
                icon: <FileText className="h-6 w-6" />,
              },
              {
                title: "MEP Systems",
                description: "Mechanical, electrical, and plumbing system layouts and detailed drawings.",
                icon: <FileText className="h-6 w-6" />,
              },
              {
                title: "As-Built Documentation",
                description: "Accurate documentation of existing structures and completed construction projects.",
                icon: <FileText className="h-6 w-6" />,
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-[#1e2430] border-gray-700 hover:border-[#5d9cec] transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Drafting Process</h2>
            <p className="text-gray-300">
              We follow a systematic approach to ensure high-quality, accurate technical drawings that meet your
              specifications.
            </p>
          </div>

          <div className="relative">
            {/* Process timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5d9cec] to-[#5d9cec]/30 hidden md:block"></div>

            <div className="space-y-12 relative">
              {[
                {
                  title: "Requirements Gathering",
                  description:
                    "We start by understanding your project needs, specifications, and any existing documentation.",
                  icon: <Users className="h-6 w-6" />,
                },
                {
                  title: "Preliminary Drafts",
                  description: "Our team creates initial drafts based on your requirements and industry standards.",
                  icon: <FileText className="h-6 w-6" />,
                },
                {
                  title: "Review & Refinement",
                  description: "You review the drafts and provide feedback, which we incorporate into the drawings.",
                  icon: <CheckCircle className="h-6 w-6" />,
                },
                {
                  title: "Final Delivery",
                  description: "We deliver the finalized drawings in your preferred format, ready for implementation.",
                  icon: <Workflow className="h-6 w-6" />,
                },
              ].map((step, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-start gap-4 md:gap-8">
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:order-1 md:pl-8"}`}>
                    <div
                      className={`p-6 bg-[#2a3142] rounded-lg border border-gray-700 ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#5d9cec]/10 flex items-center justify-center mb-4 mx-auto md:mx-0 md:ml-auto">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#5d9cec] transform -translate-x-1/2 hidden md:block">
                    <div className="absolute inset-0.5 rounded-full bg-[#1e2430]"></div>
                    <div className="absolute inset-1.5 rounded-full bg-[#5d9cec]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Recent Projects</h2>
            <p className="text-gray-300">
              Take a look at some of our recent AutoCAD drafting projects across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Commercial Complex",
                description:
                  "Complete set of architectural and structural drawings for a 10-story commercial building.",
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Residential Development",
                description: "Detailed floor plans and elevations for a luxury residential community with 25 units.",
                image: "/placeholder.svg?height=400&width=600",
              },
              {
                title: "Industrial Facility",
                description: "MEP system layouts and structural details for a manufacturing plant expansion.",
                image: "/placeholder.svg?height=400&width=600",
              },
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <Link href="#" className="text-[#5d9cec] flex items-center text-sm hover:underline">
                    View Project Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our AutoCAD Drafting Services</h2>
              <div className="space-y-4">
                {[
                  "Experienced team of certified AutoCAD professionals",
                  "Strict quality control and adherence to industry standards",
                  "Quick turnaround times to meet your project deadlines",
                  "Competitive pricing with flexible engagement models",
                  "Revisions and support included in our service packages",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#5d9cec]/10 rounded-lg blur-xl"></div>
              <div className="relative bg-[#2a3142] p-6 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Projects Completed", value: "500+" },
                    { label: "Client Satisfaction", value: "98%" },
                    { label: "Years of Experience", value: "15+" },
                    { label: "Industry Sectors", value: "12" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-[#1e2430] rounded-lg">
                      <p className="text-3xl font-bold text-[#5d9cec]">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d9cec]">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your AutoCAD Project?</h2>
            <p className="text-white/80 mb-8">
              Contact us today to discuss your drafting requirements and get a customized quote for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#5d9cec] hover:bg-white/90">Request a Quote</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
