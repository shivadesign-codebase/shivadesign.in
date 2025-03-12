"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay muted loop playsInline>
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent"></div>

      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Shiva Design Associates</h1>
        <h2 className="text-2xl md:text-4xl font-medium mt-4 drop-shadow-md">Civil Engineering Services</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/services">Our Services</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
        
        {/* Scroll Button */}
        <button onClick={scrollToServices} className="mt-16 animate-bounce" aria-label="Scroll to services">
          <ChevronDown className="h-10 w-10 text-white drop-shadow-lg" />
        </button>
      </div>
    </div>
  )
}
