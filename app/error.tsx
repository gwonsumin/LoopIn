'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-lg font-semibold text-neutral-800">오류가 발생했습니다</p>
      <p className="text-sm text-neutral-400 mt-2">잠시 후 다시 시도해주세요</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-neutral-200 px-6 py-3 rounded-xl text-sm hover:bg-neutral-50 transition-colors"
      >
        다시 시도
      </button>
    </div>
  )
}
