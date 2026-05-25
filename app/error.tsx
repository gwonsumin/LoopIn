'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F96A84"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-neutral-800 font-semibold mb-1">앗, 문제가 생겼어요</p>
      <p className="text-sm text-neutral-400 mb-6">
        일시적인 오류예요. 새로고침하면 대부분 해결돼요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
      >
        다시 시도
      </button>
    </div>
  )
}
