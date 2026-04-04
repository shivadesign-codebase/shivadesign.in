import Link from "next/link"
import { Home, Mail, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_40%),linear-gradient(to_bottom,rgba(255,251,235,0.9),rgba(255,255,255,1))] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center">
        <section className="w-full rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">404</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Page not found
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              The page you tried to open does not exist, may have moved, or is temporarily unavailable.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-6">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact us
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-stone-500">
            Shiva Design Associates can help you find the right page or answer any project question.
          </p>
        </section>
      </div>
    </main>
  )
}
