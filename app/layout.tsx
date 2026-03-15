import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import getSettingsAction from "./Actions/get-settings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shiva Design Associates | Civil, Interior & 2D Drawing Services in Maharajganj",
  description: "Shiva Design Associates in Maharajganj specializes in civil engineering, interior design, architectural planning, 2D drawings, construction consulting, and project management. Delivering quality and customized design solutions for residential, commercial, and industrial projects.",
  icons: 'favicon.ico',
  keywords: 'Shiva Design Associates, Civil Engineering, Interior Design, 2D Drawings, Architectural Planning, Construction Consulting, Project Management, Maharajganj, Uttar Pradesh, India',
  metadataBase: new URL("https://shivadesign.in"),
  openGraph: {
    title: "Shiva Design Associates | Civil, Interior & 2D Drawing Services in Maharajganj",
    description: "Shiva Design Associates in Maharajganj specializes in civil engineering, interior design, architectural planning, 2D drawings, construction consulting, and project management. Delivering quality and customized design solutions for residential, commercial, and industrial projects.",
    images: "/assets/og-image.png",
    url: "https://shivadesign.in",
    type: "website",
    siteName: "Shiva Design Associates",
    countryName: "India",
    emails: 'shivaconsultant98@gmail.com',
    phoneNumbers: '+91 9794086149',
  },
  twitter: {
    card: "summary_large_image",
    site: "@shivadesignassociates",
    creator: "@shivadesignassociates",
    images: "/assets/og-image.png",
  },
}

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettingsAction();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="default"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar marqueeText={settings.marqueeText} />
          <main className="pt-8">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4HCBJB8NP1"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4HCBJB8NP1');
          `}
      </Script>

      {/* Iubenda Configuration */}
      <Script id="iubenda-config" strategy="afterInteractive">
        {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "siteId":4461535,
              "cookiePolicyId":95440982,
              "lang":"en",
              "storage":{"useSiteId":true}
            };
          `}
      </Script>

      {/* Iubenda Scripts */}
      <Script
        src="https://cs.iubenda.com/autoblocking/4461535.js"
        strategy="afterInteractive"
      />

      <Script
        src="https://cdn.iubenda.com/cs/gpp/stub.js"
        strategy="afterInteractive"
      />

      <Script
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="afterInteractive"
      />
    </html>
  )
}
