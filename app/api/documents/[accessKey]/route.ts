import { NextResponse } from "next/server"

import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"

export const runtime = "nodejs"

export async function GET(_request: Request, { params }: { params: Promise<{ accessKey: string }> }) {
  try {
    const { accessKey } = await params
    await connect_db()

    const doc = (await SharedDocument.findOne({ accessKey }).lean()) as any

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const isExpired = doc.expiresAt ? new Date(doc.expiresAt).getTime() < Date.now() : false

    return NextResponse.json(
      {
        document: {
          title: doc.title,
          clientName: doc.clientName,
          fileName: doc.fileName,
          mimeType: doc.mimeType,
          allowDownload: doc.allowDownload,
          expiresAt: doc.expiresAt,
          isClientAccessRevoked: doc.isClientAccessRevoked,
          isExpired,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Shared Documents] Failed to fetch document:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}
