"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ScrollToSectionProps {
  targetId: string
  className?: string
}

export default function ScrollToSection({ targetId, className = "" }: ScrollToSectionProps) {
  const scrollToSection = () => {
    const section = document.getElementById(targetId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Button
      onClick={scrollToSection}
      variant="ghost"
      size="icon"
      className={`rounded-full ${className}`}
      aria-label={`Scroll to ${targetId}`}
    >
      <ChevronDown className="h-6 w-6" />
    </Button>
  )
}

