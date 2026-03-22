import mongoose, { Schema, Document } from "mongoose"

export interface IBanner extends Document {
  title?: string
  imageUrl: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: 180,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema)
