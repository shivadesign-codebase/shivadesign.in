"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Star } from "lucide-react"
import { toast } from "sonner"

type Testimonial = {
  _id: string
  name: string
  designation?: string
  message: string
  rating: number
  isPublic?: boolean
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to fetch testimonials")
      setTestimonials(data.testimonials ?? [])
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not load testimonials." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const filteredTestimonials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return testimonials

    return testimonials.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        (item.designation || "").toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query)
      )
    })
  }, [testimonials, searchTerm])

  const togglePublicStatus = async (testimonial: Testimonial) => {
    setUpdatingId(testimonial._id)
    const currentlyPublic = testimonial.isPublic !== false
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testimonial._id, isPublic: !currentlyPublic }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update testimonial")

      setTestimonials((prev) =>
        prev.map((item) => (item._id === testimonial._id ? { ...item, isPublic: !currentlyPublic } : item))
      )

      toast("Updated", { description: `Testimonial set as ${!currentlyPublic ? "public" : "private"}.` })
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not update testimonial." })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground">Control which testimonials appear publicly on the website.</p>
      </div>

      <Input
        placeholder="Search by name, designation or message..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-lg"
      />

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading testimonials...</p>
          ) : filteredTestimonials.length === 0 ? (
            <p className="text-sm text-muted-foreground">No testimonials found.</p>
          ) : (
            <div className="space-y-3">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial._id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <Badge variant={testimonial.isPublic !== false ? "default" : "secondary"}>
                          {testimonial.isPublic !== false ? "Public" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.designation || "Client"}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${index < testimonial.rating ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{testimonial.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(testimonial.createdAt).toLocaleString("en-IN")}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">List Publicly</span>
                      <Switch
                        checked={testimonial.isPublic !== false}
                        disabled={updatingId === testimonial._id}
                        onCheckedChange={() => togglePublicStatus(testimonial)}
                        aria-label={`Toggle visibility for testimonial by ${testimonial.name}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
