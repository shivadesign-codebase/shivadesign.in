import { Schema, Document, model, models } from "mongoose"

export interface ISharedDocument extends Document {
  title: string
  clientName: string
  accessKey: string
  fileName: string
  mimeType: string
  fileSize: number
  cloudinaryPublicId: string
  cloudinaryResourceType: "image" | "raw" | "video"
  accessPasswordHash: string
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
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
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
