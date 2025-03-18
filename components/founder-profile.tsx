"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Award, FileText, ArrowRight } from "lucide-react"

export default function FounderProfile() {
  const [isHovered, setIsHovered] = useState(false)

  const achievements = [
    "5+ Years of Experience",
    "75+ Projects Completed",
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Meet Our Principal Engineer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The driving force behind our engineering excellence and innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src="/assets/Harsh.jpg?height=400&width=400"
                  alt="ER. Harsh Verma"
                  fill
                  className="object-cover"
                />
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0.8,
                  opacity: isHovered ? 1 : 0,
                  rotate: isHovered ? 0 : -5,
                }}
                transition={{ duration: 0.3 }}
                className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
              >
                <span className="text-sm font-medium">Since 2019</span>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0.8,
                  opacity: isHovered ? 1 : 0,
                  rotate: isHovered ? 0 : 5,
                }}
                transition={{ duration: 0.3 }}
                className="absolute -top-4 -left-4 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg border border-border"
              >
                <Badge variant="secondary">Principal Engineer</Badge>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="lg:col-span-7"
          >
            <Card className="border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">ER. Harsh Verma</h3>
                    <p className="text-primary font-medium">Civil Engineering, ITM Maharajganj</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <Link href='mailto:shivaconsultant97@gmail.com' target="_blank">Contact</Link>

                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      <Link href='/contact'>Schedule</Link>
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  ER. Harsh Verma brings over two decades of expertise in civil and structural engineering. As the
                  founder of Shiva Design Associates, he has led numerous landmark projects across residential,
                  commercial, and infrastructure sectors. His innovative approach to engineering challenges and
                  commitment to sustainable design principles has established him as a respected authority in the field.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Expertise</h4>
                      <p className="text-sm text-muted-foreground">
                        Structural Design, Vastu Compliance, Project Management
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Publications</h4>
                      <p className="text-sm text-muted-foreground">12+ Research Papers on Structural Innovation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Direct Contact</h4>
                      <p className="text-sm text-muted-foreground">+91 979 408 6149</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3">Notable Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/30">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href="/about">
                      Full Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
