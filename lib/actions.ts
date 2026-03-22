"use server"

import { revalidatePath } from "next/cache"
import connect_db from "@/config/db"
import Contact from "@/app/models/contact"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  service: string
  message: string
  consent: boolean
}

export async function sendContactForm(data: ContactFormData) {
  const name = typeof data.name === "string" ? data.name.trim() : ""
  const email = typeof data.email === "string" ? data.email.trim() : ""
  const phone = typeof data.phone === "string" ? data.phone.trim() : ""
  const subject = typeof data.subject === "string" ? data.subject.trim() : ""
  const service = typeof data.service === "string" ? data.service.trim() : ""
  const message = typeof data.message === "string" ? data.message.trim() : ""

  if (!name || !email || !subject || !message || !data.consent) {
    throw new Error("Please fill all required enquiry fields and consent to proceed.")
  }

  await connect_db()

  await Contact.create({
    name,
    email,
    phone,
    subject,
    service,
    message,
    consent: true,
    status: "new",
    isRead: false,
  })

  revalidatePath("/admin/inquiries")
  return { success: true }
}

interface BannerData {
  title: string
  subtitle: string
  image: string
  isActive: boolean
}

export async function saveBanner(data: BannerData) {
  console.log("Banner data:", data)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/")
  return { success: true }
}

export async function saveDocument(formData: FormData) {
  const title = formData.get("title") as string
  const client = formData.get("client") as string
  const file = formData.get("file") as File
  const password = formData.get("password") as string

  console.log("Document data:", { title, client, file: file.name, password: password ? "Set" : "Not set" })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/admin/documents")
  return { success: true }
}

export async function sendBroadcastEmail(formData: FormData) {
  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const recipients = formData.get("recipients") as string

  console.log("Broadcast email:", { subject, content, recipients })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}
