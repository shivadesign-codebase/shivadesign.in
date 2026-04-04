"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileLock2, FileQuestion, Loader2, Mail, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type DocumentMeta = {
  title: string
  clientName: string
  fileName: string
  mimeType: string
  allowDownload: boolean
  expiresAt: string | null
  isClientAccessRevoked: boolean
  isExpired: boolean
}

export default function SharedDocumentPage() {
  const params = useParams<{ accessKey: string }>()
  const accessKey = params?.accessKey

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [unlocking, setUnlocking] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [accessError, setAccessError] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [meta, setMeta] = useState<DocumentMeta | null>(null)
  const [accessState, setAccessState] = useState<"available" | "missing" | "revoked" | "expired" | "error">("available")
  const fileUrl = `/api/documents/${accessKey}/file`

  const handleDownload = async () => {
    if (!meta?.allowDownload) return

    try {
      setDownloading(true)

      const response = await fetch(`${fileUrl}?download=1`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Failed to download file")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = meta.fileName || "document"
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (error: any) {
      const message = error?.message || "Failed to download file"
      toast("Error", { description: message })
    } finally {
      setDownloading(false)
    }
  }

  const fetchMeta = async () => {
    try {
      const res = await fetch(`/api/documents/${accessKey}`, { cache: "no-store" })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setAccessState("missing")
        } else if (res.status === 403) {
          setAccessState("revoked")
        } else if (res.status === 410) {
          setAccessState("expired")
        } else {
          setAccessState("error")
        }
        throw new Error(data?.error || "Could not load document")
      }

      setMeta(data.document)
      setAccessState("available")
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not load document" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessKey) return
    fetchMeta()
  }, [accessKey])

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const blocked = (e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(key)
      if (blocked) e.preventDefault()
    }

    if (!authorized) return

    window.addEventListener("keydown", blockKeys)
    return () => window.removeEventListener("keydown", blockKeys)
  }, [authorized])

  const unlockDocument = async (e: FormEvent) => {
    e.preventDefault()
    setAccessError("")

    try {
      setUnlocking(true)
      const res = await fetch(`/api/documents/${accessKey}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Invalid password")
      }

      setAuthorized(true)
      toast("Access granted", { description: "Document unlocked successfully." })
    } catch (error: any) {
      const message = error?.message || "Failed to unlock document"
      setAccessError(message)
      toast("Error", { description: message })
    } finally {
      setUnlocking(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
        <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-stone-500" />
          Loading document...
        </div>
      </div>
    )
  }

  if (!meta || accessState !== "available") {
    const title =
      accessState === "revoked"
        ? "Access revoked"
        : accessState === "expired"
          ? "Link expired"
          : accessState === "missing"
            ? "Document not found"
            : "Access unavailable"

    const message =
      accessState === "revoked"
        ? "This document link has been disabled by the owner. Please contact us if you need a new secure link."
        : accessState === "expired"
          ? "This document link has expired. Please contact us and we will share an updated access link."
          : accessState === "missing"
            ? "You do not have access to this document. Please contact us and we will help you with the right link."
            : "We could not load this document right now. Please try again or contact us for help."

    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16">
        <Card className="w-full border-stone-200 shadow-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl text-stone-900 sm:text-3xl">{title}</CardTitle>
            <p className="mx-auto max-w-xl text-sm leading-7 text-stone-600 sm:text-base">{message}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-6">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact us
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/">
                <FileQuestion className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (meta.isClientAccessRevoked) {
    return <p className="p-6 text-sm text-red-600">Access has been removed by the admin.</p>
  }

  if (meta.isExpired) {
    return <p className="p-6 text-sm text-yellow-700">This document link has expired.</p>
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6 mt-16" onContextMenu={(e) => authorized && e.preventDefault()}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileLock2 className="h-5 w-5 text-stone-500" />
            {meta.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Shared for: {meta.clientName}</p>
          {meta.expiresAt && (
            <p className="text-xs text-muted-foreground">Expires on: {new Date(meta.expiresAt).toLocaleDateString("en-IN")}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!authorized ? (
            <form onSubmit={unlockDocument} className="space-y-3 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="access-password">Password</Label>
                <Input
                  id="access-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={unlocking}>
                {unlocking ? "Verifying..." : "Unlock Document"}
              </Button>
              {accessError ? <p className="text-sm text-red-600">{accessError}</p> : null}
            </form>
          ) : (
            <div className="space-y-4 select-none">
              {meta.mimeType.startsWith("image/") || meta.mimeType === "application/pdf" ? (
                <div className="relative overflow-hidden rounded-md border bg-muted/20">
                  {meta.mimeType === "application/pdf" ? (
                    <iframe src={fileUrl} className="h-[70vh] w-full opacity-90" title={meta.fileName} />
                  ) : (
                    <img src={fileUrl} alt={meta.fileName} className="max-h-[70vh] w-full object-contain opacity-90" />
                  )}

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: "url('/assets/logo-2.png')",
                      backgroundRepeat: "repeat",
                      backgroundSize: "220px auto",
                      backgroundPosition: "center",
                      opacity: 0.22,
                      filter: "blur(0.4px)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-white/15 backdrop-blur-[1.5px]" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Preview is not available for this file type.
                </p>
              )}

              {meta.allowDownload ? (
                <Button variant="outline" onClick={handleDownload} disabled={downloading}>
                  {downloading ? "Preparing download..." : "Download File"}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Download is disabled by admin for this file.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
