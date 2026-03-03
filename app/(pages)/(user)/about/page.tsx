import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title:
    "About ER. Harsh Verma | Shiva Design Associates | Civil Engineer | Maharajganj",
  description:
    "Learn about ER. Harsh Verma, Principal Engineer and Founder of Shiva Design Associates, Maharajganj.",
}

export default function AboutPage() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* PAGE HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-semibold text-gray-900">
            ER. Harsh Verma
          </h1>
          <p className="text-gray-600 mt-6 text-lg">
            Principal Engineer & Founder — Shiva Design Associates
          </p>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-3 gap-16">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">

              {/* Profile Image */}
              <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/assets/Harsh.jpg"
                  alt="Er. Harsh Verma"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  quality={85}
                />
              </div>

              {/* Contact Box */}
              <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>

                <div className="space-y-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    shivaconsultant97@gmail.com
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    +91 97940 86149
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    Available for Consultations
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    Maharajganj, Uttar Pradesh
                  </div>
                </div>

                <Button asChild className="w-full rounded-full mt-4">
                  <Link href="/contact">
                    Schedule Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-14">

            {/* Professional Background */}
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-900">
                Professional Background
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                ER. Harsh Verma brings over 6+ years of expertise in civil and
                structural engineering. He gained hands-on experience with
                leading construction firms before establishing Shiva Design
                Associates in 2019.
              </p>

              <p className="text-gray-600 leading-relaxed text-lg">
                His work spans residential, commercial, and infrastructure
                sectors, with a strong emphasis on structural precision,
                sustainability, and Vastu-compliant architecture.
              </p>
            </div>

            {/* Expertise */}
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-900">
                Areas of Expertise
              </h2>

              <div className="flex flex-wrap gap-3">
                {[
                  "Structural Design",
                  "Vastu Compliant Architecture",
                  "Earthquake Resistant Structures",
                  "Green Building Design",
                  "Construction Management",
                ].map((item, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-4 py-2 text-sm"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-900">
                Professional Philosophy
              </h2>

              <blockquote className="border-l-4 border-gray-900 pl-6 italic text-gray-700 text-lg leading-relaxed">
                Engineering is not merely about calculations and drawings.
                It is about designing structures that improve lives while
                respecting the environment. Every project should reflect
                both technical excellence and thoughtful purpose.
              </blockquote>
            </div>

            {/* Notable Projects */}
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-900">
                Notable Projects
              </h2>

              <div className="space-y-6 text-gray-700">
                <div className="border-b pb-4">
                  <h4 className="font-medium text-lg">
                    City Montessori School
                  </h4>
                  <p className="text-sm text-gray-500">Maharajganj</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium text-lg">
                    Pramila Homeo Clinic
                  </h4>
                  <p className="text-sm text-gray-500">Gorakhpur</p>
                </div>

                <div>
                  <h4 className="font-medium text-lg">
                    JN Hospital
                  </h4>
                  <p className="text-sm text-gray-500">Maharajganj</p>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="pt-10">
              <Button asChild className="rounded-full px-8 py-6">
                <Link
                  href="https://wa.me/919794086149"
                  target="_blank"
                >
                  Contact ER. Harsh Verma
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
