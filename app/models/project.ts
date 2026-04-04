import { Schema, Document, model, models } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: "Interior Design" | "3D Elevation" | "AutoCAD 2D Design" | "Site Inspection";
  type: string;
  description: string;
  image?: string;
  sampleServiceSlugs: string[];
  clientId: Schema.Types.ObjectId;
  clientName: string;
  clientMobile?: string | null;
  clientEmail?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      // enum: ["Residential", "Commercial", "Hospitality", "Medical", "Other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    sampleServiceSlugs: {
      type: [String],
      default: [],
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true,
    },
    clientMobile: {
      type: String,
      default: null,
      trim: true,
      maxlength: 24,
      index: true,
    },
    clientEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
      maxlength: 180,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", projectSchema);

export default Project;
