'use client';

import { useEffect, useRef } from "react"

const logos = [
  "Pramila Homeo Clinic",
  "City Montessori School",
  "JN Hospital"
]

function TrustedClientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    let scrollAmount = 0

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += 2
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0
        }
        scrollContainer.scrollLeft = scrollAmount
      }
    }

    const interval = setInterval(scroll, 10)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-16 text-center">
      <h3 className="text-xl font-semibold mb-8">Trusted by Leading Organizations</h3>
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-8 animate-scroll whitespace-nowrap"
          style={{ scrollBehavior: "smooth" }}
        >
          {[...logos, ...logos].map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-muted h-16 min-w-[200px] rounded text-muted-foreground font-semibold text-sm uppercase tracking-wide shadow-sm"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustedClientsSection;
