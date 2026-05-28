interface LoadingStateProps {
  titleWidth?: string
  rows?: number
  variant?: "cards" | "detail"
  className?: string
}

export function LoadingState({
  titleWidth = "w-48",
  rows = 6,
  variant = "cards",
  className = "",
}: LoadingStateProps) {
  if (variant === "detail") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-neutral-100 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-14 bg-neutral-100 rounded-full" />
                <div className="h-6 w-10 bg-neutral-100 rounded-full" />
              </div>
              <div className="h-7 w-3/4 bg-neutral-100 rounded" />
              <div className="h-7 w-1/2 bg-neutral-100 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-100 rounded" />
              <div className="h-4 w-full bg-neutral-100 rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 rounded" />
            </div>
            <div className="h-11 w-36 bg-neutral-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-16 bg-neutral-100 rounded" />
                <div className="h-5 w-14 bg-neutral-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={`h-7 ${titleWidth} bg-neutral-100 rounded-lg animate-pulse mb-6`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-100 bg-white p-5 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-5 w-14 bg-neutral-100 rounded-full" />
              <div className="h-4 w-8 bg-neutral-100 rounded" />
            </div>
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-4/5 bg-neutral-100 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
            <div className="h-3 w-2/3 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
