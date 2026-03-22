"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Marquee from "react-fast-marquee"

export default function Navbar({ marqueeText }: { marqueeText?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  useEffect(() => {
    if (isAdminRoute) {
      setIsScrolled(false)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isAdminRoute])

  // Don't render navbar on admin routes
  if (isAdminRoute) {
    return null
  }

  const isNotHomePage = pathname !== "/"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isNotHomePage
        ? "bg-white/60 backdrop-blur-lg shadow-sm"
        : "bg-transparent"
        }`}
    >
      {!isScrolled && marqueeText && (
        <div className="bg-neutral-800">
          <Marquee speed={50} pauseOnHover>
            <p className="text-yellow-500 font-medium tracking-widest">
              {marqueeText}
            </p>
          </Marquee>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`text-xl md:text-2xl font-semibold font-serif tracking-wide ${isScrolled || isNotHomePage
              ? "theme-bg bg-clip-text theme-text"
              : "theme-text"
              }`}
          >
            Shiva Design Associates
          </span>
        </Link>

        {/* CTA */}
        <Button
          asChild
          className="hidden theme-bg md:flex rounded-full px-6 py-5 text-sm font-medium text-white hover:opacity-90 transition shadow-md"
        >
          <Link href="/contact">
            Book Consultation
          </Link>
        </Button>
      </div>
    </header>
  )
}
