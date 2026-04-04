import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white px-8 py-6 text-stone-700 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_55%)]" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-900">Loading page</p>
            <p className="text-xs text-stone-500">Please wait while we prepare the content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}