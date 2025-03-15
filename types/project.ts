import type { Document } from "mongoose"

export interface IProject {
  _id: string
  title: string
  category: "Interior Design" | "3D Elevation" | "AutoCAD 2D Design" | "Site Inspection"
  type: string
  description: string
  image?: string
  isActive?: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProjectFormValues = Omit<IProject, "createdAt" | "updatedAt" | "_id" | "id" | "Document">
