"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
        throw new Error(data?.error || "Could not load document")
      }

      setMeta(data.document)
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
    return <p className="p-6 text-sm text-muted-foreground">Loading document...</p>
  }

  if (!meta) {
    return <p className="p-6 text-sm text-muted-foreground">Document not found.</p>
  }

  if (meta.isClientAccessRevoked) {
    return <p className="p-6 text-sm text-red-600">Access has been removed by the admin.</p>
  }

  if (meta.isExpired) {
    return <p className="p-6 text-sm text-yellow-700">This document link has expired.</p>
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6" onContextMenu={(e) => authorized && e.preventDefault()}>
      <Card>
        <CardHeader>
          <CardTitle>{meta.title}</CardTitle>
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
              {meta.mimeType.startsWith("image/") ? (
                <div className="relative overflow-hidden rounded-md border bg-muted/20">
                  <img src={fileUrl} alt={meta.fileName} className="max-h-[70vh] w-full object-contain opacity-90" />

                  {!meta.allowDownload ? (
                    <>
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
                    </>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Secure preview is shown as low-quality images only. PDF files are available through download when enabled.
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
