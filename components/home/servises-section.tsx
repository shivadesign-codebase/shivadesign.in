import ServiceCard from "@/components/service-card"
import { FileText, CuboidIcon as Cube, Sofa, ClipboardCheck, MapPin, Calculator, Compass } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      title: "AutoCAD Drafting",
      description:
        "Precision drafting services using the latest AutoCAD technology to create detailed technical drawings for your construction and engineering projects.",
      icon: <FileText className="h-6 w-6" />,
      link: "/services/autocad-drafting",
      features: [
        "Architectural floor plans and layouts",
        "Structural detailing and drawings",
        "Mechanical and electrical systems",
        "As-built documentation",
      ],
      showPopup: false,
    },
    {
      title: "3D & 2D Elevation",
      description:
        "Stunning architectural elevations and 3D models that bring your projects to life, helping you visualize the final outcome before construction begins.",
      icon: <Cube className="h-6 w-6" />,
      link: "/services/3d-elevation",
      features: [
        "Photorealistic 3D exterior renderings",
        "Interior 3D visualizations",
        "2D facade and elevation drawings",
        "Virtual walkthroughs and animations",
      ],
      showPopup: false,
    },
    {
      title: "Interior Designing",
      description:
        "Create stunning, functional interior spaces that reflect your style and enhance your quality of life with our expert design services",
      icon: <Sofa className="h-8 w-8" />,
      link: "/services/interior-designing",
      features: [
        "Residential interior design",
        "Commercial space planning",
        "Custom furniture design",
        "Color and material selection",
      ],
      showPopup: false,
    },
    // {
    //   title: "Site Supervision",
    //   description:
    //     "Professional on-site supervision to ensure construction proceeds according to plans, specifications, and quality standards.",
    //   icon: <MapPin className="h-6 w-6" />,
    //   link: "/services/site-inspection",
    //   features: [
    //     "Regular site visits and inspections",
    //     "Quality control monitoring",
    //     "Construction progress tracking",
    //     "Issue identification and resolution",
    //   ],
    //   showPopup: false,
    // },
    {
      title: "Government Approval Drawing",
      description:
        "Professional preparation of drawings and documentation required for obtaining approvals from local government authorities and regulatory bodies.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      link: "/services/government-approval",
      features: [
        "Building permit applications",
        "Compliance with local building codes",
        "Regulatory documentation preparation",
        "Liaison with approval authorities",
      ],
      showPopup: true,
    },
    {
      title: "Estimate Evaluation",
      description:
        "Comprehensive evaluation of project estimates to ensure accuracy, completeness, and value for money in construction projects.",
      icon: <Calculator className="h-6 w-6" />,
      link: "/services/estimate-evaluation",
      features: [
        "Detailed cost analysis",
        "Material quantity verification",
        "Labor cost assessment",
        "Budget optimization recommendations",
      ],
      showPopup: true,
    },
    {
      title: "Vastu Based Design",
      description:
        "Architectural and interior design services that incorporate traditional Vastu Shastra principles for harmony and positive energy in living and working spaces.",
      icon: <Compass className="h-6 w-6" />,
      link: "/services/vastu-design",
      features: [
        "Vastu-compliant floor plans",
        "Direction-based space planning",
        "Element balancing in design",
        "Remedial solutions for existing structures",
      ],
      showPopup: true,
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
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              features={service.features}
              showPopup={service.showPopup}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
