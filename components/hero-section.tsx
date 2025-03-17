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
      {/* Background Video with Backdrop */}
      <div className="absolute inset-0 w-full h-full backdrop-blur-md">
        <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay for Darkening Effect */}
      <div className="absolute inset-0 bg-[#1F2937]/60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-[#1F2937]/40"></div>

      {/* Centered Content with Glassmorphism Effect */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Shiva Design Associates</h1>
        <h2 className="text-2xl md:text-4xl font-medium mt-4 drop-shadow-md">You Dream It, We Built It</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg">
            <p onClick={scrollToServices} className="cursor-pointer">Our Services</p>
          </Button>
          <Button asChild variant="outline" size="lg" className="hover:bg-white text-primary">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Scroll Button */}
        <button onClick={scrollToServices} className="mt-16 animate-bounce cursor-pointer" aria-label="Scroll to services">
          <ChevronDown className="h-10 w-10 text-white drop-shadow-lg" />
        </button>
      </div>
    </div>
  )
}
