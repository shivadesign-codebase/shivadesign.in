import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, LayoutDashboard, ImageIcon, FolderKanban, MessageSquare, Mail, Users, Settings, LogOut, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard - Shiva Consultant",
  description: "Admin dashboard for Shiva Consultant website",
}

export default function AdminLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      <header className="sticky top-0 flex h-16 items-center z-50 gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          Admin Dashboard
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-64 border-r bg-card md:block">
          <nav className="grid gap-2 p-4">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/documents">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </Button>
            </Link>
            <Link href="/admin/banners">
              <Button variant="ghost" className="w-full justify-start">
                <ImageIcon className="mr-2 h-4 w-4" />
                Banners
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button variant="ghost" className="w-full justify-start">
                <FolderKanban className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </Link>
            <Link href="/admin/inquiries">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Inquiries
              </Button>
            </Link>
            <Link href="/admin/broadcast">
              <Button variant="ghost" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Broadcast Email
              </Button>
            </Link>
            <Link href="/admin/testimonials">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Testimonials
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowLeft className="mr-2 h-4 w-4" />
                HOME
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

