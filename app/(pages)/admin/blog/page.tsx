import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PublishBlogForm from "@/components/admin/publish-blog-form"
import ManageBlogs from "@/components/admin/manage-blogs"
import ManageBlogTopics from "@/components/admin/manage-blog-topics"

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <p className="text-muted-foreground">Write manually, manage articles, or queue topics for daily auto-publish</p>
      </div>

      <Tabs defaultValue="topics">
        <TabsList>
          <TabsTrigger value="topics">Auto-Publish Queue</TabsTrigger>
          <TabsTrigger value="publish">Write Article</TabsTrigger>
          <TabsTrigger value="manage">Manage Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-4">
          <ManageBlogTopics />
        </TabsContent>

        <TabsContent value="publish" className="space-y-4">
          <PublishBlogForm />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <ManageBlogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
