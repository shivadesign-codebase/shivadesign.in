export const PINTEREST_EXPORT_COLUMNS = [
  { key: "blogTitle", label: "Blog Title", defaultSelected: true },
  { key: "imageType", label: "Image Type", defaultSelected: true },
  { key: "imageUrl", label: "Image URL", defaultSelected: true },
  { key: "tags", label: "Tags", defaultSelected: true },
  { key: "blogId", label: "Blog ID", defaultSelected: false },
  { key: "blogDescription", label: "Blog Description", defaultSelected: false },
  { key: "blogLink", label: "Blog URL", defaultSelected: false },
  { key: "slug", label: "Slug", defaultSelected: false },
  { key: "createdAt", label: "Created At", defaultSelected: false },
] as const

export type PinterestExportColumn = (typeof PINTEREST_EXPORT_COLUMNS)[number]["key"]

export const DEFAULT_PINTEREST_EXPORT_COLUMNS = PINTEREST_EXPORT_COLUMNS
  .filter((column) => column.defaultSelected)
  .map((column) => column.key)

export type PinterestExportRow = {
  blogId: string
  blogTitle: string
  blogDescription: string
  slug: string
  blogLink: string
  imageUrl: string
  imageType: "cover" | "content"
  tags: string
  createdAt: string
}

const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

function extractMarkdownImageUrls(content: string): string[] {
  const urls = new Set<string>()
  for (const match of content.matchAll(MARKDOWN_IMAGE_REGEX)) {
    const url = (match[1] ?? "").trim()
    if (url) {
      urls.add(url)
    }
  }
  return Array.from(urls)
}

function escapeCsvValue(value: string) {
  const normalized = (value ?? "").replace(/\r?\n/g, " ").trim()
  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

export function buildPinterestExportRows(
  blogs: Array<{
    _id: { toString(): string } | string
    title?: string
    description?: string
    slug?: string
    image?: string | null
    content?: string
    tags?: string[]
    createdAt?: string | Date
  }>,
  baseUrl: string
): PinterestExportRow[] {
  const rows: PinterestExportRow[] = []

  for (const blog of blogs) {
    const blogId = typeof blog._id === "string" ? blog._id : blog._id.toString()
    const blogLink = `${baseUrl}/blogs/${blogId}`
    const blogTitle = blog.title ?? ""
    const blogDescription = blog.description ?? ""
    const tags = Array.isArray(blog.tags) ? blog.tags.join(", ") : ""
    const slug = blog.slug ?? ""
    const createdAt = blog.createdAt ? new Date(blog.createdAt).toISOString() : ""

    if (blog.image?.trim()) {
      rows.push({
        blogId,
        blogTitle,
        blogDescription,
        slug,
        blogLink,
        imageUrl: blog.image.trim(),
        imageType: "cover",
        tags,
        createdAt,
      })
    }

    const contentImageUrls = extractMarkdownImageUrls(blog.content ?? "")
    for (const imageUrl of contentImageUrls) {
      rows.push({
        blogId,
        blogTitle,
        blogDescription,
        slug,
        blogLink,
        imageUrl,
        imageType: "content",
        tags,
        createdAt,
      })
    }
  }

  return rows
}

export function getPinterestExportColumns(columns?: string[] | null): PinterestExportColumn[] {
  const allowedColumns = new Set<PinterestExportColumn>(PINTEREST_EXPORT_COLUMNS.map((column) => column.key))
  const sanitized = (columns ?? [])
    .map((column) => column.trim() as PinterestExportColumn)
    .filter((column): column is PinterestExportColumn => allowedColumns.has(column))

  return sanitized.length > 0 ? sanitized : [...DEFAULT_PINTEREST_EXPORT_COLUMNS]
}

export function toPinterestExportCsv(
  rows: PinterestExportRow[],
  columns: PinterestExportColumn[] = [...DEFAULT_PINTEREST_EXPORT_COLUMNS]
) {
  const selectedColumns = getPinterestExportColumns(columns)
  const headers = selectedColumns.map(
    (column) => PINTEREST_EXPORT_COLUMNS.find((item) => item.key === column)?.label ?? column
  )
  const lines = [headers.join(",")]

  for (const row of rows) {
    lines.push(selectedColumns.map((column) => escapeCsvValue(row[column] ?? "")).join(","))
  }

  return lines.join("\n")
}
