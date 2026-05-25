export default function Loading() {
  return (
    <div className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 헤더 */}
        <div className="mb-8 space-y-2">
          <div className="h-8 w-28 bg-neutral-100 rounded-lg animate-pulse" />
          <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-neutral-100 rounded-full animate-pulse shrink-0" />
          ))}
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
  )
}
