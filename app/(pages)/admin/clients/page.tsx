"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, FileText, FolderKanban, Loader2, Plus, Save, Search, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Client } from "@/types/client"

type ClientDetail = {
  client: Client
  summary: {
    projectCount: number
    activeProjectCount: number
    documentCount: number
    activeDocumentCount: number
  }
  projects: Array<{
    _id: string
    title: string
    category: string
    type: string
    isActive: boolean
    createdAt: string
  }>
  documents: Array<{
    _id: string
    title: string
    fileName: string
    allowDownload: boolean
    isClientAccessRevoked: boolean
    expiresAt: string | null
    createdAt: string
    accessKey: string
  }>
}

type ClientForm = {
  name: string
  mobile: string
  email: string
  company: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  notes: string
}

const EMPTY_FORM: ClientForm = {
  name: "",
  mobile: "",
  email: "",
  company: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  notes: "",
}

function toForm(client?: Client | null): ClientForm {
  return {
    name: client?.name ?? "",
    mobile: client?.mobile ?? "",
    email: client?.email ?? "",
    company: client?.company ?? "",
    addressLine1: client?.addressLine1 ?? "",
    addressLine2: client?.addressLine2 ?? "",
    city: client?.city ?? "",
    state: client?.state ?? "",
    postalCode: client?.postalCode ?? "",
    notes: client?.notes ?? "",
  }
}

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState("")
  const [detail, setDetail] = useState<ClientDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [createForm, setCreateForm] = useState<ClientForm>(EMPTY_FORM)
  const [editForm, setEditForm] = useState<ClientForm>(EMPTY_FORM)

  const fetchClients = async (query = search, preserveSelection = true) => {
    try {
      setLoadingClients(true)
      const params = new URLSearchParams({ search: query, limit: "100" })
      const response = await fetch(`/api/admin/clients?${params.toString()}`, { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch clients")
      }

      const nextClients = data.clients ?? []
      setClients(nextClients)

      const nextSelectedId = preserveSelection && selectedClientId && nextClients.some((client: Client) => client._id === selectedClientId)
        ? selectedClientId
        : nextClients[0]?._id ?? ""

      setSelectedClientId(nextSelectedId)
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to load clients." })
    } finally {
      setLoadingClients(false)
    }
  }

  const fetchClientDetail = async (clientId: string) => {
    if (!clientId) {
      setDetail(null)
      setEditForm(EMPTY_FORM)
      return
    }

    try {
      setLoadingDetail(true)
      const response = await fetch(`/api/admin/clients/${clientId}`, { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch client detail")
      }

      setDetail(data)
      setEditForm(toForm(data.client))
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to load client detail." })
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    fetchClients("")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients(search, true)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchClientDetail(selectedClientId)
  }, [selectedClientId])

  const handleCreateClient = async () => {
    if (!createForm.name.trim()) {
      toast("Missing name", { description: "Client name is required." })
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create client")
      }

      const createdClient = data.client as Client
      toast("Client created", { description: `${createdClient.name} has been added.` })
      setCreateForm(EMPTY_FORM)
      await fetchClients(search, false)
      setSelectedClientId(createdClient._id)
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to create client." })
    } finally {
      setIsCreating(false)
    }
  }

  const handleSaveClient = async () => {
    if (!selectedClientId) return
    if (!editForm.name.trim()) {
      toast("Missing name", { description: "Client name is required." })
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(`/api/admin/clients/${selectedClientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update client")
      }

      toast("Saved", { description: "Client details updated successfully." })
      await fetchClients(search, true)
      await fetchClientDetail(selectedClientId)
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to update client." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground">Create client records, link them to projects and documents, and review client-level activity.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ClientFormFields form={createForm} onChange={setCreateForm} />
            <Button type="button" className="w-full" onClick={handleCreateClient} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? "Creating..." : "Create Client"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, mobile, email, project..."
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[640px] rounded-md border">
                <div className="space-y-2 p-3">
                  {loadingClients ? (
                    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading clients...
                    </div>
                  ) : clients.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No clients found.</p>
                  ) : (
                    clients.map((client) => (
                      <button
                        key={client._id}
                        type="button"
                        onClick={() => setSelectedClientId(client._id)}
                        className={`w-full rounded-lg border p-3 text-left transition ${selectedClientId === client._id ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {[client.mobile, client.email, client.company].filter(Boolean).join(" • ") || "No extra details"}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {client.projectCount ?? 0} projects • {client.documentCount ?? 0} documents
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Detail</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedClientId ? (
                <p className="text-sm text-muted-foreground">Select a client to view details.</p>
              ) : loadingDetail ? (
                <div className="flex items-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading detail...
                </div>
              ) : detail ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <SummaryCard icon={<UserRound className="h-4 w-4" />} label="Projects" value={detail.summary.projectCount} sublabel={`Active ${detail.summary.activeProjectCount}`} />
                    <SummaryCard icon={<FileText className="h-4 w-4" />} label="Documents" value={detail.summary.documentCount} sublabel={`Accessible ${detail.summary.activeDocumentCount}`} />
                    <SummaryCard icon={<FolderKanban className="h-4 w-4" />} label="Latest Project" value={detail.projects[0] ? new Date(detail.projects[0].createdAt).toLocaleDateString("en-IN") : "-"} sublabel={detail.projects[0]?.title ?? "No projects yet"} />
                    <SummaryCard icon={<Building2 className="h-4 w-4" />} label="Latest Document" value={detail.documents[0] ? new Date(detail.documents[0].createdAt).toLocaleDateString("en-IN") : "-"} sublabel={detail.documents[0]?.title ?? "No documents yet"} />
                  </div>

                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">Client Profile</h2>
                      <Button type="button" onClick={handleSaveClient} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Client"}
                      </Button>
                    </div>
                    <ClientFormFields form={editForm} onChange={setEditForm} />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="space-y-3 rounded-lg border p-4">
                      <h3 className="font-semibold">Linked Projects</h3>
                      {detail.projects.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No projects linked to this client yet.</p>
                      ) : (
                        detail.projects.map((project) => (
                          <div key={project._id} className="rounded-md border p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-xs text-muted-foreground">{project.category} • {project.type}</p>
                              </div>
                              <Badge variant={project.isActive ? "default" : "secondary"}>
                                {project.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Added {new Date(project.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-3 rounded-lg border p-4">
                      <h3 className="font-semibold">Shared Documents</h3>
                      {detail.documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No documents shared with this client yet.</p>
                      ) : (
                        detail.documents.map((document) => (
                          <div key={document._id} className="rounded-md border p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">{document.title}</p>
                                <p className="text-xs text-muted-foreground">{document.fileName}</p>
                              </div>
                              <Badge variant={document.isClientAccessRevoked ? "destructive" : "default"}>
                                {document.isClientAccessRevoked ? "Access Removed" : "Shared"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                              <span>{document.expiresAt ? `Expires ${new Date(document.expiresAt).toLocaleDateString("en-IN")}` : "No expiry"}</span>
                              <Link href={`/documents/${document.accessKey}`} target="_blank" className="underline underline-offset-2">
                                Open Link
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Client detail not available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ClientFormFields({
  form,
  onChange,
}: {
  form: ClientForm
  onChange: React.Dispatch<React.SetStateAction<ClientForm>>
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label>Client Name</Label>
        <Input value={form.name} onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))} placeholder="Client name" />
      </div>
      <div className="space-y-2">
        <Label>Mobile</Label>
        <Input value={form.mobile} onChange={(event) => onChange((current) => ({ ...current, mobile: event.target.value }))} placeholder="Mobile number" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={form.email} onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Company</Label>
        <Input value={form.company} onChange={(event) => onChange((current) => ({ ...current, company: event.target.value }))} placeholder="Company name" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Address Line 1</Label>
        <Input value={form.addressLine1} onChange={(event) => onChange((current) => ({ ...current, addressLine1: event.target.value }))} placeholder="Address line 1" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Address Line 2</Label>
        <Input value={form.addressLine2} onChange={(event) => onChange((current) => ({ ...current, addressLine2: event.target.value }))} placeholder="Address line 2" />
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input value={form.city} onChange={(event) => onChange((current) => ({ ...current, city: event.target.value }))} placeholder="City" />
      </div>
      <div className="space-y-2">
        <Label>State</Label>
        <Input value={form.state} onChange={(event) => onChange((current) => ({ ...current, state: event.target.value }))} placeholder="State" />
      </div>
      <div className="space-y-2">
        <Label>Postal Code</Label>
        <Input value={form.postalCode} onChange={(event) => onChange((current) => ({ ...current, postalCode: event.target.value }))} placeholder="Postal code" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={(event) => onChange((current) => ({ ...current, notes: event.target.value }))} placeholder="Notes about this client" rows={4} />
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, sublabel }: { icon: React.ReactNode; label: string; value: string | number; sublabel: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-3 text-xl font-semibold">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
    </div>
  )
}
