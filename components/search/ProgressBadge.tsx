'use client'

import { useState, useEffect } from "react"

type Status = 'started' | 'completed' | null

export function ProgressBadge({ resourceId }: { resourceId: string }) {
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => {
    const val = localStorage.getItem(`loopin-progress-${resourceId}`)
    if (val === 'started' || val === 'completed') setStatus(val)
  }, [resourceId])

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        완료
      </span>
    )
  }

  if (status === 'started') {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <circle cx="12" cy="12" r="12" />
        </svg>
        학습 중
      </span>
    )
  }

  return null
}
