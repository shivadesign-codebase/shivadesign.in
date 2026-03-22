"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number | string
  name: string
  company: string
  avatar: string
  rating: number
  text: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoScroll?: boolean
  interval?: number
}

export default function TestimonialCarousel({
  testimonials,
  autoScroll = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    if (testimonials.length === 0) return
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  const prevSlide = () => {
    if (testimonials.length === 0) return
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  useEffect(() => {
    if (autoScroll && testimonials.length > 0) {
      timerRef.current = setInterval(nextSlide, interval)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [autoScroll, interval, testimonials.length])

  const handleMouseEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleMouseLeave = () => {
    if (autoScroll && testimonials.length > 0) {
      timerRef.current = setInterval(nextSlide, interval)
    }
  }

  if (testimonials.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          No testimonials available yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="w-full shrink-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`w-2 h-2 rounded-full p-0 ${index === activeIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

