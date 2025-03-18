import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  category: string
  description: string
  image?: string
  badgeColor?: "default" | "secondary" | "destructive" | "outline"
}

export default function ProjectCard({
  title,
  category,
  description,
  image = "/assets/cad.jpg",
  badgeColor = "default",
}: ProjectCardProps) {
  return (
    <div className="project-card rounded-lg overflow-hidden">
      <div
        className="relative aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
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
    </div>
  )
}
