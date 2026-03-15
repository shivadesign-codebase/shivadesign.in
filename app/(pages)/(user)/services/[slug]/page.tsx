import Image from "next/image"
import Link from "next/link"
import { dynamicPageServices } from "../data/data"

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

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">

      <div className="grid md:grid-cols-2 gap-16 items-center">

        <div>

          <h1 className="text-4xl font-serif font-semibold">
            {service.title}
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          <Link
            href="/contact"
            className="inline-block mt-8 px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            Book Free Consultation
          </Link>

        </div>

        <div className="relative h-[420px] rounded-xl overflow-hidden">

          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />

        </div>

      </div>

      <div className="mt-24 max-w-3xl">

        <h2 className="text-2xl font-serif font-semibold">
          {service.sectionTitle}
        </h2>

        <p className="mt-6 text-muted-foreground leading-relaxed">
          {service.content}
        </p>

      </div>

      <div className="mt-24 max-w-3xl">

        <h2 className="text-2xl font-serif font-semibold">
          Frequently Asked Questions
        </h2>

        <div className="mt-16 space-y-6">
          {service.faqs.map((faq, i) => (
            <div key={i}>
              <h3 className="font-medium">{faq.q}</h3>
              <p className="text-muted-foreground mt-2">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}
