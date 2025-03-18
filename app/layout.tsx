import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shiva Design Associates | Civil, Interior & 2D Drawing Services in Maharajganj",
  description: "Shiva Design Associates in Maharajganj specializes in civil engineering, interior design, architectural planning, 2D drawings, construction consulting, and project management. Delivering quality and customized design solutions for residential, commercial, and industrial projects.",
  icons: 'favicon.ico',
  keywords: 'Shiva Design Associates, Civil Engineering, Interior Design, 2D Drawings, Architectural Planning, Construction Consulting, Project Management, Maharajganj, Uttar Pradesh, India',
  openGraph: {
    title: "Shiva Design Associates | Civil, Interior & 2D Drawing Services in Maharajganj",
    description: "Shiva Design Associates in Maharajganj specializes in civil engineering, interior design, architectural planning, 2D drawings, construction consulting, and project management. Delivering quality and customized design solutions for residential, commercial, and industrial projects.",
    images: "/assets/og-image.png",
    url: "https://shivadesignassociates.com",
    type: "website",
    siteName: "Shiva Design Associates",
    countryName: "India",
    emails: 'shivaconsultant98@gmail.com',
    phoneNumbers: '+91 979 408 6149',
  },
  twitter: {
    card: "summary_large_image",
    site: "@shivadesignassociates",
    creator: "@shivadesignassociates",
    images: "/assets/og-image.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

