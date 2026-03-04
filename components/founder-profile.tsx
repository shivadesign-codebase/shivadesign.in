"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"

export default function FounderProfile() {
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900">
            Meet Our Principal Engineer
          </h2>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
            Leadership driven by precision, innovation, and technical excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — IMAGE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative flex justify-center"
          >
            <div className="relative w-[320px] h-[420px] md:w-[380px] md:h-[480px] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/assets/Harsh.jpg"
                alt="Er. Harsh Verma"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                quality={80}
              />
            </div>
          </motion.div>

          {/* RIGHT — CONTENT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h3 className="text-3xl font-semibold text-gray-900">
              Er. Harsh Verma
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Civil Engineer & Founder
            </p>

            <div className="w-16 h-0.5 bg-gray-900 mt-6 mb-8" />

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              With over 6+ years of experience in civil and structural engineering,
              Harsh Verma has successfully delivered residential, commercial,
              and infrastructure projects with uncompromising precision.
              His approach combines technical expertise with aesthetic
              understanding to create structures that endure and inspire.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-2xl font-semibold text-gray-900">75+</h4>
                <p className="text-gray-500">Projects Completed</p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-gray-900">6+</h4>
                <p className="text-gray-500">Years of Experience</p>
              </div>
            </div>

            {/* Contact Row */}
            <div className="flex flex-wrap gap-6 items-center mb-10 text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 97940 86149</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:shivaconsultant97@gmail.com" className="hover:underline">
                  shivaconsultant97@gmail.com
                </a>
              </div>
            </div>

            {/* CTA */}
            <Button asChild className="rounded-full px-8 py-6">
              <Link href="/about">
                View Full Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
