import { Schema, Document, model, models } from "mongoose"

export interface ITopicContentImage {
  url: string
  alt: string
  caption?: string
  order: number
}

export interface IBlogTopic extends Document {
  title: string
  description?: string
  thumbnail?: string
  contentImages?: ITopicContentImage[]
  queueOrder: number
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
    contentImages: {
      type: [
        {
          url: { type: String, required: true },
          alt: { type: String, required: true, trim: true, maxlength: 160 },
          caption: { type: String, default: "", trim: true, maxlength: 240 },
          order: { type: Number, required: true, min: 1, max: 5 },
        },
      ],
      default: [],
      validate: {
        validator: (images: ITopicContentImage[]) => images.length <= 5,
        message: "Maximum 5 content images are allowed",
      },
    },
    queueOrder: {
      type: Number,
      default: 0,
      index: true,
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
