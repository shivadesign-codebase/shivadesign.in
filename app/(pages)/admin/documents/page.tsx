"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditDocumentDialog from "@/components/admin/edit-document-dialog"
import ClientSelector from "@/components/admin/client-selector"
import { toast } from "sonner"
import type { Client } from "@/types/client"

import { FileText, File, FileImage, Search, Eye, Trash2, Copy, Loader2, MessageCircle, Pencil } from "lucide-react"

type SharedDocument = {
  _id: string
  title: string
  clientId: string
  clientName: string
  clientMobile: string
  clientEmail: string
  fileName: string
  mimeType: string
  fileSize: number
  expiresAt: string | null
  allowDownload: boolean
  isClientAccessRevoked: boolean
  accessKey: string
  accessPassword: string
  createdAt: string
  isExpired: boolean
}

export default function DocumentsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [documents, setDocuments] = useState<SharedDocument[]>([])
  const [editingDocument, setEditingDocument] = useState<SharedDocument | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [title, setTitle] = useState("")
  const [password, setPassword] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [allowDownload, setAllowDownload] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true)
      const response = await fetch("/api/admin/documents", { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch documents")
      }

      setDocuments(data.documents || [])
    } catch (error: any) {
      toast("Error", {
        description: error?.message || "Could not load documents.",
      })
    } finally {
      setLoadingDocuments(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast("Error", { description: "Please choose a file." })
      return
    }

    if (!selectedClient) {
      toast("Error", { description: "Please select or create a client." })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("clientId", selectedClient._id)
      formData.append("password", password)
      formData.append("allowDownload", String(allowDownload))
      formData.append("file", file)

      if (expiresAt) {
        formData.append("expiresAt", expiresAt)
      }

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to upload document")
      }

      toast("Document uploaded", {
        description: "The document has been uploaded successfully.",
      })

      setTitle("")
      setSelectedClient(null)
      setPassword("")
      setExpiresAt("")
      setAllowDownload(false)
      setFile(null)
      await fetchDocuments()
    } catch (error) {
      toast("Error", {
        description: "There was a problem uploading the document. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateDocument = async (
    id: string,
    body: Record<string, unknown>,
    successMessage: string,
    localUpdate?: (current: SharedDocument) => SharedDocument
  ) => {
    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update document")
      }

      toast("Updated", { description: successMessage })
      if (localUpdate) {
        setDocuments((prev) => prev.map((doc) => (doc._id === id ? localUpdate(doc) : doc)))
      } else {
        await fetchDocuments()
      }
    } catch (error: any) {
      toast("Error", {
        description: error?.message || "Failed to update document.",
      })
    }
  }

  const deleteDocument = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return

    try {
      const response = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete document")
      }

      toast("Deleted", { description: "Document deleted successfully." })
      setDocuments((prev) => prev.filter((doc) => doc._id !== id))
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to delete document." })
    }
  }

  const getShareLink = (doc: SharedDocument) => `${window.location.origin}/documents/${doc.accessKey}`

  const getShareTemplate = (doc: SharedDocument) => {
    const link = getShareLink(doc)
    return [
      "Hello Sir/Mam, your design document is ready.",
      "You can preview it using the secure link below:",
      link,
      "",
      `Please enter this password to access your file: ${doc.accessPassword || "(password unavailable)"}`,
    ].join("\n")
  }

  const copyTemplate = async (doc: SharedDocument) => {
    const text = getShareTemplate(doc)
    try {
      await navigator.clipboard.writeText(text)
      toast("Template copied", { description: "Share template copied to clipboard." })
    } catch {
      toast("Error", { description: "Failed to copy link." })
    }
  }

  const copyPassword = async (doc: SharedDocument) => {
    if (!doc.accessPassword) {
      toast("Error", { description: "Password unavailable for this document." })
      return
    }

    try {
      await navigator.clipboard.writeText(doc.accessPassword)
      toast("Password copied", { description: "Document password copied." })
    } catch {
      toast("Error", { description: "Failed to copy password." })
    }
  }

  const copyShareableLink = async (doc: SharedDocument) => {
    try {
      await navigator.clipboard.writeText(getShareLink(doc))
      toast("Link copied", { description: "Sharable link copied to clipboard." })
    } catch {
      toast("Error", { description: "Failed to copy sharable link." })
    }
  }

  const shareViaWhatsApp = (doc: SharedDocument) => {
    const mobileRaw = String(doc.clientMobile || "")
    const mobile = mobileRaw.replace(/[^\d]/g, "")

    if (!mobile) {
      toast("Missing mobile", { description: "Client mobile number is not available for this document." })
      return
    }

    const message = encodeURIComponent(getShareTemplate(doc))
    window.open(`https://wa.me/${mobile}?text=${message}`, "_blank")
  }

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileType = (mimeType: string) => {
    if (mimeType === "application/pdf") return "pdf"
    if (mimeType.includes("png")) return "png"
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg"
    return "file"
  }

  const filteredDocuments = useMemo(
    () =>
      documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.clientMobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [documents, searchTerm],
  )

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "jpg":
      case "png":
        return <FileImage className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (doc: SharedDocument) => {
    if (doc.isClientAccessRevoked) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Access Removed
        </span>
      )
    }

    if (doc.isExpired) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Expired
        </span>
      )
    }

    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Shared
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">Upload and manage secure client documents</p>
      </div>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload New Document</TabsTrigger>
          <TabsTrigger value="manage">Manage Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-title">Document Title</Label>
                  <Input
                    id="document-title"
                    name="title"
                    placeholder="Enter document title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <ClientSelector
                  value={selectedClient?._id || ""}
                  selectedClient={selectedClient}
                  onChange={setSelectedClient}
                  description="Use the same searchable client dropdown here. Search by name, mobile, email, or linked project/document."
                />

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Allowed: PDF, PNG, JPG up to 10MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Access Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Set a password for this document"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires-at">Expiration Date (optional)</Label>
                  <Input
                    id="expires-at"
                    name="expiresAt"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                  />
                  Allow client to download this file
                </label>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </span>
                  ) : (
                    "Upload Document"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Managed Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents, client, mobile, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {loadingDocuments ? (
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                ) : filteredDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents found.</p>
                ) : (
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-max w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">DOCUMENT</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">CLIENT</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">EXPIRY</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">STATUS</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredDocuments.map((doc) => (
                          <tr key={doc._id}>
                            <td className="py-2 px-4 text-sm">
                              <div className="flex items-center">
                                {getDocumentIcon(getFileType(doc.mimeType))}
                                <div className="ml-2">
                                  <span className="block">{doc.title}</span>
                                  <span className="text-xs text-muted-foreground">{doc.fileName}</span>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatSize(doc.fileSize)}</span>
                            </td>
                            <td className="py-2 px-4 text-sm">
                              <div>{doc.clientName}</div>
                              <div className="text-xs text-muted-foreground">
                                {[doc.clientMobile, doc.clientEmail].filter(Boolean).join(" • ") || "No extra details"}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-sm">
                              {doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                            </td>
                            <td className="py-2 px-4 text-sm">{getStatusBadge(doc)}</td>
                            <td className="py-2 px-4 text-sm">
                              <div className="flex flex-nowrap gap-2 w-max">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => window.open(`/documents/${doc.accessKey}`, "_blank")}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Open</span>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingDocument(doc)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Copy className="h-4 w-4" />
                                      <span className="sr-only">Copy Options</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => copyTemplate(doc)}>Copy Template</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => copyPassword(doc)}>Copy Password</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => copyShareableLink(doc)}>Copy Sharable Link</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <Button variant="ghost" size="sm" onClick={() => shareViaWhatsApp(doc)}>
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                  <span className="sr-only">Share via WhatsApp</span>
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateDocument(
                                      doc._id,
                                      { allowDownload: !doc.allowDownload },
                                      `Download ${!doc.allowDownload ? "enabled" : "disabled"}.`,
                                      (current) => ({ ...current, allowDownload: !current.allowDownload })
                                    )
                                  }
                                >
                                  {doc.allowDownload ? "Disable Download" : "Enable Download"}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateDocument(
                                      doc._id,
                                      { isClientAccessRevoked: !doc.isClientAccessRevoked },
                                      `Client access ${!doc.isClientAccessRevoked ? "removed" : "restored"}.`,
                                      (current) => ({ ...current, isClientAccessRevoked: !current.isClientAccessRevoked })
                                    )
                                  }
                                >
                                  {doc.isClientAccessRevoked ? "Restore Access" : "Remove Access"}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => deleteDocument(doc._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span>
                    Showing 1 to {filteredDocuments.length} of {filteredDocuments.length} results
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingDocument && (
        <EditDocumentDialog
          document={editingDocument}
          isOpen={Boolean(editingDocument)}
          onClose={() => setEditingDocument(null)}
          onSaved={fetchDocuments}
        />
      )}
    </div>
  )
}
