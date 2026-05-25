"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

const SUGGESTIONS = [
  { id: "1", title: "UX 포트폴리오", sub: "포트폴리오 흐름",  icon: "/icons/folder.svg"  },
  { id: "2", title: "React",        sub: "프론트엔드",        icon: "/icons/react.svg"   },
  { id: "3", title: "Figma",        sub: "디자인",            icon: "/icons/figma.svg"   },
  { id: "4", title: "AI 워크플로우", sub: "AI · 자동화",      icon: "/icons/sparkle.svg" },
  { id: "5", title: "Notion 활용",  sub: "생산성 · 자동화",  icon: "/icons/tool.svg"    },
]

const LS_KEY = "loopin_recent_searches"

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]")
  } catch {
    return []
  }
}

function saveRecent(list: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState<string[]>([])

  // mount 시 최근 검색어 불러오기
  useEffect(() => {
    if (isOpen) {
      setRecent(loadRecent())
      // 다음 틱에 포커스 (transition 후)
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
    }
  }, [isOpen])

  const handleSearch = (value = query) => {
    const trimmed = value.trim()
    if (!trimmed) return

    // 최근 검색어 저장 (중복 제거, 최대 10개)
    const updated = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 10)
    setRecent(updated)
    saveRecent(updated)

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    onClose()
  }

  const clearRecent = () => {
    setRecent([])
    saveRecent([])
  }

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 컨텐츠 카드 — 버블링 차단 */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl">

          {/* 타이틀 */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            무엇을 다시{" "}
            <span className="text-primary">이어가고</span>{" "}
            싶나요?
          </h2>

          {/* 검색 입력창 */}
          <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-4 py-2 focus-within:border-primary/40 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/header-search.svg" alt="" width={20} height={20} className="icon-muted shrink-0" />
            <input
              ref={inputRef}
              id="search-query"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
              placeholder="검색어를 입력하세요. (예 : React 상태관리, Figma Auto Layout...)"
              className="flex-1 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent min-w-0"
            />
            <button
              type="button"
              onClick={() => handleSearch()}
              aria-label="검색"
              className="shrink-0 w-8 h-8 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/arrow.svg" alt="" width={16} height={16} className="brightness-0 invert" />
            </button>
          </div>

          {/* 추천 탐색 */}
          <p className="text-sm font-bold text-neutral-800 mt-6 mb-3">추천 탐색</p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSearch(s.title)}
                className="flex-none rounded-2xl border border-neutral-100 bg-white p-4 min-w-[140px] text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" width={20} height={20} className="icon-primary" />
                </div>
                <p className="text-sm font-semibold text-neutral-800 mt-2">{s.title}</p>
                <p className="text-xs text-neutral-400">{s.sub}</p>
              </button>
            ))}
          </div>

          {/* 최근 검색어 */}
          {recent.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-neutral-800">최근 검색어</p>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  모두 지우기
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/trashbox.svg" alt="" width={14} height={14} className="icon-muted" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {recent.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleSearch(keyword)}
                    className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
