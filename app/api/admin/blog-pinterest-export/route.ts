import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import connect_db from "@/config/db"
import Blog from "@/app/models/blog"
import { buildPinterestExportRows, toPinterestExportCsv } from "@/lib/blog-pinterest-export"

export const runtime = "nodejs"

async function ensureAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value || ""
  return token === "logged_in"
}

export async function GET(request: NextRequest) {
  try {
    const hasSession = await ensureAdminSession()
    if (!hasSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connect_db()

    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("_id title description image content")
      .lean() as Array<{
      _id: { toString(): string } | string
      title?: string
      description?: string
      image?: string | null
      content?: string
    }>

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin
    const rows = buildPinterestExportRows(blogs, siteUrl)

    const format = request.nextUrl.searchParams.get("format")?.toLowerCase()
    if (format === "csv") {
      const csv = toPinterestExportCsv(rows)
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="pinterest-blog-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      })
    }

    return NextResponse.json({
      rows,
      totalRows: rows.length,
      totalPublishedBlogs: blogs.length,
    })
  } catch (error) {
    console.error("[Admin Pinterest Export] Failed to generate export:", error)
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 })
  }
}
