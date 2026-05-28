"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { ResourceCard } from "@/components/search/ResourceCard"
import { StatsRow } from "@/components/my-loop/StatsRow"
import { ContinuingSection } from "@/components/my-loop/ContinuingSection"
import { MyFlowsSection } from "@/components/my-loop/MyFlowsSection"
import { LearningHistory } from "@/components/my-loop/LearningHistory"
import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
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
  return <LoadingState rows={3} />
}

function LoginPrompt() {
  return (
    <EmptyState
      title="로그인이 필요해요"
      description="로그인하면 저장한 자료와 이어 학습 중인 Loop를 한곳에서 확인할 수 있어요."
      actions={[{ label: "로그인하기", href: "/login" }]}
      className="min-h-[400px]"
    />
  )
}

function EmptyNoSaves() {
  return (
    <EmptyState
      title="아직 이어 학습할 자료가 없어요"
      description="마음에 드는 자료를 저장하면 My Loop에서 다시 이어볼 수 있어요."
      actions={[{ label: "자료 탐색하기", href: "/search" }]}
      className="min-h-[400px]"
    />
  )
}

function EmptyFiltered({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      title="이 카테고리에 저장된 자료가 없어요"
      description="전체 저장 자료로 돌아가 다른 자료를 확인해보세요."
      actions={[{ label: "전체 보기", onClick: onReset, variant: "secondary" }]}
    />
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
              className={`min-h-11 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
  const { data: session, status } = useSession()
  const [inProgressCount, setInProgressCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [flowCount, setFlowCount] = useState(0)

  const { data: apiData, isLoading: apiLoading, isError, refetch } = useQuery({
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
    let completed = 0
    for (const r of resources) {
      const raw = localStorage.getItem(`loopin-progress-${r.id}`)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          if (data.status === "started") count++
          if (data.status === "completed") completed++
        } catch {}
      }
    }
    setInProgressCount(count)
    setCompletedCount(completed)
  }, [resources])

  return (
    <div className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Loop</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {session?.user?.name ? `${session.user.name.split(' ')[0]}님의 ` : ''}학습 아카이브 —
              탐색하고 저장한 자료를 이어서 학습하세요.
            </p>
          </div>
          <Link href="/search" className="inline-flex min-h-10 items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0">
            <Search className="w-3.5 h-3.5" />
            자료 탐색하기
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : isError ? (
          <ErrorState
            title="My Loop를 불러오지 못했어요"
            description="저장한 자료 목록을 가져오는 중 문제가 생겼어요."
            onRetry={() => { void refetch() }}
          />
        ) : status === "unauthenticated" ? (
          <LoginPrompt />
        ) : (
          <>
            <StatsRow savedCount={resources.length} inProgressCount={inProgressCount} flowCount={flowCount} completedCount={completedCount} />
            <ContinuingSection resources={resources} />
            <MyFlowsSection resources={resources} />
            <LearningHistory resources={resources} />

            {/* 최근 저장한 자료 */}
            <section id="saved-resources">
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
