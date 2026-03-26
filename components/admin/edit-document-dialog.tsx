"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import ClientSelector from "@/components/admin/client-selector"
import { toast } from "sonner"
import type { Client } from "@/types/client"

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

type EditDocumentFormValues = {
  title: string
  clientId: string
  password: string
  expiresAt: string
  allowDownload: boolean
}

type EditDocumentDialogProps = {
  document: SharedDocument
  isOpen: boolean
  onClose: () => void
  onSaved: () => Promise<void> | void
}

function toDateInputValue(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

export default function EditDocumentDialog({ document, isOpen, onClose, onSaved }: EditDocumentDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>({
    _id: document.clientId,
    name: document.clientName,
    mobile: document.clientMobile || null,
    email: document.clientEmail || null,
    createdAt: document.createdAt,
    updatedAt: document.createdAt,
  })

  const { register, handleSubmit, setValue, reset, watch } = useForm<EditDocumentFormValues>({
    defaultValues: {
      title: document.title,
      clientId: document.clientId,
      password: "",
      expiresAt: toDateInputValue(document.expiresAt),
      allowDownload: document.allowDownload,
    },
  })

  useEffect(() => {
    reset({
      title: document.title,
      clientId: document.clientId,
      password: "",
      expiresAt: toDateInputValue(document.expiresAt),
      allowDownload: document.allowDownload,
    })
    setSelectedClient({
      _id: document.clientId,
      name: document.clientName,
      mobile: document.clientMobile || null,
      email: document.clientEmail || null,
      createdAt: document.createdAt,
      updatedAt: document.createdAt,
    })
  }, [document, reset])

  const allowDownloadValue = watch("allowDownload")

  const onSubmit = async (values: EditDocumentFormValues) => {
    try {
      setIsSaving(true)

      const payload: Record<string, unknown> = {
        title: values.title,
        clientId: selectedClient?._id,
        allowDownload: values.allowDownload,
        expiresAt: values.expiresAt || null,
      }

      if (!selectedClient?._id) {
        toast("Error", { description: "Please select a client." })
        return
      }

      if (values.password.trim()) {
        if (values.password.trim().length < 4) {
          toast("Error", { description: "Password must be at least 4 characters." })
          return
        }
        payload.password = values.password.trim()
      }

      const response = await fetch(`/api/admin/documents/${document._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update document")
      }

      toast("Updated", { description: "Document details updated successfully." })
      await onSaved()
      onClose()
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to update document." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Edit Shared Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-doc-title">Document Title</Label>
            <Input id="edit-doc-title" {...register("title", { required: true })} placeholder="Enter document title" />
          </div>

          <ClientSelector
            value={selectedClient?._id || ""}
            selectedClient={selectedClient}
            onChange={(client) => {
              setSelectedClient(client)
              setValue("clientId", client._id)
            }}
            description="Reassign this document to another client if needed."
          />

          <div className="space-y-2">
            <Label htmlFor="edit-doc-password">New Access Password (optional)</Label>
            <Input
              id="edit-doc-password"
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep existing password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expires-at">Expiration Date</Label>
            <Input id="edit-expires-at" type="date" {...register("expiresAt")} />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="edit-allow-download"
              checked={allowDownloadValue}
              onCheckedChange={(checked) => setValue("allowDownload", checked)}
            />
            <Label htmlFor="edit-allow-download">Allow client to download this file</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
