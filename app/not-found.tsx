import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 mb-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <p className="text-neutral-800 font-semibold mb-1">이 페이지는 없는 것 같아요</p>
      <p className="text-sm text-neutral-400 mb-6">
        주소가 바뀌었거나 삭제된 자료일 수 있어요
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
        >
          자료 탐색하기
        </Link>
      </div>
    </div>
  )
}
