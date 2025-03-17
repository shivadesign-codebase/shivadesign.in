import mongoose, { Schema, Document } from "mongoose"

export interface IBanner extends Document {
  link: string
}

const BannerSchema: Schema = new Schema({
  link: {
    type: String,
    required: true,
  },
})

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
