"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendBroadcastEmail } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function BroadcastPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    recipients: "all",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const form = new FormData()
      form.append("subject", formData.subject)
      form.append("content", formData.content)
      form.append("recipients", formData.recipients)

      await sendBroadcastEmail(form)
      toast({
        title: "Email sent",
        description: "The broadcast email has been sent successfully.",
      })
      setFormData({
        subject: "",
        content: "",
        recipients: "all",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, recipients: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Broadcast Email</h1>
        <p className="text-muted-foreground">Send mass emails to clients and subscribers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select value={formData.recipients} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="clients">Clients Only</SelectItem>
                  <SelectItem value="subscribers">Subscribers Only</SelectItem>
                  <SelectItem value="prospects">Prospects Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter email subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter email content"
                rows={10}
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">New Service Announcement</h3>
                  <p className="text-sm text-muted-foreground">Sent to: All Contacts</p>
                </div>
                <span className="text-sm text-muted-foreground">June 15, 2023</span>
              </div>
              <p className="text-sm mt-2">Announcing our new 3D visualization services for architectural projects...</p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Holiday Office Hours</h3>
                  <p className="text-sm text-muted-foreground">Sent to: Clients Only</p>
                </div>
                <span className="text-sm text-muted-foreground">December 20, 2022</span>
              </div>
              <p className="text-sm mt-2">
                Please note our office will be closed during the holiday season from December 24th to January 2nd...
              </p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Project Showcase Invitation</h3>
                  <p className="text-sm text-muted-foreground">Sent to: All Contacts</p>
                </div>
                <span className="text-sm text-muted-foreground">October 5, 2022</span>
              </div>
              <p className="text-sm mt-2">
                You're invited to our annual project showcase event where we'll be presenting our most innovative
                engineering solutions...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

