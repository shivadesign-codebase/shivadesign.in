"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Star, Send, CheckCircle, Building2, Ruler, Hammer, Truck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface FeedbackFormValues {
  name: string
  email: string
  phone?: string
  rating: number
  message: string
  projectType: string
}

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FeedbackFormValues>()

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true)

    // Include the rating in the form data
    data.rating = rating

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log("Feedback submitted:", data)

      setIsSubmitted(true)
      toast("Feedback Submitted", {
        description: "Thank you for your valuable feedback!",
      })
      reset()
      setRating(0)
    } catch (error) {
      toast("Error", {
        description: "There was a problem submitting your feedback. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const projectTypes = [
    "Residential Construction",
    "Commercial Building",
    "Interior Design",
    "Renovation",
    "Architectural Design",
    "Structural Engineering",
    "Other"
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "GreenSpace Developers",
      rating: 5,
      message: "Working with Shiva Consultant transformed our project. Their attention to detail and innovative solutions saved us both time and money."
    },
    {
      name: "Priya Sharma",
      company: "Horizon Homes",
      rating: 5,
      message: "The 3D elevation designs were exceptional and helped us market our properties effectively. The final construction matched the renderings perfectly."
    }
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold mb-4">Your Feedback Matters</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to excellence in every project. Share your experience and help us serve you better.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {!isSubmitted ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="border-primary/10 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Share Your Experience</h2>
                    <p className="text-muted-foreground">
                      Your honest feedback helps us improve our services and deliver better results.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="rating" className="text-base">
                        How would you rate your experience with us?
                      </Label>
                      <div
                        className="flex items-center gap-1 mt-2"
                        onMouseLeave={handleRatingLeave}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingClick(value)}
                            onMouseEnter={() => handleRatingHover(value)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${value <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                } transition-colors`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
                        </span>
                      </div>
                      {errors.rating && (
                        <p className="text-sm text-red-500">Please provide a rating</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          {...register("name", { required: "Name is required" })}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <select
                        id="projectType"
                        {...register("projectType", { required: "Please select a project type" })}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="text-sm text-red-500">{errors.projectType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Feedback</Label>
                      <Textarea
                        id="message"
                        {...register("message", {
                          required: "Feedback message is required",
                          minLength: {
                            value: 10,
                            message: "Please provide more detailed feedback"
                          }
                        })}
                        placeholder="Tell us about your experience working with us..."
                        rows={5}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" /> Submit Feedback
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex items-center justify-center h-full"
            >
              <Card className="border-primary/10 shadow-lg w-full">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your feedback has been submitted successfully. We appreciate your time and valuable input.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Submit Another Feedback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeIn}>
              <Card className="border-primary/10 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Why Your Feedback Matters</h2>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                    variants={staggerContainer}
                  >
                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Improve Our Services</h3>
                        <p className="text-sm text-muted-foreground">Your insights help us enhance our engineering solutions</p>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Ruler className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Measure Quality</h3>
                        <p className="text-sm text-muted-foreground">We use your feedback to maintain high standards</p>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Hammer className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Build Better Projects</h3>
                        <p className="text-sm text-muted-foreground">Your suggestions directly influence our approach</p>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Deliver Excellence</h3>
                        <p className="text-sm text-muted-foreground">We're committed to exceeding expectations</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border-primary/10 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">What Our Clients Say</h2>

                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <motion.div
                        key={index}
                        variants={fadeIn}
                        className="p-4 rounded-lg bg-secondary/20"
                      >
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm italic mb-2">"{testimonial.message}"</p>
                        <div className="text-sm font-medium">
                          {testimonial.name}, <span className="text-muted-foreground">{testimonial.company}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
