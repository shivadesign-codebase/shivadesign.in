import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import connect_db from "@/config/db"
import SharedDocument from "@/app/models/document"
import Project from "@/app/models/project"
import Testimonial from "@/app/models/testimonial"
import Lead from "@/app/models/lead"
import Contact from "@/app/models/contact"
import Blog from "@/app/models/blog"
import BlogTopic from "@/app/models/blog-topic"
import DashboardCharts from "@/components/admin/dashboard-charts"
import { FileText, FolderKanban, Inbox, MessageSquare, Users } from "lucide-react"

export default async function AdminDashboard() {
  await connect_db()

  const now = new Date()
  const sixMonthStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    documentsCount,
    sharedDocumentsCount,
    revokedDocumentsCount,
    projectsCount,
    testimonialsCount,
    leadsCount,
    unreadLeadsCount,
    readLeadsCount,
    inquiriesCount,
    unreadInquiriesCount,
    totalBlogsCount,
    publishedBlogsCount,
    draftBlogsCount,
    queuedBlogsPendingCount,
    queuedBlogsPublishedCount,
    leadsBySourceRaw,
    leadsMonthlyRaw,
    blogsMonthlyRaw,
    docsMonthlyRaw,
  ] = await Promise.all([
    SharedDocument.countDocuments({}),
    SharedDocument.countDocuments({
      isClientAccessRevoked: false,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }),
    SharedDocument.countDocuments({ isClientAccessRevoked: true }),
    Project.countDocuments({ isActive: true }),
    Testimonial.countDocuments({}),
    Lead.countDocuments({}),
    Lead.countDocuments({ isRead: false }),
    Lead.countDocuments({ isRead: true }),
    Contact.countDocuments({}),
    Contact.countDocuments({ isRead: false }),
    Blog.countDocuments({}),
    Blog.countDocuments({ isPublished: true }),
    Blog.countDocuments({ isPublished: false }),
    BlogTopic.countDocuments({ isUsed: false }),
    BlogTopic.countDocuments({ isUsed: true }),
    Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthStart } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
    Blog.aggregate([
      { $match: { createdAt: { $gte: sixMonthStart } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
    SharedDocument.aggregate([
      { $match: { createdAt: { $gte: sixMonthStart } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
  ])

  const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`
  const leadsMap = new Map(leadsMonthlyRaw.map((item: any) => [monthKey(item._id.y, item._id.m), item.count]))
  const blogsMap = new Map(blogsMonthlyRaw.map((item: any) => [monthKey(item._id.y, item._id.m), item.count]))
  const docsMap = new Map(docsMonthlyRaw.map((item: any) => [monthKey(item._id.y, item._id.m), item.count]))

  const monthlyActivity = Array.from({ length: 6 }, (_, index) => {
    const current = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = monthKey(current.getFullYear(), current.getMonth() + 1)

    return {
      month: current.toLocaleString("en-US", { month: "short" }),
      leads: leadsMap.get(key) ?? 0,
      blogs: blogsMap.get(key) ?? 0,
      documents: docsMap.get(key) ?? 0,
    }
  })

  const leadSource = ["home", "blogs", "blog-detail"].map((source) => {
    const match = leadsBySourceRaw.find((item: any) => item._id === source)
    return {
      source,
      value: match?.count ?? 0,
    }
  })

  const blogRatio = [
    { name: "Published", value: publishedBlogsCount },
    { name: "Draft", value: draftBlogsCount },
  ]

  const leadRatio = [
    { name: "Read", value: readLeadsCount },
    { name: "Unread", value: unreadLeadsCount },
  ]

  const documentRatio = [
    { name: "Shared", value: sharedDocumentsCount },
    { name: "Revoked", value: revokedDocumentsCount },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, ER. Harsh Verma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Leads (Total)</CardTitle>
            <Inbox className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount}</div>
            <p className="text-xs text-muted-foreground">Unread: {unreadLeadsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inquiries (Total)</CardTitle>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiriesCount}</div>
            <p className="text-xs text-muted-foreground">Unread: {unreadInquiriesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Blogs</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogsCount}</div>
            <p className="text-xs text-muted-foreground">Published: {publishedBlogsCount}</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts
        blogRatio={blogRatio}
        leadRatio={leadRatio}
        documentRatio={documentRatio}
        leadSource={leadSource}
        monthlyActivity={monthlyActivity}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blog Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Pending: {queuedBlogsPendingCount}</div>
            <p className="text-xs text-muted-foreground">Published from queue: {queuedBlogsPublishedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{publishedBlogsCount}</div>
            <p className="text-xs text-muted-foreground">Draft: {draftBlogsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Read: {readLeadsCount}</div>
            <p className="text-xs text-muted-foreground">Unread: {unreadLeadsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Document Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Shared: {sharedDocumentsCount}</div>
            <p className="text-xs text-muted-foreground">Revoked: {revokedDocumentsCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{testimonialsCount}</div>
            <p className="text-xs text-muted-foreground">All approved + pending entries combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projects (Active)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{projectsCount}</div>
            <p className="text-xs text-muted-foreground">Currently visible in portfolio</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
