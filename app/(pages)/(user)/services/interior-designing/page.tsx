import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight, Sofa, Lightbulb, Palette, Home, Building, Sparkles, Layers, Users, Ruler, Compass } from "lucide-react"

export const metadata: Metadata = {
  title: "Interior Designing with Vastu in Maharajganj | Shiva Design Associates",
  description: "Transform your space with Vastu-compliant interior designing services in Maharajganj. Shiva Design Associates offers elegant and balanced interiors for homes and offices.",
}

export default function InteriorDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2430] to-[#2a3142] text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/cad.jpg?height=800&width=1600')] bg-no-repeat bg-cover bg-center" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#5d9cec]/20 text-[#5d9cec] text-sm font-medium mb-2">
                Transform Your Space
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Interior <span className="text-[#5d9cec]">Design</span> Services
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Create stunning, functional interior spaces that reflect your style and meet your needs with our
                professional interior design services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">Book a Consultation</Button>
                <Button variant="outline" className="border-[#5d9cec] text-[#5d9cec] hover:text-[#5d9cec] hover:bg-[#5d9cec]/10">
                  <Link href={'/projects'}>View Portfolio</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-700 group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/interior-design.jpg?height=800&width=800"
                    alt="Interior Design"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#2a3142]/80 backdrop-blur-sm rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Sofa className="h-8 w-8 text-[#5d9cec]" />
                    <div>
                      <h3 className="font-medium">Elegant Living Spaces</h3>
                      <p className="text-sm text-gray-300">Functional design with aesthetic appeal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Design Services</h2>
            <p className="text-gray-300">
              Comprehensive interior design solutions tailored to your specific needs and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Residential Design",
                description:
                  "Transform your home with personalized interior design that reflects your lifestyle and enhances functionality.",
                icon: <Home className="h-6 w-6" />,
              },
              {
                title: "Commercial Design",
                description:
                  "Create productive, impressive commercial spaces that enhance brand identity and improve workflow efficiency.",
                icon: <Building className="h-6 w-6" />,
              },
              {
                title: "Space Planning",
                description:
                  "Optimize your interior layout to maximize functionality, flow, and aesthetic appeal within your space.",
                icon: <Ruler className="h-6 w-6" />,
              },
              {
                title: "Color Consultation",
                description:
                  "Expert guidance on color schemes that create the perfect atmosphere and complement your interior elements.",
                icon: <Palette className="h-6 w-6" />,
              },
              {
                title: "Furniture Selection",
                description:
                  "Curated furniture recommendations that balance style, comfort, and functionality for your space.",
                icon: <Sofa className="h-6 w-6" />,
              },
              {
                title: "Lighting Design",
                description:
                  "Strategic lighting solutions that enhance ambiance, highlight architectural features, and improve functionality.",
                icon: <Sparkles className="h-6 w-6" />,
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-[#1e2430] border-gray-700 hover:border-[#5d9cec] transition-colors h-full"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#5d9cec]/10 flex items-center justify-center mb-4 text-[#5d9cec]">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Design Styles Showcase */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Design Styles We Specialize In</h2>
            <p className="text-gray-300">
              Explore our expertise across a diverse range of interior design styles to find the perfect match for your
              vision.
            </p>
          </div>

          <Tabs defaultValue="modern" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-[#2a3142] p-1 rounded-lg">
              <TabsTrigger value="modern" className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white">
                Modern
              </TabsTrigger>
              <TabsTrigger
                value="traditional"
                className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white"
              >
                Traditional
              </TabsTrigger>
              <TabsTrigger
                value="minimalist"
                className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white"
              >
                Minimalist
              </TabsTrigger>
              <TabsTrigger value="eclectic" className="data-[state=active]:bg-[#5d9cec] data-[state=active]:text-white">
                Eclectic
              </TabsTrigger>
            </TabsList>

            {["modern", "traditional", "minimalist", "eclectic"].map((style) => (
              <TabsContent key={style} value={style} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={`/assets/cad.jpg?height=800&width=600&text=${style.charAt(0).toUpperCase() + style.slice(1)}`}
                      alt={`${style} Interior Design`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold capitalize">{style} Design</h3>
                    <p className="text-gray-300">
                      {style === "modern" &&
                        "Clean lines, simple color palettes, and a focus on function characterize modern interior design. This style embraces open spaces, natural light, and materials like glass, metal, and concrete for a sleek, contemporary feel."}
                      {style === "traditional" &&
                        "Traditional design celebrates elegance and comfort with classic furniture pieces, rich color palettes, and detailed architectural elements. This timeless style incorporates antiques, symmetrical arrangements, and luxurious textiles."}
                      {style === "minimalist" &&
                        "Less is more in minimalist design, which focuses on simplicity, clean lines, and a monochromatic color palette. This style eliminates clutter and emphasizes the essential elements of a space for a calm, uncluttered environment."}
                      {style === "eclectic" &&
                        "Eclectic design blends various styles, textures, and time periods to create unique, personalized spaces. This approach allows for creative expression through carefully curated combinations of furniture, art, and decorative elements."}
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-medium">Key Features:</h4>
                      <ul className="space-y-2">
                        {style === "modern" &&
                          [
                            "Clean, crisp lines with minimal ornamentation",
                            "Open floor plans and abundant natural light",
                            "Neutral color palette with bold accent pieces",
                            "Emphasis on materials like glass, metal, and concrete",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        {style === "traditional" &&
                          [
                            "Classic furniture with curved lines and detailed woodwork",
                            "Rich color palettes and layered textures",
                            "Symmetrical arrangements and balanced proportions",
                            "Decorative moldings, columns, and architectural details",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        {style === "minimalist" &&
                          [
                            "Simplified color palette with emphasis on whites and neutrals",
                            "Functional furniture with clean, simple lines",
                            "Clutter-free spaces with hidden storage solutions",
                            "Focus on quality over quantity in furnishings",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        {style === "eclectic" &&
                          [
                            "Mix of furniture styles, textures, and time periods",
                            "Bold color combinations and pattern mixing",
                            "Personalized spaces with meaningful collections and art",
                            "Balance of contrasting elements for cohesive design",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-[#5d9cec] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">
                      View {style.charAt(0).toUpperCase() + style.slice(1)} Projects
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Design Process</h2>
            <p className="text-gray-300">
              We follow a collaborative, step-by-step approach to bring your interior design vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Consultation",
                description:
                  "We begin with an in-depth discussion to understand your needs, preferences, style, and budget.",
                icon: <Users className="h-6 w-6" />,
              },
              {
                step: "02",
                title: "Concept Development",
                description:
                  "Our designers create initial concepts including space planning, color schemes, and material selections.",
                icon: <Lightbulb className="h-6 w-6" />,
              },
              {
                step: "03",
                title: "Design Refinement",
                description:
                  "Based on your feedback, we refine the design concept and create detailed plans and visualizations.",
                icon: <Compass className="h-6 w-6" />,
              },
              {
                step: "04",
                title: "Implementation",
                description:
                  "We oversee the execution of the design, coordinating with contractors and suppliers to ensure quality.",
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

      {/* Portfolio Showcase */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Design Portfolio</h2>
            <p className="text-gray-300">
              Explore our collection of stunning interior design projects across various styles and spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Modern Apartment",
                category: "Residential",
                description: "Complete interior redesign of a 2,000 sq ft urban apartment with open concept living.",
                image: "/assets/cad.jpg?height=400&width=600&text=Modern+Apartment",
              },
              {
                title: "Executive Office",
                category: "Commercial",
                description:
                  "Sophisticated office design for a financial services firm emphasizing professionalism and comfort.",
                image: "/assets/cad.jpg?height=400&width=600&text=Executive+Office",
              },
              {
                title: "Minimalist Villa",
                category: "Residential",
                description:
                  "Clean, uncluttered design for a luxury villa focusing on essential elements and natural materials.",
                image: "/assets/cad.jpg?height=400&width=600&text=Minimalist+Villa",
              },
              {
                title: "Boutique Hotel Lobby",
                category: "Hospitality",
                description: "Striking lobby design creating a memorable first impression for hotel guests.",
                image: "/assets/cad.jpg?height=400&width=600&text=Hotel+Lobby",
              },
              {
                title: "Traditional Family Home",
                category: "Residential",
                description:
                  "Elegant interior design for a family residence with classic elements and modern functionality.",
                image: "/assets/cad.jpg?height=400&width=600&text=Family+Home",
              },
              {
                title: "Restaurant Redesign",
                category: "Commercial",
                description:
                  "Complete interior transformation of a fine dining establishment enhancing ambiance and guest experience.",
                image: "/assets/cad.jpg?height=400&width=600&text=Restaurant",
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
                    {project.category === "Residential" ? (
                      <Home className="h-4 w-4" />
                    ) : project.category === "Commercial" ? (
                      <Building className="h-4 w-4" />
                    ) : (
                      <Sofa className="h-4 w-4" />
                    )}
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
          <div className="text-center mt-10">
            <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">View All Projects</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-300">
              Hear what our clients have to say about their interior design experience with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "Homeowner",
                quote:
                  "The interior design team transformed our house into a home that perfectly reflects our style and meets our family's needs. Their attention to detail and ability to work within our budget was impressive.",
                image: "/assets/cad.jpg?height=100&width=100",
              },
              {
                name: "Rajesh Mehta",
                role: "CEO, TechStart Inc.",
                quote:
                  "Our office redesign has significantly improved employee satisfaction and productivity. The designers understood our company culture and created a space that fosters collaboration while maintaining professionalism.",
                image: "/assets/cad.jpg?height=100&width=100",
              },
              {
                name: "Ananya Patel",
                role: "Restaurant Owner",
                quote:
                  "The interior design for our restaurant has been a key factor in our success. Our customers frequently comment on the ambiance, and the functional layout has improved our service efficiency.",
                image: "/assets/cad.jpg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-[#1e2430] border-gray-700 hover:border-[#5d9cec] transition-colors h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex text-[#5d9cec]">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-auto">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || "/assets/cad.jpg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
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
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-[#5d9cec]/10 rounded-lg blur-xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/cad.jpg?height=400&width=300&text=Interior+1"
                    alt="Interior Design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden mt-8">
                  <Image
                    src="/assets/cad.jpg?height=400&width=300&text=Interior+2"
                    alt="Interior Design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/cad.jpg?height=400&width=300&text=Interior+3"
                    alt="Interior Design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden mt-8">
                  <Image
                    src="/assets/cad.jpg?height=400&width=300&text=Interior+4"
                    alt="Interior Design"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Interior Design Services</h2>
              <div className="space-y-4">
                {[
                  "Personalized designs tailored to your specific needs, preferences, and lifestyle",
                  "Expert space planning that maximizes functionality and flow in your interior spaces",
                  "Access to exclusive furniture, materials, and decor not available to the general public",
                  "Professional project management ensuring timely completion within budget",
                  "Increased property value through thoughtful, high-quality interior design",
                  "Stress-free design process with clear communication and expert guidance",
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
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Space?</h2>
            <p className="text-white/80 mb-8">
              Contact us today to schedule a consultation with our interior design experts and begin your design
              journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#5d9cec] hover:bg-white/90">
                <Link href='/contact'>Book a Consultation</Link>
              </Button>
              <Button variant="outline" className="border-white bg-transparent text-white hover:text-white hover:bg-white/10">
                <Link href={'/projects'}>View Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
