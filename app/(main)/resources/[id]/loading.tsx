export default function Loading() {
  return (
    <div className="bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 브레드크럼 */}
        <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* 좌측 본문 */}
          <div className="lg:col-span-2 space-y-6 animate-pulse">
            {/* 배지 + 제목 */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-14 bg-neutral-100 rounded-full" />
                <div className="h-6 w-10 bg-neutral-100 rounded-full" />
              </div>
              <div className="h-7 w-3/4 bg-neutral-100 rounded" />
              <div className="h-7 w-1/2 bg-neutral-100 rounded" />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-100 rounded" />
              <div className="h-4 w-full bg-neutral-100 rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 rounded" />
            </div>

            {/* 태그 */}
            <div className="flex gap-1.5">
              <div className="h-6 w-16 bg-neutral-100 rounded-full" />
              <div className="h-6 w-20 bg-neutral-100 rounded-full" />
              <div className="h-6 w-14 bg-neutral-100 rounded-full" />
            </div>

            {/* 버튼 */}
            <div className="h-11 w-36 bg-neutral-100 rounded-xl" />

            {/* 관련 자료 */}
            <div className="pt-2 space-y-4">
              <div className="h-5 w-32 bg-neutral-100 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-100 bg-white p-4 space-y-2">
                    <div className="flex gap-1.5">
                      <div className="h-5 w-12 bg-neutral-100 rounded-full" />
                      <div className="h-5 w-10 bg-neutral-100 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-neutral-100 rounded" />
                    <div className="h-3 w-4/5 bg-neutral-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 메타 카드 */}
          <div className="lg:col-span-1 animate-pulse">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-neutral-100 rounded" />
                  <div className="h-5 w-14 bg-neutral-100 rounded-full" />
                </div>
              ))}
              <div className="pt-3 border-t border-neutral-100">
                <div className="h-4 w-32 bg-neutral-100 rounded" />
              </div>
            </div>
            <div className="mt-3 h-10 w-full bg-neutral-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
