"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getAllSaved } from "@/lib/utils/loop-storage"
import { mockResources } from "@/lib/mock/resources"
import { ResourceCard } from "@/components/search/ResourceCard"

const CATEGORY_TABS = [
  { label: "전체", value: "all" },
  { label: "UX·UI", value: "ux-ui" },
  { label: "프론트엔드", value: "frontend" },
  { label: "AI·데이터", value: "ai-data" },
  { label: "생산성", value: "productivity" },
  { label: "디자인 툴", value: "design-tool" },
]

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-neutral-100 h-64 animate-pulse" />
      ))}
    </div>
  )
}

function EmptyNoSaves() {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400" aria-hidden="true">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className="text-neutral-500 font-medium mb-1">아직 저장된 자료가 없어요</p>
      <p className="text-sm text-neutral-400 mb-6">마음에 드는 자료를 저장하고 나만의 루프를 만들어보세요</p>
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
      >
        자료 탐색하기
      </Link>
    </div>
  )
}

function EmptyFiltered({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-20">
      <p className="text-neutral-400 text-sm mb-4">이 카테고리에 저장된 자료가 없어요</p>
      <button
        type="button"
        onClick={onReset}
        className="text-sm text-primary hover:underline font-medium"
      >
        전체 보기
      </button>
    </div>
  )
}

export default function MyLoopPage() {
  const [mounted, setMounted] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    setSavedIds(getAllSaved())
    setMounted(true)

    function onUpdate() {
      setSavedIds(getAllSaved())
    }
    window.addEventListener("loopin-loop-updated", onUpdate)
    return () => window.removeEventListener("loopin-loop-updated", onUpdate)
  }, [])

  const savedResources = mockResources.filter((r) => savedIds.includes(r.id))

  const filtered =
    activeCategory === "all"
      ? savedResources
      : savedResources.filter((r) => r.category === activeCategory)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">My Loop</h1>
          {mounted && savedResources.length > 0 && (
            <p className="text-sm text-neutral-500 mt-1">
              {savedResources.length}개의 자료를 저장했어요
            </p>
          )}
        </div>

        {!mounted ? (
          <SkeletonGrid />
        ) : savedResources.length === 0 ? (
          <EmptyNoSaves />
        ) : (
          <>
            {/* 카테고리 탭 */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORY_TABS.map((tab) => {
                const count =
                  tab.value === "all"
                    ? savedResources.length
                    : savedResources.filter((r) => r.category === tab.value).length
                if (tab.value !== "all" && count === 0) return null
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveCategory(tab.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === tab.value
                        ? "bg-primary text-white"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 text-xs ${
                          activeCategory === tab.value ? "opacity-80" : "text-neutral-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 그리드 or 빈 상태 */}
            {filtered.length === 0 ? (
              <EmptyFiltered onReset={() => setActiveCategory("all")} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
