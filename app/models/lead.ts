import { Schema, Document, model, models } from "mongoose"

export interface ILead extends Document {
  name: string
  email?: string
  phone?: string
  source: "home" | "blogs" | "blog-detail"
  pagePath?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
      maxlength: 30,
    },
    source: {
      type: String,
      enum: ["home", "blogs", "blog-detail"],
      required: true,
      default: "home",
    },
    pagePath: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

leadSchema.pre("validate", function (next) {
  const hasEmail = Boolean(this.email && this.email.trim())
  const hasPhone = Boolean(this.phone && this.phone.trim())

  if (!hasEmail && !hasPhone) {
    this.invalidate("email", "Either email or mobile number is required")
    this.invalidate("phone", "Either email or mobile number is required")
  }

  next()
})

const Lead = models.Lead || model<ILead>("Lead", leadSchema)

export default Lead
