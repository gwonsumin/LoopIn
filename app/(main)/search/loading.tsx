export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="h-8 w-48 bg-neutral-100 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-100 p-5">
            <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse mb-3" />
            <div className="h-5 w-full bg-neutral-100 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse mb-4" />
            <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
