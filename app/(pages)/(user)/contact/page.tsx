import ContactForm from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ScrollAnimations from "@/components/scroll-animations"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden py-10 sm:py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.12),transparent_42%)]" />
      <div className="container relative px-4 md:px-6">
        <ScrollAnimations className="mb-8 sm:mb-10 md:mb-12">
          <div className="rounded-2xl border bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8 md:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Shiva Design Associates</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Let&apos;s Plan Your Next Project</h1>
            <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
              Connect with our civil engineering team for planning, structural guidance, AutoCAD drafting, and on-site consultation. We respond quickly with practical next steps.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="tel:+919794086149"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Office
              </a>
              <Link
                href="https://wa.me/919794086149"
                target="_blank"
                className="inline-flex items-center rounded-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                WhatsApp Chat
              </Link>
            </div>
          </div>
        </ScrollAnimations>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <ScrollAnimations>
            <Card className="border-0 shadow-lg ring-1 ring-black/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </ScrollAnimations>

          <div className="space-y-6">
            <ScrollAnimations>
              <Card className="border-0 shadow-lg ring-1 ring-black/5">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Office Address</h3>
                      <address className="not-italic text-sm text-muted-foreground">
                        Ward No. 7 Shiv Nagar Maharajganj,
                        <br />
                        Uttar Pradesh 273303, India
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <p className="text-sm text-muted-foreground">Office: +91 979 408 6149</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="break-all text-sm text-muted-foreground">shivaconsultant97@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-sm text-muted-foreground">Daily: 10:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimations>

            <ScrollAnimations>
              <Card className="border-0 shadow-lg ring-1 ring-black/5">
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border bg-muted">
                    <iframe
                      title="Shiva Design Associates location"
                      className="h-64 w-full sm:h-75"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.6494003484286!2d83.56537427548963!3d27.135850776514836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996a9003152fe0f%3A0x7afc74d98f20c7f7!2sShiva%20Design%20Associates!5e0!3m2!1sen!2sin!4v1741847757097!5m2!1sen!2sin"
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimations>
          </div>
        </div>
      </div>
    </div>
  )
}

