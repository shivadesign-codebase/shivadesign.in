"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { GetSettingsActionResponse } from "@/app/Actions/get-settings"

interface HeroSectionProps {
  settings: GetSettingsActionResponse
}

const FALLBACK_VIDEO = "/videos/founder-message.mp4"

export default function HeroSection({ settings }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState(settings?.introVideoLink || FALLBACK_VIDEO)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleVideo = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden theme-bg pt-8">

      {/* Gradient Background */}
      <div className="absolute inset-0 theme-hero-bg opacity-90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT SIDE */}
        <div className="theme-text">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold leading-tight">
            Gift Yourself <br /> Your Dream.
          </h1>

          <h2 className="mt-4 text-xl md:text-2xl font-medium">
            You dream it, we build it.
          </h2>

          <p className="mt-6 text-lg max-w-lg leading-relaxed">
            From architectural planning to structural execution, we transform
            your vision into timeless spaces crafted with precision and passion.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="px-8 py-6 rounded-full theme-bg text-white hover:bg-gray-900 transition text-lg"
            >
              <Link href="/contact">
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE – PHONE */}
        <div className="flex justify-center">
          <div className="relative border-black bg-black border-14 rounded-[2.5rem] h-150 w-75 shadow-2xl">

            {/* Side Buttons */}
            <div className="h-8 w-0.75 bg-black absolute -left-4.25 top-18 rounded-l-lg"></div>
            <div className="h-11.5 w-0.75 bg-black absolute -left-4.25 top-31 rounded-l-lg"></div>
            <div className="h-11.5 w-0.75 bg-black absolute -left-4.25 top-44.5 rounded-l-lg"></div>
            <div className="h-16 w-0.75 bg-black absolute -right-4.25 top-35.5 rounded-r-lg"></div>

            {/* SCREEN */}
            <div className="relative rounded-4xl overflow-hidden w-68 h-143 bg-black">

              {/* VIDEO */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                preload="metadata"
                onError={() => {
                  if (videoSrc !== FALLBACK_VIDEO) {
                    setVideoSrc(FALLBACK_VIDEO)
                    setIsPlaying(false)
                  }
                }}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* Overlay Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={toggleVideo}
                  className="w-16 h-16 bg-white/80 backdrop-blur-md text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
