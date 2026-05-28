import { LoadingState } from "@/components/common/LoadingState"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <div className="flex gap-8">
        <aside className="hidden md:block w-60 shrink-0 space-y-3">
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
          <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse mt-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          <LoadingState rows={12} />
        </div>
      </div>
    </div>
  )
}
