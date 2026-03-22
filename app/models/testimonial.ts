import { Schema, Document, model, models } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  designation?: string; // Optional
  message: string;
  rating: number;
  isPublic: boolean;
  date: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Testimonial = models.Testimonial || model<ITestimonial>("Testimonial", testimonialSchema);
export default Testimonial;
