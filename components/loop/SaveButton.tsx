"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { isSaved, toggleSaved } from "@/lib/utils/loop-storage"

interface SaveButtonProps {
  resourceId: string
  className?: string
}

function isObjectId(id: string) {
  return /^[0-9a-f]{24}$/i.test(id)
}

export function SaveButton({ resourceId, className = "" }: SaveButtonProps) {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const useApi = !!session?.user && isObjectId(resourceId)

  useEffect(() => {
    if (!mounted) setMounted(true)
    if (!useApi) {
      setSaved(isSaved(resourceId))
    }
  }, [resourceId, mounted, useApi])

  async function handleToggle() {
    if (loading) return
    setLoading(true)

    try {
      if (useApi) {
        if (saved) {
          await fetch(`/api/loops?resourceId=${resourceId}`, { method: "DELETE" })
          setSaved(false)
        } else {
          const res = await fetch("/api/loops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resourceId }),
          })
          if (res.ok || res.status === 409) setSaved(true)
        }
        window.dispatchEvent(new CustomEvent("loopin-loop-updated"))
      } else {
        const next = toggleSaved(resourceId)
        setSaved(next)
        window.dispatchEvent(new CustomEvent("loopin-loop-updated"))
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-400 bg-white ${className}`}
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
      disabled={loading}
      aria-pressed={saved}
      className={`flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
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
