"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Mail, Phone } from "lucide-react"

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const inquiries = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+91 98765 43210",
      subject: "Commercial Building Project",
      service: "AutoCAD Drafting",
      message:
        "I'm looking for detailed AutoCAD drafting services for a new commercial building project in Gurugram. The project is approximately 50,000 sq ft and we need complete structural and architectural drawings.",
      date: "June 22, 2023",
      status: "new",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 87654 32109",
      subject: "Residential Project Consultation",
      service: "3D Elevation",
      message:
        "We're developing a luxury residential complex and need 3D elevation designs for marketing materials. Would like to discuss the project details and timeline.",
      date: "June 20, 2023",
      status: "replied",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 76543 21098",
      subject: "Site Inspection Request",
      service: "Site Inspection",
      message:
        "We need a comprehensive site inspection for our ongoing construction project to ensure compliance with building codes and quality standards.",
      date: "June 18, 2023",
      status: "closed",
    },
    {
      id: 4,
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 65432 10987",
      subject: "Bridge Design Consultation",
      service: "Structural Design",
      message:
        "Looking for consultation on a small bridge design for a private property. Need to understand the feasibility and cost estimates.",
      date: "June 15, 2023",
      status: "new",
    },
  ]

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Manage contact form submissions and inquiries</p>
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
            <CardContent>
              <div className="space-y-4">
                {filteredInquiries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No inquiries found</p>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <div>
                          <h3 className="font-semibold">{inquiry.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{inquiry.name}</span>
                            <span>•</span>
                            <span>{inquiry.service}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          {getStatusBadge(inquiry.status)}
                          <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-4 line-clamp-2">{inquiry.message}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInquiries.filter((i) => i.status === "new").length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No new inquiries found</p>
                ) : (
                  filteredInquiries
                    .filter((i) => i.status === "new")
                    .map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div>
                            <h3 className="font-semibold">{inquiry.subject}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{inquiry.name}</span>
                              <span>•</span>
                              <span>{inquiry.service}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {getStatusBadge(inquiry.status)}
                            <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-4 line-clamp-2">{inquiry.message}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replied" className="space-y-4">
          {/* Similar content for replied inquiries */}
          <Card>
            <CardHeader>
              <CardTitle>Replied Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInquiries.filter((i) => i.status === "replied").length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No replied inquiries found</p>
                ) : (
                  filteredInquiries
                    .filter((i) => i.status === "replied")
                    .map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-md p-4">
                        {/* Inquiry content */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div>
                            <h3 className="font-semibold">{inquiry.subject}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{inquiry.name}</span>
                              <span>•</span>
                              <span>{inquiry.service}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {getStatusBadge(inquiry.status)}
                            <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-4 line-clamp-2">{inquiry.message}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Closed Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInquiries.filter((i) => i.status === "closed").length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No closed inquiries found</p>
                ) : (
                  filteredInquiries
                    .filter((i) => i.status === "closed")
                    .map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div>
                            <h3 className="font-semibold">{inquiry.subject}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{inquiry.name}</span>
                              <span>•</span>
                              <span>{inquiry.service}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            {getStatusBadge(inquiry.status)}
                            <span className="text-sm text-muted-foreground">{inquiry.date}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-4 line-clamp-2">{inquiry.message}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

