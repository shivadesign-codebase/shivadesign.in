"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Client } from "@/types/client"

type ClientSelectorProps = {
  value: string
  onChange: (client: Client) => void
  selectedClient?: Client | null
  label?: string
  placeholder?: string
  description?: string
}

type ClientFormState = {
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

const EMPTY_CLIENT_FORM: ClientFormState = {
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

function getClientMeta(client: Client) {
  return [client.mobile, client.email, client.company, client.city, client.state]
    .filter(Boolean)
    .join(" • ")
}

export default function ClientSelector({
  value,
  onChange,
  selectedClient,
  label = "Client",
  placeholder = "Select client",
  description,
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [clientForm, setClientForm] = useState<ClientFormState>(EMPTY_CLIENT_FORM)

  useEffect(() => {
    let ignore = false

    const loadClients = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ search, limit: "20" })
        const response = await fetch(`/api/admin/clients?${params.toString()}`, { cache: "no-store" })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load clients")
        }

        if (!ignore) {
          setClients(data.clients ?? [])
        }
      } catch (error: any) {
        if (!ignore) {
          toast("Error", { description: error?.message || "Failed to load clients." })
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(loadClients, 250)
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [search])

  const handleCreateClient = async () => {
    if (!clientForm.name.trim()) {
      toast("Missing name", { description: "Client name is required." })
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create client")
      }

      const createdClient = data.client as Client
      setClients((current) => [createdClient, ...current.filter((client) => client._id !== createdClient._id)])
      onChange(createdClient)
      setIsCreateOpen(false)
      setOpen(false)
      setClientForm(EMPTY_CLIENT_FORM)
      toast("Client created", { description: `${createdClient.name} is ready to use.` })
    } catch (error: any) {
      toast("Error", { description: error?.message || "Failed to create client." })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <span className="truncate text-left">
              {selectedClient ? `${selectedClient.name}${getClientMeta(selectedClient) ? ` • ${getClientMeta(selectedClient)}` : ""}` : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-105 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search by name, mobile, email, company, project, document..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading clients...
                </div>
              ) : null}
              {!loading ? <CommandEmpty>No client found.</CommandEmpty> : null}
              <CommandGroup heading="Clients">
                {clients.map((client) => (
                  <CommandItem
                    key={client._id}
                    value={`${client.name} ${client.mobile ?? ""} ${client.email ?? ""}`}
                    onSelect={() => {
                      onChange(client)
                      setOpen(false)
                    }}
                    className="items-start"
                  >
                    <Check className={cn("mt-0.5 h-4 w-4", value === client._id ? "opacity-100" : "opacity-0")} />
                    <div className="min-w-0">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {getClientMeta(client) || "No extra client details"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.projectCount ?? 0} projects • {client.documentCount ?? 0} documents
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setClientForm((current) => ({ ...current, name: search || current.name }))
                setIsCreateOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Client
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Client</DialogTitle>
            <DialogDescription>
              Name is required. Mobile, email, address, company, and notes can be added now or later.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="grid gap-4 py-1 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={clientForm.name}
                  onChange={(event) => setClientForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Enter client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-mobile">Mobile</Label>
                <Input
                  id="client-mobile"
                  value={clientForm.mobile}
                  onChange={(event) => setClientForm((current) => ({ ...current, mobile: event.target.value }))}
                  placeholder="e.g. 919876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientForm.email}
                  onChange={(event) => setClientForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="client@example.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client-company">Company</Label>
                <Input
                  id="client-company"
                  value={clientForm.company}
                  onChange={(event) => setClientForm((current) => ({ ...current, company: event.target.value }))}
                  placeholder="Company or organization"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client-address-1">Address Line 1</Label>
                <Input
                  id="client-address-1"
                  value={clientForm.addressLine1}
                  onChange={(event) => setClientForm((current) => ({ ...current, addressLine1: event.target.value }))}
                  placeholder="House / street / area"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client-address-2">Address Line 2</Label>
                <Input
                  id="client-address-2"
                  value={clientForm.addressLine2}
                  onChange={(event) => setClientForm((current) => ({ ...current, addressLine2: event.target.value }))}
                  placeholder="Landmark or locality"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-city">City</Label>
                <Input
                  id="client-city"
                  value={clientForm.city}
                  onChange={(event) => setClientForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-state">State</Label>
                <Input
                  id="client-state"
                  value={clientForm.state}
                  onChange={(event) => setClientForm((current) => ({ ...current, state: event.target.value }))}
                  placeholder="State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-postal">Postal Code</Label>
                <Input
                  id="client-postal"
                  value={clientForm.postalCode}
                  onChange={(event) => setClientForm((current) => ({ ...current, postalCode: event.target.value }))}
                  placeholder="Postal code"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="client-notes">Notes</Label>
                <Textarea
                  id="client-notes"
                  value={clientForm.notes}
                  onChange={(event) => setClientForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Any additional details about this client"
                  rows={4}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateClient} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
