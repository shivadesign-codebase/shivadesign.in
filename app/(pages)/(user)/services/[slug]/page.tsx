import Image from "next/image"
import Link from "next/link"
import ProjectCard from "@/components/project-card"
import type { IProject } from "@/types/project"
import getProjectsAction from "@/app/Actions/get-paginated-projects"
import getSettingsAction from "@/app/Actions/get-settings"
import {
  canAccessPricingPageForVisitor,
  canShowPricingForVisitor,
} from "@/lib/pricing-visibility"
import { dynamicPageServices, serviceBundle } from "../data/data"

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ServicePageProps) {
  const { slug } = await params
  const service = dynamicPageServices[slug]

  if (!service) {
    return {
      title: "Service | Shiva Design Associates",
    }
  }

  return {
    title: `${service.title} in Maharajganj | Shiva Design Associates`,
    description: service.description,
    keywords: service.keywords,
  }
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params
  const service = dynamicPageServices[slug]

  if (!service) {
    return <div>Service not found</div>
  }

  const selectedSamplesResponse = await getProjectsAction({
    sampleServiceSlug: slug,
    limit: 4,
    page: 1,
  })

  const selectedSamples = (() => {
    const parsed = JSON.parse(selectedSamplesResponse)
    if (!Array.isArray(parsed)) return [] as IProject[]
    return parsed as IProject[]
  })()

  const categorySampleResponses = await Promise.all(
    service.sampleCategories.map((category) =>
      getProjectsAction({ category, limit: 2, page: 1 })
    )
  )

  const categoryFallbackSamples = categorySampleResponses
    .flatMap((response) => {
      const parsed = JSON.parse(response)
      return Array.isArray(parsed) ? parsed : []
    }) as IProject[]

  const samples = [...selectedSamples, ...categoryFallbackSamples]
    .reduce<IProject[]>((acc, project) => {
      if (!acc.some((item) => item._id === project._id)) {
        acc.push(project)
      }
      return acc
    }, [])
    .slice(0, 4)

  const settings = await getSettingsAction()
  const showPricing = canShowPricingForVisitor(settings)
  const canAccessPricingPage = canAccessPricingPageForVisitor(settings)

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">

      <div className="relative isolate overflow-hidden rounded-3xl border border-orange-200/70 bg-linear-to-br from-amber-50 via-orange-50 to-rose-100 px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl" aria-hidden />

        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-900/80">Mini Sales Page</p>
            <h1 className="mt-4 text-4xl font-serif font-semibold leading-tight text-stone-900 md:text-5xl">
              {service.title}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-stone-700 md:text-lg">
              {service.description}
            </p>

            <p className="mt-4 text-base font-medium leading-relaxed text-stone-800">
              {service.pitch}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/contact?service=${service.slug}`}
                className="inline-flex items-center rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                {service.ctaButtonLabel}
              </Link>
              {canAccessPricingPage ? (
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white/80 px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
                >
                  View All Pricing
                </Link>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center rounded-full border border-stone-200 bg-white/60 px-7 py-3 text-sm font-semibold text-stone-500">
                  View All Pricing
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {service.outcomes.map((outcome) => (
                <div key={outcome} className="rounded-xl border border-stone-200/90 bg-white/80 p-3 text-sm text-stone-700">
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-75 overflow-hidden rounded-2xl border border-stone-300/70 md:h-105">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-serif font-semibold text-stone-900 md:text-3xl">
          Previous Project Samples
        </h2>
        <p className="mt-3 max-w-3xl text-stone-600">
          These samples are handpicked to reflect the quality and style of our work in this service category.
        </p>

        {samples.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {samples.map((project) => (
              <ProjectCard
                key={project._id}
                title={project.title}
                category={project.category}
                description={project.description}
                image={project.image || "/assets/cad.jpg"}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-stone-600">
            New curated samples for this category are being updated. Reach out and we will share relevant references.
          </div>
        )}
      </div>

      <div className="mt-16 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-serif font-semibold text-stone-900 md:text-3xl">Pricing That Fits Your Scope</h2>
        <p className="mt-3 text-stone-600">Choose the package that matches your timeline, complexity, and budget.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {service.pricing.map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">{plan.name}</p>
              {showPricing ? (
                <p className="mt-2 text-2xl font-semibold text-stone-900">{plan.price}</p>
              ) : (
                <p className="mt-2 text-2xl font-semibold text-stone-900">Contact us for pricing details</p>
              )}
              <p className="mt-1 text-sm text-stone-600">{plan.timeline}</p>
              <p className="mt-3 text-sm font-medium text-stone-700">Best for: {plan.bestFor}</p>

              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>

              <Link
                href={`/contact?service=${service.slug}&plan=${encodeURIComponent(plan.name)}`}
                className="mt-5 inline-flex rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-stone-700"
              >
                Get Your Design Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-orange-200 bg-linear-to-r from-amber-100 via-orange-50 to-rose-100 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-900/80">Best Value Bundle</p>
        <h2 className="mt-3 text-2xl font-serif font-semibold text-stone-900 md:text-3xl">{serviceBundle.title}</h2>
        <p className="mt-2 text-sm text-stone-700">{serviceBundle.subtitle}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-4">
          {showPricing ? (
            <>
              <p className="text-sm text-stone-500 line-through">{serviceBundle.originalPrice}</p>
              <p className="text-3xl font-semibold text-stone-900">{serviceBundle.discountedPrice}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-stone-500 blur-[2px] select-none">{serviceBundle.originalPrice}</p>
              <p className="text-3xl font-semibold text-stone-900">Contact us for pricing details</p>
            </>
          )}
          {showPricing ? (
            <p className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-900">{serviceBundle.savings}</p>
          ) : (
            <p className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-900 blur-[2px] select-none">{serviceBundle.savings}</p>
          )}
          <p className="text-sm text-stone-600">Timeline: {serviceBundle.timeline}</p>
        </div>

        <ul className="mt-5 grid gap-2 text-sm text-stone-700 md:grid-cols-2">
          {serviceBundle.includes.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact?offer=launch-bundle"
            className="inline-flex items-center rounded-full bg-orange-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            {serviceBundle.ctaButtonLabel}
          </Link>
          {canAccessPricingPage ? (
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full border border-orange-300 bg-white/80 px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              Compare Individual Plans
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center rounded-full border border-orange-200 bg-white/60 px-7 py-3 text-sm font-semibold text-stone-500">
              Compare Individual Plans
            </span>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-4xl">
        <h2 className="text-2xl font-serif font-semibold text-stone-900">{service.sectionTitle}</h2>
        <p className="mt-5 leading-relaxed text-stone-600">{service.content}</p>
      </div>

      <div className="mt-16 rounded-2xl border border-stone-200 bg-stone-50 p-6 md:p-8">
        <h2 className="text-2xl font-serif font-semibold text-stone-900">{service.ctaHeadline}</h2>
        <p className="mt-3 max-w-3xl text-stone-600">{service.ctaDescription}</p>

        <Link
          href={`/contact?service=${service.slug}`}
          className="mt-6 inline-flex rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Get Your Design Now
        </Link>
      </div>

      <div className="mt-16 max-w-3xl">

        <h2 className="text-2xl font-serif font-semibold text-stone-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-8 space-y-6">
          {service.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="font-medium text-stone-900">{faq.q}</h3>
              <p className="mt-2 text-stone-600">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}
