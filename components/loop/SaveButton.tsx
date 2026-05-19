"use client"

import { useState, useEffect } from "react"
import { isSaved, toggleSaved } from "@/lib/utils/loop-storage"

interface SaveButtonProps {
  resourceId: string
  className?: string
}

export function SaveButton({ resourceId, className = "" }: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  // hydration 방지: 클라이언트에서만 localStorage 읽기
  useEffect(() => {
    setSaved(isSaved(resourceId))
    setMounted(true)
  }, [resourceId])

  function handleToggle() {
    const next = toggleSaved(resourceId)
    setSaved(next)
    window.dispatchEvent(new CustomEvent("loopin-loop-updated"))
  }

  if (!mounted) {
    // 서버 렌더 시 placeholder — 레이아웃 shift 방지
    return (
      <button
        type="button"
        disabled
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-400 bg-white ${className}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        My Loop에 저장
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
        saved
          ? "border-primary bg-primary/5 text-primary"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-primary/40 hover:text-primary"
      } ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-all duration-200"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? "저장됨" : "My Loop에 저장"}
    </button>
  )
}
