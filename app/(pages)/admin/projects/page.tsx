import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddProjectForm from "@/components/admin/add-project-form"
import ManageProjects from "@/components/admin/manage-projects"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Management</h1>
        <p className="text-muted-foreground">Add and manage portfolio projects</p>
      </div>

      <Tabs defaultValue="add">
        <TabsList>
          <TabsTrigger value="add">Add New Project</TabsTrigger>
          <TabsTrigger value="manage">Manage Existing Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
            <AddProjectForm />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
            <ManageProjects />
        </TabsContent>
      </Tabs>
    </div>
  )
}
