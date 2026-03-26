import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import mongoose from "mongoose"

import connect_db from "@/config/db"
import Blog from "@/app/models/blog"
import {
  buildPinterestExportRows,
  getPinterestExportColumns,
  toPinterestExportCsv,
} from "@/lib/blog-pinterest-export"

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

    const format = request.nextUrl.searchParams.get("format")?.toLowerCase()
    const daysParam = request.nextUrl.searchParams.get("days")?.trim() ?? ""
    const rawBlogIds = request.nextUrl.searchParams.get("blogIds")?.split(",") ?? []
    const selectedBlogIds = rawBlogIds.map((id) => id.trim()).filter(Boolean)
    const selectedColumns = getPinterestExportColumns(
      request.nextUrl.searchParams.get("columns")?.split(",") ?? []
    )

    if (daysParam && (!/^\d+$/.test(daysParam) || Number(daysParam) < 1)) {
      return NextResponse.json({ error: "Days filter must be a positive number" }, { status: 400 })
    }

    if (selectedBlogIds.some((id) => !mongoose.isValidObjectId(id))) {
      return NextResponse.json({ error: "Invalid blog ID in filter" }, { status: 400 })
    }

    const query: Record<string, unknown> = { isPublished: true }

    if (daysParam) {
      const days = Number(daysParam)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      query.createdAt = { $gte: startDate }
    }

    if (selectedBlogIds.length > 0) {
      query._id = { $in: selectedBlogIds }
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .select("_id title description slug image content tags createdAt")
      .lean() as Array<{
      _id: { toString(): string } | string
      title?: string
      description?: string
      slug?: string
      image?: string | null
      content?: string
      tags?: string[]
      createdAt?: string | Date
    }>

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin
    const rows = buildPinterestExportRows(blogs, siteUrl)

    if (format === "csv") {
      const csv = toPinterestExportCsv(rows, selectedColumns)
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
      selectedColumns,
      totalRows: rows.length,
      totalPublishedBlogs: blogs.length,
    })
  } catch (error) {
    console.error("[Admin Pinterest Export] Failed to generate export:", error)
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 })
  }
}
