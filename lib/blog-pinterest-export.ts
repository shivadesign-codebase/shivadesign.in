export type PinterestExportRow = {
  blogId: string
  title: string
  description: string
  blogLink: string
  imageUrl: string
  imageType: "cover" | "content"
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
    image?: string | null
    content?: string
  }>,
  baseUrl: string
): PinterestExportRow[] {
  const rows: PinterestExportRow[] = []

  for (const blog of blogs) {
    const blogId = typeof blog._id === "string" ? blog._id : blog._id.toString()
    const blogLink = `${baseUrl}/blogs/${blogId}`
    const title = blog.title ?? ""
    const description = blog.description ?? ""

    if (blog.image?.trim()) {
      rows.push({
        blogId,
        title,
        description,
        blogLink,
        imageUrl: blog.image.trim(),
        imageType: "cover",
      })
    }

    const contentImageUrls = extractMarkdownImageUrls(blog.content ?? "")
    for (const imageUrl of contentImageUrls) {
      rows.push({
        blogId,
        title,
        description,
        blogLink,
        imageUrl,
        imageType: "content",
      })
    }
  }

  return rows
}

export function toPinterestExportCsv(rows: PinterestExportRow[]) {
  const headers = ["blogId", "title", "description", "blogLink", "imageUrl", "imageType"]
  const lines = [headers.join(",")]

  for (const row of rows) {
    lines.push(
      [
        escapeCsvValue(row.blogId),
        escapeCsvValue(row.title),
        escapeCsvValue(row.description),
        escapeCsvValue(row.blogLink),
        escapeCsvValue(row.imageUrl),
        escapeCsvValue(row.imageType),
      ].join(",")
    )
  }

  return lines.join("\n")
}
