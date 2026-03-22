"use client"

import { useState } from "react"
import { Star, Send, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FormState = {
  name: string
  designation: string
  message: string
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [form, setForm] = useState<FormState>({
    name: "",
    designation: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const selectedStars = hoveredRating || rating

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast("Missing name", { description: "Please enter your name." })
      return
    }

    if (rating < 1 || rating > 5) {
      toast("Missing rating", { description: "Please select a star rating." })
      return
    }

    if (!form.message.trim()) {
      toast("Missing feedback", { description: "Please write your feedback." })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          designation: form.designation.trim(),
          message: form.message.trim(),
          rating,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || "Submission failed")

      setIsSubmitted(true)
      setForm({ name: "", designation: "", message: "" })
      setRating(0)

      toast("Feedback submitted", {
        description: "Thanks! Your testimonial will be reviewed by our team.",
      })
    } catch (error: any) {
      toast("Submission failed", {
        description: error?.message || "Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-muted/20 py-16 md:py-24">
      <div className="container mx-auto max-w-2xl px-4 md:px-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Rate Your Experience</CardTitle>
            <p className="text-sm text-muted-foreground">
              Share your rating and feedback. Your testimonial will be shown publicly only after admin approval.
            </p>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Thank you for your feedback</h2>
                <p className="mt-2 text-sm text-green-700">
                  We appreciate your time. Your testimonial has been submitted for review.
                </p>
                <Button className="mt-5" variant="outline" onClick={() => setIsSubmitted(false)}>
                  Submit Another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-base">Your Rating</Label>
                  <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            value <= selectedStars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating ? `${rating} / 5` : "Select rating"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Your Designation (optional)</Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={(e) => setForm((prev) => ({ ...prev, designation: e.target.value }))}
                    placeholder="Home Owner, Builder, Architect..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your experience"
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Rating"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
