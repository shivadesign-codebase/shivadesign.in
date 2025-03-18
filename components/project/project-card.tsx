"use client"

import type React from "react"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  category: string
  description: string
  image: string
  link: string
  badgeColor?: "default" | "secondary" | "destructive" | "outline"
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function ProjectCard({
  title,
  category,
  description,
  image,
  link,
  badgeColor = "default",
  onClick,
}: ProjectCardProps) {
  return (
    <div
      className="project-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={badgeColor}>{category}</Badge>
        </div>
      </div>
      <div className="p-4 bg-card">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
