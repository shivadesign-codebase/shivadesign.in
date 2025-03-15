import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShieldCheck, CheckCircle, ClipboardCheck, FileCheck, HardHat, Building, ArrowRight, AlertTriangle, Ruler, Microscope } from "lucide-react"

export default function SiteInspectionPage() {
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
                Quality Assurance
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Site <span className="text-[#5d9cec]">Inspection</span> Services
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Comprehensive on-site assessments to ensure quality, compliance with building regulations, and adherence
                to project specifications throughout construction.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#5d9cec] hover:bg-[#4a89dc] text-white">Schedule Inspection</Button>
                <Button variant="outline" className="border-[#5d9cec] text-[#5d9cec] hover:bg-[#5d9cec]/10">
                  Learn About Our Process
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              <Image src="/assets/site-inspection.jpg?height=800&width=800" alt="Site Inspection" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#2a3142]/80 backdrop-blur-sm rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-[#5d9cec]" />
                  <div>
                    <h3 className="font-medium">Quality Assurance</h3>
                    <p className="text-sm text-gray-300">Ensuring construction meets all standards</p>
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
            <h2 className="text-3xl font-bold mb-4">Comprehensive Inspection Services</h2>
            <p className="text-gray-300">
              Our site inspection services cover all aspects of construction quality control and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Pre-Construction Assessment",
                description:
                  "Thorough site evaluation before construction begins to identify potential issues and ensure proper planning.",
                icon: <ClipboardCheck className="h-6 w-6" />,
              },
              {
                title: "Construction Progress Monitoring",
                description:
                  "Regular on-site inspections to track construction progress and ensure adherence to project timelines.",
                icon: <Building className="h-6 w-6" />,
              },
              {
                title: "Quality Control Inspections",
                description:
                  "Detailed quality checks at critical construction stages to verify workmanship and material standards.",
                icon: <Microscope className="h-6 w-6" />,
              },
              {
                title: "Regulatory Compliance",
                description:
                  "Verification that all construction activities comply with local building codes and regulations.",
                icon: <FileCheck className="h-6 w-6" />,
              },
              {
                title: "Safety Assessments",
                description:
                  "Comprehensive safety inspections to identify and mitigate potential hazards on construction sites.",
                icon: <HardHat className="h-6 w-6" />,
              },
              {
                title: "Final Inspection & Documentation",
                description:
                  "Thorough final inspection with detailed documentation and certification of completed work.",
                icon: <ShieldCheck className="h-6 w-6" />,
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
                  <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection Process */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Inspection Process</h2>
            <p className="text-gray-300">
              We follow a systematic approach to ensure thorough and effective site inspections.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Process timeline line */}
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5d9cec] to-[#5d9cec]/30 hidden md:block"></div>

            <div className="space-y-8 relative">
              {[
                {
                  title: "Initial Consultation",
                  description:
                    "We begin with a detailed discussion of your project requirements, specifications, and quality standards.",
                  icon: <ClipboardCheck className="h-6 w-6" />,
                },
                {
                  title: "Inspection Planning",
                  description:
                    "Our team develops a customized inspection plan tailored to your project's specific needs and timeline.",
                  icon: <Ruler className="h-6 w-6" />,
                },
                {
                  title: "On-Site Inspections",
                  description:
                    "Our certified inspectors conduct thorough on-site assessments at key construction milestones.",
                  icon: <HardHat className="h-6 w-6" />,
                },
                {
                  title: "Documentation & Reporting",
                  description:
                    "Detailed inspection reports with photographs, findings, and recommendations are provided after each visit.",
                  icon: <FileCheck className="h-6 w-6" />,
                },
                {
                  title: "Issue Resolution",
                  description:
                    "We work with your construction team to address any identified issues and ensure proper resolution.",
                  icon: <AlertTriangle className="h-6 w-6" />,
                },
                {
                  title: "Final Certification",
                  description:
                    "Upon project completion, we provide final inspection certification documenting compliance with all requirements.",
                  icon: <ShieldCheck className="h-6 w-6" />,
                },
              ].map((step, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#5d9cec] flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                  </div>

                  <div className="flex-1 p-6 bg-[#2a3142] rounded-lg border border-gray-700">
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Find answers to common questions about our site inspection services.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How often should site inspections be conducted during construction?",
                  answer:
                    "The frequency of site inspections depends on the project's complexity, size, and duration. For standard construction projects, we typically recommend inspections at key milestones such as foundation completion, framing, mechanical/electrical/plumbing rough-ins, and before drywall installation. For larger or more complex projects, weekly or bi-weekly inspections may be necessary to ensure quality control throughout the construction process.",
                },
                {
                  question: "What qualifications do your inspectors have?",
                  answer:
                    "Our inspection team consists of certified professionals with extensive experience in construction and engineering. All our inspectors hold relevant certifications such as Certified Building Inspector (CBI), ICC certifications, and have backgrounds in civil engineering, architecture, or construction management. Additionally, they receive ongoing training to stay current with the latest building codes, regulations, and inspection techniques.",
                },
                {
                  question: "What documentation will I receive after an inspection?",
                  answer:
                    "Following each inspection, you will receive a comprehensive report that includes detailed observations, photographs documenting site conditions, identification of any issues or deficiencies, recommendations for corrective actions, and compliance status with project specifications and building codes. These reports are typically delivered within 24-48 hours of the inspection and are accessible through our secure client portal.",
                },
                {
                  question: "Can you handle inspections for specialized construction projects?",
                  answer:
                    "Yes, we have expertise in conducting inspections for a wide range of specialized construction projects, including high-rise buildings, industrial facilities, healthcare institutions, and infrastructure projects. Our team includes specialists in various construction disciplines who can address the unique requirements and compliance standards of specialized projects.",
                },
                {
                  question: "How do your inspections help prevent construction defects?",
                  answer:
                    "Our proactive inspection approach identifies potential issues before they become serious problems. By conducting thorough assessments at critical construction stages, we can detect workmanship deficiencies, material inadequacies, or deviations from design specifications early. This early detection allows for timely corrections, preventing costly rework and ensuring the final construction meets all quality standards and building codes.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700">
                  <AccordionTrigger className="text-left py-4 hover:text-[#5d9cec] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-[#1e2430]">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Inspection Case Studies</h2>
            <p className="text-gray-300">
              Learn how our inspection services have helped ensure quality and compliance in various projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "High-Rise Residential Tower",
                description:
                  "Regular quality inspections throughout the construction of a 30-story residential building, identifying and resolving over 120 potential issues.",
                image: "/assets/cad.jpg?height=400&width=600",
              },
              {
                title: "Commercial Complex",
                description:
                  "Comprehensive inspection services for a multi-building commercial development, ensuring compliance with complex regulatory requirements.",
                image: "/assets/cad.jpg?height=400&width=600",
              },
              {
                title: "Infrastructure Project",
                description:
                  "Specialized inspections for a major bridge construction, focusing on structural integrity and safety compliance.",
                image: "/assets/cad.jpg?height=400&width=600",
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2430] to-transparent opacity-70"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <Link href="#" className="text-[#5d9cec] flex items-center text-sm hover:underline">
                    Read Case Study <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#2a3142]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Benefits of Professional Site Inspection</h2>
              <div className="space-y-4">
                {[
                  "Ensures construction quality meets or exceeds industry standards and project specifications",
                  "Identifies potential issues early, preventing costly rework and project delays",
                  "Verifies compliance with building codes and regulations, avoiding legal complications",
                  "Provides documented evidence of construction quality for warranty and insurance purposes",
                  "Enhances project safety by identifying and addressing potential hazards",
                  "Improves communication between project stakeholders with detailed inspection reports",
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
              <div className="relative bg-[#1e2430] p-6 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Inspections Completed", value: "1,200+" },
                    { label: "Issues Identified & Resolved", value: "5,000+" },
                    { label: "Client Satisfaction", value: "99%" },
                    { label: "Years of Experience", value: "20+" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-[#2a3142] rounded-lg">
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
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Ensure Your Project's Quality?</h2>
            <p className="text-white/80 mb-8">
              Contact us today to schedule a site inspection or discuss your project's quality control needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#5d9cec] hover:bg-white/90">Schedule an Inspection</Button>
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
