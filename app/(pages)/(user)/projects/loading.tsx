import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4 py-16">
      <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-stone-500" />
        Loading projects...
      </div>
    </div>
  )
}
