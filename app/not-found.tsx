import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-6xl font-bold text-neutral-100">404</p>
      <p className="text-lg font-semibold text-neutral-800 mt-4">자료를 찾을 수 없어요</p>
      <p className="text-sm text-neutral-400 mt-2">삭제되었거나 잘못된 경로예요</p>
      <Link
        href="/"
        className="mt-6 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
