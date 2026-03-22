import connect_db from "@/config/db"
import Banner from "@/app/models/banner"

export const getActiveBanner = async (): Promise<string> => {
  try {
    await connect_db()

    const banner = await Banner.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean()
    if (!banner) return ""

    const imageUrl = (banner as any).imageUrl || (banner as any).link || ""
    return typeof imageUrl === "string" ? imageUrl : ""
  } catch (error) {
    console.error("Error fetching active banner:", error)
    return ""
  }
}
