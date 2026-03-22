import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import {
  createDocumentAccessToken,
  getDocumentAccessCookieName,
  verifyDocumentPassword,
} from "@/lib/document-security"

export const runtime = "nodejs"

const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export async function POST(request: Request, { params }: { params: Promise<{ accessKey: string }> }) {
  try {
    const { accessKey } = await params
    const body = await request.json()
    const password = String(body?.password || "")

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    await connect_db()

    const doc = await SharedDocument.findOne({ accessKey })
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (doc.isClientAccessRevoked) {
      return NextResponse.json({ error: "Access to this document has been revoked" }, { status: 403 })
    }

    if (doc.expiresAt && doc.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "This document link has expired" }, { status: 410 })
    }

    const isValid = verifyDocumentPassword(password, doc.accessPasswordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const naturalExpiry = doc.expiresAt ? doc.expiresAt.getTime() : Date.now() + SESSION_TTL_MS
    const tokenExpiry = Math.min(Date.now() + SESSION_TTL_MS, naturalExpiry)

    const token = createDocumentAccessToken(accessKey, tokenExpiry)
    const cookieStore = await cookies()
    cookieStore.set(getDocumentAccessCookieName(accessKey), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(1, Math.floor((tokenExpiry - Date.now()) / 1000)),
    })

    return NextResponse.json(
      {
        message: "Access granted",
        document: {
          title: doc.title,
          fileName: doc.fileName,
          mimeType: doc.mimeType,
          allowDownload: doc.allowDownload,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Shared Documents] Password verification failed:", error)
    return NextResponse.json({ error: "Failed to verify password" }, { status: 500 })
  }
}
