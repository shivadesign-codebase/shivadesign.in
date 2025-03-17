import { Schema, Document, model, models } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: "Interior Design" | "3D Elevation" | "AutoCAD 2D Design" | "Site Inspection";
  type: string;
  description: string;
  image?: string;
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
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", projectSchema);

export default Project;
