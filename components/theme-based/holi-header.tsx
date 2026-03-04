"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isNotHomePage = pathname !== "/"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isNotHomePage
          ? "bg-white/60 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`text-xl md:text-2xl font-semibold font-serif tracking-wide ${isScrolled || isNotHomePage
                ? "bg-gray-700 bg-clip-text text-transparent"
                : "text-black"
              }`}
          >
            Shiva Design Associates
          </span>
        </Link>

        {/* CTA */}
        <Button
          asChild
          className="hidden md:flex rounded-full px-6 py-5 text-sm font-medium text-white hover:opacity-90 transition shadow-md"
        >
          <Link href="/contact">
            Book Consultation
          </Link>
        </Button>
      </div>
    </header>
  )
}
