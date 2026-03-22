import { services } from "@/app/(pages)/(user)/services/data/data";
import ServiceCard from "@/components/service-card";

export default function ServicesSection() {
  return (
    <section id="services" className="py-4 lg:py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="theme-text text-4xl md:text-5xl font-serif font-semibold">
            Our Engineering Services
          </h2>

          <p className="theme-text max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Comprehensive architectural and civil engineering solutions crafted
            with precision, innovation, and uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.description}
                icon={<Icon className="h-6 w-6" />}
                link={`/services/${service.slug}`}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
};
