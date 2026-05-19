'use client'

import { useState } from 'react'

export function ReportButton({ resourceId }: { resourceId: string }) {
  const [reported, setReported] = useState(false)

  async function handleReport() {
    await fetch(`/api/resources/${resourceId}/report`, { method: 'POST' })
    setReported(true)
  }

  if (reported) {
    return (
      <span className="text-xs text-neutral-400 px-3 py-2">신고되었습니다</span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleReport}
      className="border border-neutral-200 text-neutral-400 text-xs px-3 py-2 rounded-lg hover:border-red-200 hover:text-red-400 transition-colors"
    >
      신고
    </button>
  )
}
