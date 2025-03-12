"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveDocument } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { FileText, File, FileImage, Search, Eye, Trash2 } from "lucide-react"

export default function DocumentsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      await saveDocument(formData);

      toast({
        title: "Document uploaded",
        description: "The document has been uploaded successfully.",
        variant: "success",
      });

      (e.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem uploading the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const documents = [
    {
      id: 1,
      title: "Project Blueprint.pdf",
      client: "GreenSpace Developers",
      size: "2.1 MB",
      type: "pdf",
      date: "June 15, 2023",
      status: "shared",
    },
    {
      id: 2,
      title: "Structural Calculations.pdf",
      client: "Horizon Homes",
      size: "3.8 MB",
      type: "pdf",
      date: "June 20, 2023",
      status: "shared",
    },
    {
      id: 3,
      title: "Site Inspection Photos.jpg",
      client: "City Infrastructure",
      size: "5.2 MB",
      type: "jpg",
      date: "June 22, 2023",
      status: "pending",
    },
  ]

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "shared":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Shared
          </span>
        )
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Draft
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">Upload and manage project documents</p>
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
                  <Input id="document-title" name="title" placeholder="Enter document title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select name="client">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greenspace">GreenSpace Developers</SelectItem>
                      <SelectItem value="horizon">Horizon Homes</SelectItem>
                      <SelectItem value="city">City Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Upload a file or drag and drop</p>
                    <p className="text-xs text-muted-foreground mb-4">PDF, PNG, JPG (up to 10MB)</p>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Access Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Set a password for this document" />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload Document"}
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
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">DOCUMENT</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">CLIENT</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">DATE</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">STATUS</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td className="py-2 px-4 text-sm">
                            <div className="flex items-center">
                              {getDocumentIcon(doc.type)}
                              <span className="ml-2">{doc.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{doc.size}</span>
                          </td>
                          <td className="py-2 px-4 text-sm">{doc.client}</td>
                          <td className="py-2 px-4 text-sm">{doc.date}</td>
                          <td className="py-2 px-4 text-sm">{getStatusBadge(doc.status)}</td>
                          <td className="py-2 px-4 text-sm">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
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

                <div className="flex justify-between items-center text-sm">
                  <span>
                    Showing 1 to {filteredDocuments.length} of {filteredDocuments.length} results
                  </span>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                      &lt;
                    </Button>
                    <Button variant="default" size="icon" className="w-8 h-8 p-0">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                      2
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                      3
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

