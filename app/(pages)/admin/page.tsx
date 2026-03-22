import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import Project from "@/app/models/project"
import Testimonial from "@/app/models/testimonial"
import Lead from "@/app/models/lead"
import { FileText, FolderKanban, Inbox, Users } from "lucide-react"

export default async function AdminDashboard() {
  await connect_db()

  const [documentsCount, projectsCount, testimonialsCount, leadsCount, unreadLeadsCount] = await Promise.all([
    SharedDocument.countDocuments({}),
    Project.countDocuments({ isActive: true }),
    Testimonial.countDocuments({}),
    Lead.countDocuments({}),
    Lead.countDocuments({ isRead: false }),
  ])

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
            <div className="text-2xl font-bold">{documentsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Inbox className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount}</div>
            <p className="text-xs text-muted-foreground">Unread: {unreadLeadsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonialsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
