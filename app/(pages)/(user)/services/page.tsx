import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Metadata } from "next"
import { services } from "./data/data"

export const metadata: Metadata = {
  title: "Architecture & Interior Design Services in Maharajganj | Shiva Design Associates",
  description:
    "Explore professional architecture services including 3D elevation, AutoCAD drafting, interior design, and site inspection in Maharajganj, Uttar Pradesh.",
  keywords: [
    "architect in maharajganj",
    "architecture services maharajganj",
    "3d elevation design",
    "interior designer maharajganj",
    "house planning architect UP",
  ],
}

export default function ServicesPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      {/* Header */}
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold">
          Our Services
        </h1>

        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          From architectural planning to interior design and construction
          consultation, we provide comprehensive design services tailored
          to your project needs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">

        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group block"
          >

            <div className="relative overflow-hidden rounded-xl">

              {/* Image */}
              <Image
                src={service.image}
                alt={service.keywords[0]}
                width={800}
                height={600}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 p-6 text-white">

                <h3 className="text-2xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm text-gray-200 max-w-sm">
                  {service.description}
                </p>

                <div className="flex items-center mt-4 text-sm font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

              </div>

            </div>

          </Link>
        ))}

      </div>

      {/* CTA */}
      <div className="mt-24 text-center">

        <h2 className="text-3xl font-serif">
          Have a project in mind?
        </h2>

        <p className="mt-3 text-muted-foreground">
          Let us help bring your vision to life with thoughtful design.
        </p>

        <Link
          href="/contact"
          className="inline-block mt-6 px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          Book Consultation
        </Link>

      </div>

    </section>
  )
}
