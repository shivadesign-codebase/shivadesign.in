"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface ScrollAnimationsProps {
  children: React.ReactNode
  className?: string
}

export default function ScrollAnimations({ children, className = "" }: ScrollAnimationsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  )
}

