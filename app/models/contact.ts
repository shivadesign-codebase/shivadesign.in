import { Schema, Document, model, models } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  service?: string
  message: string
  consent: boolean
  status: "new" | "replied" | "closed"
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    service: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    consent: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Contact = models.Contact || model<IContact>("Contact", contactSchema)
export default Contact
