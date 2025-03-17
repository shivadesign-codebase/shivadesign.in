import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderKanban, MessageSquare, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, ER. Harsh Verma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <MessageSquare className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="document-title" className="text-sm font-medium">
                  Document Title
                </label>
                <input
                  id="document-title"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter document title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">
                  Client
                </label>
                <select id="client" className="w-full p-2 border rounded-md">
                  <option value="">Select a client</option>
                  <option value="client1">GreenSpace Developers</option>
                  <option value="client2">Horizon Homes</option>
                  <option value="client3">City Infrastructure</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="upload-file" className="text-sm font-medium">
                  Upload File
                </label>
                <div className="border border-dashed rounded-md p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Upload a file or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (up to 10MB)</p>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Access Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Set a password for this document"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md">
                Upload Document
              </button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managed Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input type="text" placeholder="Search documents..." className="p-2 border rounded-md w-full" />
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
                    <tr>
                      <td className="py-2 px-4 text-sm">Project Blueprint.pdf</td>
                      <td className="py-2 px-4 text-sm">GreenSpace Developers</td>
                      <td className="py-2 px-4 text-sm">June 15, 2023</td>
                      <td className="py-2 px-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Shared</span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">View</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm">Structural Calculations.pdf</td>
                      <td className="py-2 px-4 text-sm">Horizon Homes</td>
                      <td className="py-2 px-4 text-sm">June 20, 2023</td>
                      <td className="py-2 px-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Shared</span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">View</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-sm">Site Inspection Photos.jpg</td>
                      <td className="py-2 px-4 text-sm">City Infrastructure</td>
                      <td className="py-2 px-4 text-sm">June 22, 2023</td>
                      <td className="py-2 px-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">View</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Showing 1 to 3 of 24 results</span>
                <div className="flex space-x-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded border">&lt;</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border bg-primary text-primary-foreground">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border">&gt;</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

