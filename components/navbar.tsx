"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"

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

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Shiva Design Associates</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${isActive("/") ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors ${isActive("/services") ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
          >
            Services
          </Link>
          <Link
            href="/documents"
            className={`text-sm font-medium transition-colors ${isActive("/documents") ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
          >
            Documents
          </Link>
          <Link
            href="/testimonials"
            className={`text-sm font-medium transition-colors ${isActive("/testimonials") ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
          >
            Testimonials
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="default" size="sm" className="hidden md:flex">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

