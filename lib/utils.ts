import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CloudinaryOptimizeOptions = {
  width?: number
}

export function optimizeCloudinaryImage(url?: string | null, options: CloudinaryOptimizeOptions = {}) {
  if (!url) return ""

  const width = options.width ?? 600
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url
  }

  const alreadyOptimized = /\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(url)
  if (alreadyOptimized) {
    return url
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,dpr_auto,c_limit,w_${width}/`)
}
