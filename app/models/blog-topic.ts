import { Schema, Document, model, models } from "mongoose"

export interface IBlogTopic extends Document {
  title: string
  description?: string
  thumbnail?: string
  isUsed: boolean
  usedAt?: Date
  blogId?: string
  createdAt: Date
  updatedAt: Date
}

const blogTopicSchema = new Schema<IBlogTopic>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    blogId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const BlogTopic = models.BlogTopic || model<IBlogTopic>("BlogTopic", blogTopicSchema)

export default BlogTopic
