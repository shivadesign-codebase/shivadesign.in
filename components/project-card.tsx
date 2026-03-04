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

  // add /f_auto,q_auto,w_500/, after upload/ to optimize the image for web
  const imageUrl = image.split("/upload/").join("/upload/f_auto,q_auto,w_500/")

  return (
    <div className="project-card rounded-lg overflow-hidden">
      <div
        className="relative aspect-4/3 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
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
