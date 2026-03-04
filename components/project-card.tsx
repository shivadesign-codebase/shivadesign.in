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

  const imageUrl = image.split("/upload/").join("/upload/f_auto,q_auto,w_500/")

  return (
    <div className="group rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* Image */}
      <div
        className="relative h-56 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

        {/* badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={badgeColor}>{category}</Badge>
        </div>
      </div>

      {/* content */}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </div>

    </div>
  )
}
