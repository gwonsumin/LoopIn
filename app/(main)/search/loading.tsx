export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* 헤더 */}
      <div className="h-7 w-48 bg-neutral-100 rounded-lg animate-pulse mb-6" />

      <div className="flex gap-8">
        {/* 사이드바 스켈레톤 */}
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

        {/* 카드 그리드 스켈레톤 */}
        <div className="flex-1 min-w-0">
          <div className="h-5 w-32 bg-neutral-100 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-100 bg-white p-5 space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-14 bg-neutral-100 rounded-full" />
                  <div className="h-4 w-8 bg-neutral-100 rounded" />
                </div>
                <div className="h-4 w-full bg-neutral-100 rounded" />
                <div className="h-4 w-4/5 bg-neutral-100 rounded" />
                <div className="h-3 w-full bg-neutral-100 rounded" />
                <div className="h-3 w-2/3 bg-neutral-100 rounded" />
                <div className="flex gap-1 pt-1">
                  <div className="h-5 w-12 bg-neutral-100 rounded-full" />
                  <div className="h-5 w-14 bg-neutral-100 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div className="h-5 w-10 bg-neutral-100 rounded-full" />
                  <div className="h-4 w-16 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
