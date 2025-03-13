import ServiceCard from "@/components/service-card"
import { FileText, CuboidIcon as Cube, ShieldCheck, Sofa } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      title: "AutoCAD Drafting",
      description: "Precision drafting services with detailed 2D technical drawings for your construction projects",
      icon: <FileText className="h-8 w-8" />,
      link: "/services/autocad-drafting",
    },
    {
      title: "3D & 2D Elevation",
      description:
        "Stunning architectural elevations and 3D models that bring your projects to life before construction",
      icon: <Cube className="h-8 w-8" />,
      link: "/services/3d-elevation",
    },
    {
      title: "Site Inspection",
      description: "Comprehensive on-site assessments to ensure quality and compliance with building regulations",
      icon: <ShieldCheck className="h-8 w-8" />,
      link: "/services/site-inspection",
    },
    {
      title: "Interior Design",
      description:
        "Create stunning, functional interior spaces that reflect your style and enhance your quality of life with our expert design services",
      icon: <Sofa className="h-8 w-8" />,
      link: "/services/interior-designing",
    },
  ]

  return (
    <section id="services" className="py-16 md:py-24 text-white inset-0 bg-gradient-to-b from-transparent bg-[#1F2937]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Engineering Services</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Professional civil engineering solutions tailored to meet your project requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
