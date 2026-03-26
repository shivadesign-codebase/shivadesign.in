import { Schema, Document, model, models } from "mongoose"

export interface ISharedDocument extends Document {
  title: string
  clientId?: Schema.Types.ObjectId | null
  clientName: string
  clientMobile?: string | null
  clientEmail?: string | null
  accessKey: string
  fileName: string
  mimeType: string
  fileSize: number
  cloudinaryPublicId: string
  cloudinaryResourceType: "image" | "raw" | "video"
  accessPasswordHash: string
  accessPasswordEncrypted?: string | null
  expiresAt: Date | null
  allowDownload: boolean
  isClientAccessRevoked: boolean
  createdAt: Date
  updatedAt: Date
}

const sharedDocumentSchema = new Schema<ISharedDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      default: null,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    clientMobile: {
      type: String,
      default: null,
      trim: true,
      maxlength: 24,
    },
    clientEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
      maxlength: 180,
      index: true,
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 260,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryResourceType: {
      type: String,
      enum: ["image", "raw", "video"],
      required: true,
      default: "raw",
    },
    accessPasswordHash: {
      type: String,
      required: true,
    },
    accessPasswordEncrypted: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    allowDownload: {
      type: Boolean,
      default: false,
    },
    isClientAccessRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const SharedDocument = models.SharedDocument || model<ISharedDocument>("SharedDocument", sharedDocumentSchema)

export default SharedDocument
