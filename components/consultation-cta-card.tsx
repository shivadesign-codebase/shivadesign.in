"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneCall, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ConsultationCtaCardProps = {
  source: "home" | "blogs" | "blog-detail"
  pagePath: string
  displayMode?: "inline" | "popup"
  dismissible?: boolean
  className?: string
}

export default function ConsultationCtaCard({
  source,
  pagePath,
  displayMode = "inline",
  dismissible = false,
  className,
}: ConsultationCtaCardProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const isPopup = displayMode === "popup"

  if (!isVisible) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast("Missing name", { description: "Please enter your name before submitting." })
      return
    }

    if (!email.trim() && !phone.trim()) {
      toast("Contact required", {
        description: "Please enter either your email or mobile number.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source,
          pagePath,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || "Failed to submit")
      }

      toast("Request submitted", {
        description: "Thanks! Our team will reach out to you shortly.",
      })
      setName("")
      setEmail("")
      setPhone("")
    } catch (error: any) {
      toast("Submission failed", {
        description: error?.message || "Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className={cn(
        isPopup
          ? "fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 sm:w-[min(92vw,42rem)]"
          : "relative w-full pt-8 sm:pt-10",
        className
      )}
    >
      <div className="pointer-events-none absolute left-6 top-0 h-8 w-px bg-neutral-400/70 sm:left-8 sm:h-10" aria-hidden />
      <div className="pointer-events-none absolute right-6 top-0 h-8 w-px bg-neutral-400/70 sm:right-8 sm:h-10" aria-hidden />
      <div
        className="pointer-events-none absolute left-5.25 top-7.5 h-3 w-3 rounded-full border border-neutral-500/70 bg-neutral-100 sm:left-7.25 sm:top-9.5 sm:h-3.5 sm:w-3.5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-5.25 top-7.5 h-3 w-3 rounded-full border border-neutral-500/70 bg-neutral-100 sm:right-7.25 sm:top-9.5 sm:h-3.5 sm:w-3.5"
        aria-hidden
      />

      <div className="relative rounded-2xl border border-neutral-300 bg-neutral-200/95 p-4 shadow-[0_14px_35px_-20px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
        {isPopup && dismissible && (
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Close consultation card"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white/90 text-neutral-700 transition hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="mb-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-600">Quick Consultation</p>
          <h3 className="text-xl font-semibold leading-tight text-neutral-900 sm:text-2xl">
            Talk to an architect before you start building.
          </h3>
          <p className="text-sm leading-relaxed text-neutral-700">
            Share your contact details and our team at Shiva Design Associates will reach out with the next best step.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link
            href="https://wa.me/919794086149?text=Hi%20Shiva%20Design%20Associates%2C%20I%20need%20a%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M20.52 3.48A11.81 11.81 0 0 0 12.07 0C5.56 0 .26 5.3.26 11.81c0 2.08.54 4.12 1.56 5.92L0 24l6.46-1.7a11.76 11.76 0 0 0 5.61 1.43h.01c6.51 0 11.81-5.3 11.82-11.82a11.8 11.8 0 0 0-3.38-8.43m-8.45 18.25h-.01a9.8 9.8 0 0 1-4.99-1.36l-.36-.21-3.84 1.01 1.03-3.75-.24-.39a9.8 9.8 0 0 1-1.5-5.21c0-5.41 4.4-9.81 9.82-9.81 2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 0 1 2.89 6.95c0 5.41-4.4 9.81-9.81 9.81m5.38-7.35c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.14-.19.29-.76.94-.93 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.45-.86-.77-1.43-1.72-1.6-2.01-.17-.29-.02-.44.13-.59.14-.14.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.17-.24-.58-.48-.5-.66-.51-.17-.01-.36-.01-.56-.01s-.51.07-.78.36c-.27.29-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.19 2.07 3.17 5.01 4.45.7.3 1.25.48 1.67.61.7.22 1.34.19 1.85.12.57-.08 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.27-.19-.56-.34" />
            </svg>
          </Link>

          <Button asChild variant="outline" className="justify-start gap-2 border-neutral-300 bg-white/80 text-neutral-900 hover:bg-white">
            <Link href="/contact">
              <PhoneCall className="h-4 w-4" />
              Contact Page
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cta-name" className="text-neutral-700">
              Name
            </Label>
            <Input
              id="cta-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="border-neutral-300 bg-white"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cta-email" className="text-neutral-700">
                Email (optional)
              </Label>
              <Input
                id="cta-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border-neutral-300 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cta-phone" className="text-neutral-700">
                Mobile (optional)
              </Label>
              <Input
                id="cta-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9XXXXXXXXX"
                className="border-neutral-300 bg-white"
              />
            </div>
          </div>

          <p className="text-xs text-neutral-600">At least one field (email or mobile) is required to submit.</p>

          <Button type="submit" className="w-full gap-2 bg-neutral-900 text-white hover:bg-neutral-800" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Get Consultation"}
          </Button>
        </form>
      </div>
    </section>
  )
}
