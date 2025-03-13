import type { ReactNode } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  link: string
  features?: string[]
}

export default function ServiceCard({ title, description, icon, link, features = [] }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col bg-[#2a3142] border-none text-white">
      <CardContent className="flex flex-col h-full pt-6">
        <div className="mb-4 text-[#5d9cec]">{icon}</div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-300 mb-auto">{description}</p>
        <Link href={link} className="text-[#5d9cec] flex items-center mt-6 hover:underline group">
          Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}
