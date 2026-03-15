import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PublishBlogForm from "@/components/admin/publish-blog-form"
import ManageBlogs from "@/components/admin/manage-blogs"

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <p className="text-muted-foreground">Write, publish, and manage blog articles</p>
      </div>

      <Tabs defaultValue="publish">
        <TabsList>
          <TabsTrigger value="publish">Write Article</TabsTrigger>
          <TabsTrigger value="manage">Manage Articles</TabsTrigger>
        </TabsList>

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
