import { Schema, Document, model, models } from "mongoose"

export interface IBlog extends Document {
  title: string
  slug: string
  description: string
  content: string
  image?: string
  sourceProjectId?: string
  tags: string[]
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    sourceProjectId: {
      type: String,
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Blog = models.Blog || model<IBlog>("Blog", blogSchema)

export default Blog
