"use client"

import type React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { memo } from "react"

interface ProjectCardProps {
  title: string
  category: string
  description: string
  image: string
  link: string
  badgeColor?: "default" | "secondary" | "destructive" | "outline"
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

function ProjectCard({
  title,
  category,
  description,
  image,
  badgeColor = "default",
  onClick,
}: ProjectCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          quality={70}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
        />

        <div className="absolute top-4 left-4">
          <Badge variant={badgeColor}>{category}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )
}

export default memo(ProjectCard)
