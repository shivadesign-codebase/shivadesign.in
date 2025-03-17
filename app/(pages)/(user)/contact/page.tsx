import ContactForm from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ScrollAnimations from "@/components/scroll-animations"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <ScrollAnimations className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our expert civil engineering team for consultations, inquiries, or project discussions.
        </p>
      </ScrollAnimations>

      <div className="grid md:grid-cols-2 gap-8">
        <ScrollAnimations>
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </ScrollAnimations>

        <div className="space-y-6">
          <ScrollAnimations>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Office Address</h3>
                    <address className="not-italic text-muted-foreground">
                      Ward No. 7 Shiv Nagar Maharajganj,
                      <br />
                      Uttar Pradesh 273303, India
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">Office: +91 979 408 6149</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        Call Now
                      </button>
                      <Link href="https://wa.me/919794086149" target="_blank" className="px-3 py-1 bg-green-500 text-white rounded-md text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        WhatsApp
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">shivaconsultant97@gmail.com</p>
                    <p className="text-muted-foreground">support@shivaconsultant.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimations>

          <ScrollAnimations>
            <Card>
              <CardHeader>
                <CardTitle>Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <iframe
                    width="680"
                    height="450"
                    className="border-0 rounded-md"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.6494003484286!2d83.56537427548963!3d27.135850776514836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996a9003152fe0f%3A0x7afc74d98f20c7f7!2sShiva%20Design%20Associates!5e0!3m2!1sen!2sin!4v1741847757097!5m2!1sen!2sin">
                  </iframe>
                  {/* <p className="text-muted-foreground">
                    Interactive map with directions available when viewed on the actual website.
                  </p> */}
                </div>
              </CardContent>
            </Card>
          </ScrollAnimations>
        </div>
      </div>
    </div>
  )
}

