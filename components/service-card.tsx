"use client"

import type React from "react"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import ServiceInfoDialog from "./service-info-dialog"

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
  features = [],
  showPopup = false,
}: ServiceCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLearnMore = (e: React.MouseEvent) => {
    if (showPopup) {
      e.preventDefault()
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col bg-[#2a3142] border-none text-white">
        <CardContent className="flex flex-col h-full pt-6">
          <div className="mb-4 text-[#5d9cec]">{icon}</div>
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <p className="text-gray-300 mb-auto">{description}</p>
          {showPopup ? (
            <button
              onClick={handleLearnMore}
              className="text-[#5d9cec] flex items-center mt-6 hover:underline group text-left"
            >
              Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <Link href={link} className="text-[#5d9cec] flex items-center mt-6 hover:underline group">
              Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </CardContent>
      </Card>

      {showPopup && (
        <ServiceInfoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title={title}
          description={description}
          features={features}
        />
      )}
    </>
  )
}

