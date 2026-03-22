"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type Lead = {
  _id: string
  name: string
  email?: string | null
  phone?: string | null
  source: "home" | "blogs" | "blog-detail"
  pagePath?: string
  isRead: boolean
  createdAt: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to fetch leads")
      setLeads(data.leads ?? [])
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not load leads." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return leads

    return leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(query) ||
        (lead.email || "").toLowerCase().includes(query) ||
        (lead.phone || "").toLowerCase().includes(query) ||
        (lead.pagePath || "").toLowerCase().includes(query) ||
        lead.source.toLowerCase().includes(query)
      )
    })
  }, [leads, searchTerm])

  const toggleReadStatus = async (lead: Lead) => {
    setUpdatingId(lead._id)
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead._id, isRead: !lead.isRead }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update status")

      setLeads((prev) => prev.map((item) => (item._id === lead._id ? { ...item, isRead: !lead.isRead } : item)))
      toast("Updated", { description: `Lead marked as ${!lead.isRead ? "read" : "unread"}.` })
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not update lead." })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-muted-foreground">Review consultation leads and mark them as read or unread.</p>
      </div>

      <Input
        placeholder="Search by name, email, phone, source or page..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-lg"
      />

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading leads...</p>
          ) : filteredLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads found.</p>
          ) : (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead._id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{lead.name}</h3>
                        <Badge variant={lead.isRead ? "secondary" : "default"}>{lead.isRead ? "Read" : "Unread"}</Badge>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lead.email || "No email"} • {lead.phone || "No phone"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lead.pagePath || "-"} • {new Date(lead.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Read</span>
                      <Switch
                        checked={lead.isRead}
                        disabled={updatingId === lead._id}
                        onCheckedChange={() => toggleReadStatus(lead)}
                        aria-label={`Toggle read status for ${lead.name}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
