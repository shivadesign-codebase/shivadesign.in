import Link from "next/link"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import getSettingsAction from "@/app/Actions/get-settings"
import {
  canAccessPricingPageForVisitor,
  canShowPricingForVisitor,
} from "@/lib/pricing-visibility"
import { dynamicPageServices, serviceBundle } from "../services/data/data"

export const metadata: Metadata = {
  title: "Service Pricing | Shiva Design Associates",
  description:
    "Explore package pricing for AutoCAD drafting, 3D elevation, interiors, approvals, estimation, and Vastu consultation.",
}

export default async function PricingPage() {
  const settings = await getSettingsAction()
  const showPricing = canShowPricingForVisitor(settings)
  const canAccessPricingPage = canAccessPricingPageForVisitor(settings)

  if (!canAccessPricingPage) {
    redirect("/contact?topic=pricing")
  }

  const serviceEntries = Object.values(dynamicPageServices)

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
      <div className="rounded-3xl border border-stone-200 bg-linear-to-r from-stone-50 via-orange-50 to-amber-100 px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">Transparent Packages</p>
        <h1 className="mt-4 text-4xl font-serif font-semibold leading-tight text-stone-900 md:text-5xl">
          Pricing Plans That Fit Your Project Stage
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-700 md:text-lg">
          Pick individual service plans or choose our bundle for a faster start. Need a custom scope? We can tailor a plan after a quick call.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Get Your Design Now
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center rounded-full border border-stone-300 bg-white/90 px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
          >
            Explore Service Pages
          </Link>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-orange-200 bg-linear-to-r from-amber-100 via-orange-50 to-rose-100 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-900/90">Bundle Deal</p>
        <h2 className="mt-3 text-3xl font-serif font-semibold text-stone-900">{serviceBundle.title}</h2>
        <p className="mt-2 text-stone-700">{serviceBundle.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
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

        <Link
          href="/contact?offer=launch-bundle"
          className="mt-6 inline-flex rounded-full bg-orange-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"
        >
          {serviceBundle.ctaButtonLabel}
        </Link>
      </div>

      <div className="mt-14 space-y-10">
        {serviceEntries.map((service) => (
          <section key={service.slug} className="rounded-2xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-stone-900">{service.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">{service.pitch}</p>
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                View Sales Page
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {service.pricing.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{plan.name}</p>
                  {showPricing ? (
                    <p className="mt-2 text-2xl font-semibold text-stone-900">{plan.price}</p>
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-stone-900">Contact us for pricing details</p>
                  )}
                  <p className="mt-1 text-sm text-stone-600">{plan.timeline}</p>
                  <p className="mt-3 text-sm text-stone-700">Best for: {plan.bestFor}</p>

                  <ul className="mt-3 space-y-2 text-sm text-stone-600">
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
          </section>
        ))}
      </div>
    </section>
  )
}
