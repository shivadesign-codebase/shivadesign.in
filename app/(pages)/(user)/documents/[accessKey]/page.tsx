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
  const [meta, setMeta] = useState<DocumentMeta | null>(null)

  const fileUrl = `/api/documents/${accessKey}/file`

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

      const verifyRes = await fetch(`/api/documents/${accessKey}/file`, {
        method: "HEAD",
        cache: "no-store",
      })

      if (!verifyRes.ok) {
        const fallbackMessage = verifyRes.status === 401
          ? "Access session could not be established. Please retry once."
          : "Document is unavailable right now."

        throw new Error(fallbackMessage)
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
              {meta.mimeType === "application/pdf" ? (
                <iframe src={fileUrl} className="w-full h-[70vh] rounded-md border" title={meta.fileName} />
              ) : (
                <img src={fileUrl} alt={meta.fileName} className="max-h-[70vh] w-full object-contain rounded-md border" />
              )}

              {meta.allowDownload ? (
                <Button asChild variant="outline">
                  <a href={`${fileUrl}?download=1`}>Download File</a>
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
