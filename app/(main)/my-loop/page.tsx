"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { ResourceCard } from "@/components/search/ResourceCard"
import { StatsRow } from "@/components/my-loop/StatsRow"
import { ContinuingSection } from "@/components/my-loop/ContinuingSection"
import { MyFlowsSection } from "@/components/my-loop/MyFlowsSection"
import { LearningHistory } from "@/components/my-loop/LearningHistory"
import type { Resource } from "@/lib/types"

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

function LoginPrompt() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <p className="text-neutral-800 font-semibold mb-2">로그인이 필요해요</p>
      <p className="text-sm text-neutral-400 mb-6">
        로그인하면 어디서든 내 Loop를 이어볼 수 있어요
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
      >
        로그인하기
      </Link>
    </div>
  )
}

function EmptyNoSaves() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
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
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className="text-neutral-500 font-medium mb-1">아직 저장한 자료가 없어요</p>
      <p className="text-sm text-neutral-400 mb-6">
        마음에 드는 자료를 저장하고 나만의 루프를 만들어보세요
      </p>
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

function ResourceGrid({ resources }: { resources: Resource[] }) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered =
    activeCategory === "all"
      ? resources
      : resources.filter((r) => r.category === activeCategory)

  if (resources.length === 0) return <EmptyNoSaves />

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? resources.length
              : resources.filter((r) => r.category === tab.value).length
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
  )
}

export default function MyLoopPage() {
  const { status } = useSession()
  const [inProgressCount, setInProgressCount] = useState(0)
  const [flowCount, setFlowCount] = useState(0)

  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["loops"],
    queryFn: () =>
      fetch("/api/loops").then((r) => r.json()) as Promise<{ data: Resource[] }>,
    enabled: status === "authenticated",
    staleTime: 30_000,
  })

  const resources = apiData?.data ?? []
  const isLoading = status === "loading" || (status === "authenticated" && apiLoading)

  useEffect(() => {
    const raw = localStorage.getItem("loopin-my-flows")
    if (raw) {
      try { setFlowCount(JSON.parse(raw).length) } catch {}
    }
  }, [])

  useEffect(() => {
    if (resources.length === 0) return
    let count = 0
    for (const r of resources) {
      const raw = localStorage.getItem(`loopin-progress-${r.id}`)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          if (data.status === "started") count++
        } catch {
          // ignore
        }
      }
    }
    setInProgressCount(count)
  }, [resources])

  return (
    <div className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Loop</h1>
          <p className="text-sm text-neutral-500 mt-1">
            저장한 자료들을 다시 탐색하고, 학습을 이어가세요.
          </p>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : status === "unauthenticated" ? (
          <LoginPrompt />
        ) : (
          <>
            <StatsRow savedCount={resources.length} inProgressCount={inProgressCount} flowCount={flowCount} />
            <ContinuingSection resources={resources} />
            <MyFlowsSection resources={resources} />
            <LearningHistory resources={resources} />

            {/* 최근 저장한 자료 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-900">최근 저장한 자료</h2>
              </div>
              <ResourceGrid resources={resources} />
            </section>
          </>
        )}
      </div>
    </div>
  )
}
