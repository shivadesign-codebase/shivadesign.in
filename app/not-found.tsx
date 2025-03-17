"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HardHat, Ruler, Hammer, Truck, Home, ArrowLeft, Construction } from "lucide-react"

export default function NotFound() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const constructionItems = [
    { icon: <HardHat className="h-6 w-6" />, label: "Safety First" },
    { icon: <Ruler className="h-6 w-6" />, label: "Measuring" },
    { icon: <Hammer className="h-6 w-6" />, label: "Building" },
    { icon: <Truck className="h-6 w-6" />, label: "Materials" },
    { icon: <Construction className="h-6 w-6" />, label: "Construction" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4">
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Construction className="h-24 w-24 text-primary" />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute top-0 right-0"
              >
                <Hammer className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Under Construction</h1>
          <p className="text-xl text-muted-foreground mb-6">
            We're working hard to build this page. Please check back soon!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            {constructionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                className="flex flex-col items-center bg-card p-4 rounded-lg shadow-md"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-2">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-full bg-secondary/20 rounded-full h-4 mb-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-primary h-full rounded-full"
            />
          </div>
          <p className="text-sm text-muted-foreground mb-8">Construction Progress: {progress}%</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="border-t border-border pt-6 mt-8 text-sm text-muted-foreground"
        >
          <p>
            Shiva Design Associates is working on this section. <br />
            For urgent inquiries, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  )
}
