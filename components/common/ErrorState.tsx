import Link from "next/link"
import type { ReactNode } from "react"

interface ErrorStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onRetry?: () => void
  homeHref?: string
  children?: ReactNode
  className?: string
}

export function ErrorState({
  title = "문제가 생겼어요",
  description = "잠시 후 다시 시도해주세요.",
  actionLabel = "다시 시도",
  onRetry,
  homeHref,
  children,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 py-16 ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F96A84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-neutral-800 font-semibold mb-1">{title}</p>
      <p className="text-sm text-neutral-400 leading-relaxed mb-6">{description}</p>
      <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
          >
            {actionLabel}
          </button>
        )}
        {homeHref && (
          <Link
            href={homeHref}
            className="inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
          >
            홈으로 이동
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}
