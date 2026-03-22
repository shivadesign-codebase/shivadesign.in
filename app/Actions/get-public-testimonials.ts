'use server'

import connect_db from "@/config/db"
import Testimonial from "@/app/models/testimonial"

export type PublicTestimonial = {
  id: string
  name: string
  company: string
  avatar: string
  rating: number
  text: string
}

const DEFAULT_AVATAR = "/assets/cad.jpg?height=40&width=40"

// type GoogleReview = {
//   author_name?: string
//   profile_photo_url?: string
//   rating?: number
//   text?: string
// }

// type GooglePlaceDetailsResponse = {
//   result?: {
//     reviews?: GoogleReview[]
//   }
//   status?: string
//   error_message?: string
// }

async function getGoogleReviews(): Promise<PublicTestimonial[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return []

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "reviews",
    key: apiKey,
  })

  // const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`

  try {
  //   const response = await fetch(url, {
  //     method: "GET",
  //     cache: "no-store",
  //   })

  //   if (!response.ok) {
  //     console.error("Google reviews request failed:", response.status)
  //     return []
  //   }

  //   const data: GooglePlaceDetailsResponse = await response.json()
  //   if (data.status !== "OK" || !data.result?.reviews) {
  //     if (data.status && data.status !== "ZERO_RESULTS") {
  //       console.error("Google reviews API status:", data.status, data.error_message || "")
  //     }
  //     return []
  //   }

  //   return data.result.reviews
  //     .filter((review) => Boolean(review.author_name) && Boolean(review.text))
  //     .map((review, index) => ({
  //       id: `google-${index}-${review.author_name}`,
  //       name: review.author_name || "Google User",
  //       company: "Google Review",
  //       avatar: review.profile_photo_url || DEFAULT_AVATAR,
  //       rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
  //       text: review.text || "",
  //     }))
  return []
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error)
    return []
  }
}

const getPublicTestimonialsAction = async (): Promise<PublicTestimonial[]> => {
  try {
    await connect_db()

    const [dbTestimonials, googleTestimonials] = await Promise.all([
      Testimonial.find({ isPublic: { $ne: false } }).sort({ createdAt: -1 }).lean(),
      getGoogleReviews(),
    ])

    const mappedDbTestimonials: PublicTestimonial[] = dbTestimonials.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      company: item.designation || "Client",
      avatar: DEFAULT_AVATAR,
      rating: item.rating,
      text: item.message,
    }))

    return [...mappedDbTestimonials, ...googleTestimonials]
  } catch (error) {
    console.error("Error in getPublicTestimonialsAction:", error)
    return []
  }
}

export default getPublicTestimonialsAction
