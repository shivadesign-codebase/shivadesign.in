import { Schema, Document, model, models } from "mongoose"

export interface IClient extends Document {
  name: string
  mobile?: string | null
  email?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  company?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true,
    },
    mobile: {
      type: String,
      default: null,
      trim: true,
      maxlength: 24,
      index: true,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
      maxlength: 180,
      index: true,
    },
    addressLine1: {
      type: String,
      default: null,
      trim: true,
      maxlength: 240,
    },
    addressLine2: {
      type: String,
      default: null,
      trim: true,
      maxlength: 240,
    },
    city: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },
    state: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },
    postalCode: {
      type: String,
      default: null,
      trim: true,
      maxlength: 20,
    },
    company: {
      type: String,
      default: null,
      trim: true,
      maxlength: 180,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
)

const Client = models.Client || model<IClient>("Client", clientSchema)

export default Client
