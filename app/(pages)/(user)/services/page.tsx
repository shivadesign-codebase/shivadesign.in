import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Metadata } from "next"
import { serviceBundle, services } from "./data/data"

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
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">

      <div className="relative isolate overflow-hidden rounded-3xl border border-orange-200/70 bg-linear-to-r from-amber-50 via-orange-50 to-rose-100 px-6 py-12 md:px-10">
        <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-orange-300/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl" aria-hidden />

        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-900/80">Authority & Trust</p>
          <h1 className="mt-4 text-4xl font-serif font-semibold leading-tight text-stone-900 md:text-5xl">
            Services Tailored for Your Vision
          </h1>

          <p className="mt-4 text-base leading-relaxed text-stone-700 md:text-lg">
            We don't just draw maps; we plan futures.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Compare Pricing
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white/85 px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              Get Your Design Now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2">

        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group block rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="relative overflow-hidden rounded-xl">

              <Image
                src={service.image}
                alt={service.keywords[0]}
                width={800}
                height={600}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 p-6 text-white">

                <h3 className="text-2xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm text-gray-200 max-w-sm">
                  {service.salesTagline}
                </p>

                <p className="mt-3 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900">
                  Starting at {service.startingPrice}
                </p>

                <div className="flex items-center mt-4 text-sm font-medium">
                  Open sales page
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

              </div>

            </div>

          </Link>
        ))}

      </div>

      <div className="mt-16 rounded-3xl border border-orange-200 bg-linear-to-r from-amber-100 via-orange-50 to-rose-100 p-6 md:p-8">
        <div className="flex items-center gap-2 text-orange-900">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Bundle Offer</p>
        </div>

        <h2 className="mt-3 text-3xl font-serif font-semibold text-stone-900">{serviceBundle.title}</h2>
        <p className="mt-2 text-stone-700">{serviceBundle.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-stone-500 line-through">{serviceBundle.originalPrice}</p>
          <p className="text-3xl font-semibold text-stone-900">{serviceBundle.discountedPrice}</p>
          <p className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-900">{serviceBundle.savings}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact?offer=launch-bundle"
            className="inline-flex items-center rounded-full bg-orange-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            Get Your Design Now
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full border border-orange-300 bg-white/85 px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
          >
            See Full Pricing
          </Link>
        </div>
      </div>

    </section>
  )
}
