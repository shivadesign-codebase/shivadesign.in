"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
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
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f3e3cf]">

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#f3e3cf] via-pink-200 to-purple-300 opacity-90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT SIDE */}
        <div className="text-black">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold leading-tight">
            Gift Yourself <br /> Your Dream.
          </h1>

          <h2 className="mt-4 text-xl md:text-2xl font-medium text-gray-800">
            We Design It. We Build It. You Live It.
          </h2>

          <p className="mt-6 text-lg text-gray-700 max-w-lg leading-relaxed">
            From architectural planning to structural execution, we transform
            your vision into timeless spaces crafted with precision and passion.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="px-8 py-6 rounded-full bg-black text-white hover:bg-gray-900 transition text-lg"
            >
              <Link href="/contact">
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE – PHONE */}
        <div className="flex justify-center">
          <div className="relative border-black bg-black border-14 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">

            {/* Side Buttons */}
            <div className="h-8 w-[3px] bg-black absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-black absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-black absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div className="h-16 w-[3px] bg-black absolute -right-[17px] top-[142px] rounded-r-lg"></div>

            {/* SCREEN */}
            <div className="relative rounded-4xl overflow-hidden w-[272px] h-[572px] bg-black">

              {/* VIDEO */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/videos/founder-message.mp4"
                onEnded={() => setIsPlaying(false)}
              />

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
