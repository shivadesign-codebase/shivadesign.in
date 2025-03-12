import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  category: string
  description: string
  image: string
  link: string
  badgeColor?: "default" | "secondary" | "destructive" | "outline"
}

export default function ProjectCard({
  title,
  category,
  description,
  image,
  link,
  badgeColor = "default",
}: ProjectCardProps) {
  return (
    <div className="project-card rounded-lg overflow-hidden">
      <Link href={link}>
        <div className="relative aspect-[4/3]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute top-4 left-4">
            <Badge variant={badgeColor}>{category}</Badge>
          </div>
        </div>
        <div className="p-4 bg-card">
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="project-card-description">
          <p>{description}</p>
        </div>
      </Link>
    </div>
  )
}

