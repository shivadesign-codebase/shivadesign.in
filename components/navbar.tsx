"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("light")
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isNotHomePage = pathname !== '/'

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}>
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-xl font-bold ${isScrolled || isNotHomePage ? "text-[#5d9cec]" : "text-white"}`}>Shiva Design Associates</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}

          <Button asChild variant="default" size="sm" className="hidden md:flex bg-[#1F2937]/70 text-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
