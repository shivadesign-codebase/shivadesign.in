import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CuboidIcon, CheckCircle, ArrowRight, Building, Building2, Home, Factory, Layers, Eye, PenTool, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "3D Elevation Design with Vastu in Maharajganj | Shiva Design Associates",
  description: "Get realistic 3D elevation designs in Maharajganj that align with Vastu principles. Shiva Design Associates delivers stunning visualizations for residential and commercial spaces.",
}

export default function ThreeDElevationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2430] to-[#2a3142] text-white">
      {/* Hero Section with 3D Model Showcase */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/cad.jpg?height=800&width=1600')] bg-no-repeat bg-cover bg-center" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#5d9cec]/20 text-[#5d9cec] text-sm font-medium mb-2">
                Visualization Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                3D & 2D <span className="text-[#5d9cec]">Elevation</span> Services
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Stunning architectural elevations and 3D models that bring your projects to life, helping you visualize
                the final outcome before construction begins.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">View Portfolio</Button>
                <Button variant="outline" className="border-[#5d9cec] text-[#5d9cec] hover:bg-[#5d9cec]/10">
                  Request a Demo
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-700 group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/cad.jpg?height=800&width=800"
                    alt="3D Building Rendering"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#2a3142]/80 backdrop-blur-sm rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <CuboidIcon className="h-8 w-8 text-[#5d9cec]" />
                    <div>
                      <h3 className="font-medium">Photorealistic Rendering</h3>
                      <p className="text-sm text-gray-300">Bringing architectural designs to life</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Visualization Services</h2>
            <p className="text-gray-300">
              We offer a comprehensive range of 3D and 2D visualization services to meet your project needs.
            </p>
          </div>

          <Tabs defaultValue="3d" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-[#1e2430] p-1 rounded-lg">
              <TabsTrigger value="3d" className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white">
                3D Visualization
              </TabsTrigger>
              <TabsTrigger value="2d" className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white">
                2D Elevation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="3d" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/assets/cad.jpg?height=800&width=600"
                    alt="3D Exterior Rendering"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-medium mb-2">Exterior Renderings</h3>
                    <p className="text-gray-300 mb-4">
                      Photorealistic 3D visualizations of building exteriors from any angle.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <Building className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Interior Visualizations</h3>
                    <p className="text-gray-300">
                      Detailed 3D renderings of interior spaces with realistic lighting, materials, and furnishings.
                    </p>
                  </div>
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Virtual Walkthroughs</h3>
                    <p className="text-gray-300">
                      Interactive 3D tours that allow clients to explore buildings before they're built.
                    </p>
                  </div>
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <Layers className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">3D Animations</h3>
                    <p className="text-gray-300">
                      Dynamic video presentations showcasing your project from various perspectives.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="2d" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Facade Elevations</h3>
                    <p className="text-gray-300">
                      Detailed 2D drawings of building facades with accurate proportions and architectural elements.
                    </p>
                  </div>
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <PenTool className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Section Drawings</h3>
                    <p className="text-gray-300">
                      Cross-sectional views that reveal the internal structure and spatial relationships.
                    </p>
                  </div>
                  <div className="p-6 bg-[#1e2430] rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-[#5d9cec]" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Conceptual Sketches</h3>
                    <p className="text-gray-300">
                      Artistic renderings that capture the essence and vision of your architectural concept.
                    </p>
                  </div>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/assets/cad.jpg?height=800&width=600"
                    alt="2D Elevation Drawing"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-medium mb-2">2D Elevation Drawings</h3>
                    <p className="text-gray-300 mb-4">
                      Precise technical drawings with detailed architectural elements.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-300">
              Explore our portfolio of stunning 3D visualizations and 2D elevations across various project types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Luxury Residential Complex",
                category: "Residential",
                description: "3D exterior and interior visualizations for a high-end residential development.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Home className="h-5 w-5" />,
              },
              {
                title: "Corporate Headquarters",
                category: "Commercial",
                description: "Complete 3D modeling and rendering for a modern office building.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Building className="h-5 w-5" />,
              },
              {
                title: "Shopping Mall",
                category: "Retail",
                description: "Exterior elevations and interior visualizations for a shopping center.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Building2 className="h-5 w-5" />,
              },
              {
                title: "Industrial Complex",
                category: "Industrial",
                description: "3D renderings and technical elevations for a manufacturing facility.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Factory className="h-5 w-5" />,
              },
              {
                title: "Residential Villa",
                category: "Residential",
                description: "Detailed 3D visualizations and 2D elevations for a luxury villa.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Home className="h-5 w-5" />,
              },
              {
                title: "Hotel & Resort",
                category: "Hospitality",
                description: "Comprehensive 3D modeling and animations for a beachfront resort.",
                image: "/assets/cad.jpg?height=400&width=600",
                icon: <Building className="h-5 w-5" />,
              },
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image || "/assets/cad.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] via-[#1e2430]/70 to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5d9cec]/20 text-[#5d9cec] text-sm">
                    {project.icon}
                    <span>{project.category}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <Link href="#" className="text-[#5d9cec] flex items-center text-sm hover:underline">
                    View Project <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section with Interactive Elements */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Visualization Process</h2>
            <p className="text-gray-300">
              We follow a collaborative approach to create stunning visualizations that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Concept Discussion",
                description: "We begin by understanding your vision, requirements, and project goals.",
                icon: <Lightbulb className="h-6 w-6" />,
              },
              {
                step: "02",
                title: "3D Modeling",
                description: "Our team creates detailed 3D models based on your architectural plans.",
                icon: <CuboidIcon className="h-6 w-6" />,
              },
              {
                step: "03",
                title: "Material & Lighting",
                description: "We apply realistic materials, textures, and lighting to enhance visual appeal.",
                icon: <Eye className="h-6 w-6" />,
              },
              {
                step: "04",
                title: "Final Rendering",
                description: "High-resolution renders are produced and refined based on your feedback.",
                icon: <Layers className="h-6 w-6" />,
              },
            ].map((process, index) => (
              <Card
                key={index}
                className="bg-[#1e2430] border-gray-700 hover:border-[#5d9cec] transition-colors overflow-hidden group"
              >
                <CardContent className="p-6 relative">
                  <div className="absolute -top-6 -right-6 text-7xl font-bold text-[#5d9cec]/10 group-hover:text-[#5d9cec]/20 transition-colors">
                    {process.step}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4 text-[#5d9cec]">
                    {process.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">{process.title}</h3>
                  <p className="text-gray-300 relative z-10">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#5d9cec]/10 rounded-lg blur-xl"></div>
              <div className="relative bg-[#2a3142] p-6 rounded-lg border border-gray-700">
                <Image
                  src="/assets/cad.jpg?height=600&width=800"
                  alt="3D Visualization Benefits"
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Benefits of 3D & 2D Visualization</h2>
              <div className="space-y-4">
                {[
                  "Visualize your project before construction begins, saving time and money on revisions",
                  "Improve communication with stakeholders by providing realistic visual representations",
                  "Identify potential design issues early in the development process",
                  "Create compelling marketing materials to attract investors and clients",
                  "Enhance decision-making with accurate spatial understanding of your project",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d9cec]">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Visualize Your Project?</h2>
            <p className="text-white/80 mb-8">
              Contact us today to discuss your visualization needs and bring your architectural vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#5d9cec] hover:bg-white/90">View Our Portfolio</Button>
              <Button variant="outline" className="border-white text-[#2a3142] hover:text-white hover:bg-white/10">
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
