"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  link: string
  features?: string[]
  showPopup?: boolean
}

export default function ServiceCard({
  title,
  description,
  icon,
  link,
}: ServiceCardProps) {

  return (
    <>
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

        {/* Subtle Holi Glow */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-pink-200/0 via-orange-100/0 to-purple-200/0 group-hover:from-pink-200/40 group-hover:to-purple-200/40 transition-all duration-500 -z-10" />

        {/* Icon */}
        <div className="mb-6 theme-text-normal group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-4 theme-text">
          {title}
        </h3>

        {/* Description */}
        <p className="theme-text-normal leading-relaxed">
          {description}
        </p>

        <Link
          href={link}
          className="mt-6 inline-flex items-center text-sm font-medium theme-text hover:text-purple-600 transition"
        >
          Learn More
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </>
  )
}
