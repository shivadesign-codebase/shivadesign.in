"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Phone, Trash2 } from "lucide-react"
import { toast } from "sonner"

type InquiryStatus = "new" | "replied" | "closed"

type Inquiry = {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  service?: string
  message: string
  consent: boolean
  status: InquiryStatus
  isRead: boolean
  createdAt: string
}

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to fetch inquiries")
      setInquiries(data.inquiries ?? [])
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not load inquiries." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const filteredInquiries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return inquiries

    return inquiries.filter((inquiry) => {
      return (
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        (inquiry.phone || "").toLowerCase().includes(query) ||
        inquiry.subject.toLowerCase().includes(query) ||
        (inquiry.service || "").toLowerCase().includes(query) ||
        inquiry.message.toLowerCase().includes(query)
      )
    })
  }, [inquiries, searchTerm])

  const updateInquiry = async (
    id: string,
    payload: Partial<Pick<Inquiry, "status" | "isRead">>
  ) => {
    setUpdatingId(id)
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || "Failed to update inquiry")

      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...payload } : item))
      )

      toast("Updated", { description: "Inquiry updated successfully." })
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not update inquiry." })
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return

    setUpdatingId(id)
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete inquiry")

      setInquiries((prev) => prev.filter((item) => item._id !== id))
      toast("Deleted", { description: "Inquiry removed." })
    } catch (error: any) {
      toast("Error", { description: error?.message || "Could not delete inquiry." })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>
      case "replied":
        return <Badge variant="secondary">Replied</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const renderList = (status?: InquiryStatus) => {
    const list = status
      ? filteredInquiries.filter((inquiry) => inquiry.status === status)
      : filteredInquiries

    if (loading) {
      return <p className="text-center text-muted-foreground py-4">Loading inquiries...</p>
    }

    if (list.length === 0) {
      return <p className="text-center text-muted-foreground py-4">No inquiries found</p>
    }

    return (
      <div className="space-y-4">
        {list.map((inquiry) => (
          <div key={inquiry._id} className="border rounded-md p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-3 mb-2">
              <div>
                <h3 className="font-semibold">{inquiry.subject}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span>{inquiry.name}</span>
                  <span>•</span>
                  <span>{inquiry.service || "General Inquiry"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(inquiry.status)}
                <Badge variant={inquiry.isRead ? "secondary" : "default"}>
                  {inquiry.isRead ? "Read" : "Unread"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-sm mb-4 whitespace-pre-wrap">{inquiry.message}</p>

            <div className="grid gap-1 text-sm text-muted-foreground mb-4">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {inquiry.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {inquiry.phone || "No phone provided"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Read</span>
                <Switch
                  checked={inquiry.isRead}
                  disabled={updatingId === inquiry._id}
                  onCheckedChange={(checked) =>
                    updateInquiry(inquiry._id, { isRead: checked })
                  }
                  aria-label={`Toggle read status for ${inquiry.name}`}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Select
                  value={inquiry.status}
                  onValueChange={(value: InquiryStatus) =>
                    updateInquiry(inquiry._id, { status: value })
                  }
                  disabled={updatingId === inquiry._id}
                >
                  <SelectTrigger className="w-35 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                disabled={updatingId === inquiry._id}
                onClick={() => deleteInquiry(inquiry._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Manage contact form submissions and inquiry lifecycle.</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search inquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Inquiries</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Inquiries</CardTitle>
            </CardHeader>
            <CardContent>{renderList()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Inquiries</CardTitle>
            </CardHeader>
            <CardContent>{renderList("new")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replied" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Replied Inquiries</CardTitle>
            </CardHeader>
            <CardContent>{renderList("replied")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Closed Inquiries</CardTitle>
            </CardHeader>
            <CardContent>{renderList("closed")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
