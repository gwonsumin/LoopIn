"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import FilterPanel, { type FilterSelected } from "@/components/search/FilterPanel"
import SortBar from "@/components/search/SortBar"
import { ResourceCard } from "@/components/search/ResourceCard"
import { EmptyState as CommonEmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"

const PAGE_SIZE = 12
const SUGGESTED_TAGS = ["UX리서치", "React", "Figma", "프롬프트엔지니어링", "생산성"]

// ── EmptyState ────────────────────────────────────────────────────────────
function SearchEmptyState({ q, hasFilters, onReset }: { q: string; hasFilters: boolean; onReset: () => void }) {
  return (
    <CommonEmptyState
      title={q ? `"${q}"에 맞는 자료가 없어요` : hasFilters ? "필터에 맞는 자료가 없어요" : "아직 보여줄 자료가 없어요"}
      description={hasFilters ? "선택한 필터를 초기화하거나 다른 키워드로 다시 찾아보세요." : "다른 키워드로 검색하거나 추천 태그를 눌러보세요."}
      actions={hasFilters ? [{ label: "필터 초기화", onClick: onReset }] : undefined}
    >
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <p className="w-full text-xs text-neutral-400 mb-1">이런 검색은 어때요?</p>
        {SUGGESTED_TAGS.slice(0, q ? 3 : 5).map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="inline-flex min-h-11 items-center text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </CommonEmptyState>
  )
}

// ── PaginationBar ─────────────────────────────────────────────────────────
function PaginationBar({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (page: number) => void
}) {
  const pages: (number | "…")[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push("…")
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push("…")
    pages.push(total)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="min-h-11 px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-neutral-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p as number)}
            className={`w-11 h-11 text-sm rounded-lg transition-colors ${
              p === current
                ? "bg-primary text-white"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="min-h-11 px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  )
}

// ── SearchFallback ────────────────────────────────────────────────────────
function SearchFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <div className="hidden md:block w-60 shrink-0 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="flex-1">
          <LoadingState rows={6} />
        </div>
      </div>
    </div>
  )
}

// ── SearchContent (useSearchParams 사용) ──────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [view, setView] = useState<"grid" | "list">("list")

  const q        = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const level    = searchParams.get("level") ?? ""
  const typeParam = searchParams.get("type") ?? ""
  const types    = typeParam ? typeParam.split(",").filter(Boolean) : []
  const sort     = searchParams.get("sort") ?? "latest"
  const page     = Math.max(1, Number(searchParams.get("page") ?? "1"))

  // URL 파라미터 업데이트 (page 항상 1 초기화)
  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, val] of Object.entries(updates)) {
      if (val) params.set(key, val)
      else params.delete(key)
    }
    params.delete("page")
    router.replace(`/search?${params.toString()}`)
  }

  function handleFilterChange(key: string, value: string | string[]) {
    if (key === "types") {
      updateParams({ type: (value as string[]).join(",") })
    } else {
      updateParams({ [key]: value as string })
    }
  }

  function handleReset() {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    const qs = params.toString()
    router.replace(qs ? `/search?${qs}` : "/search")
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    router.replace(`/search?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── API 쿼리 ────────────────────────────────────────────────────────────
  const { data: result, isLoading, isError, refetch } = useQuery({
    queryKey: ["resources", { q, category, level, type: typeParam, sort, page }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (q)        params.set("q", q)
      if (category) params.set("category", category)
      if (level)    params.set("level", level)
      if (typeParam) params.set("type", typeParam)
      params.set("sort", sort)
      params.set("page", String(page))
      params.set("limit", String(PAGE_SIZE))
      const res = await fetch(`/api/resources?${params}`)
      if (!res.ok) throw new Error("검색 실패")
      return res.json() as Promise<{ data: import("@/lib/types").Resource[]; total: number; totalPages: number; page: number }>
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })

  const total      = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1
  const paginated  = result?.data ?? []

  const selected: FilterSelected = { category, level, types }
  const activeFilterCount =
    (category ? 1 : 0) + (level ? 1 : 0) + types.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* 헤더 */}
      <h1 className="text-xl font-bold text-neutral-900 mb-6">
        {q ? `"${q}" 검색 결과 ${total}개` : `전체 자료 ${total}개`}
      </h1>

      <div className="flex gap-8">
        {/* 데스크탑 FilterPanel */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="sticky top-24">
            <FilterPanel
              selected={selected}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </aside>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
          {/* 모바일 필터 버튼 */}
          <div className="md:hidden mb-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
                  />
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/tool.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="icon-muted"
                />
                {activeFilterCount > 0
                  ? `필터 (${activeFilterCount})`
                  : "필터"}
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[85vh] overflow-y-auto rounded-t-3xl px-6 pt-6"
              >
                <SheetHeader>
                  <SheetTitle>필터</SheetTitle>
                </SheetHeader>
                <div className="mt-2 pb-4">
                  <FilterPanel
                    selected={selected}
                    onChange={handleFilterChange}
                    onReset={handleReset}
                  />
                </div>
                <SheetFooter>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="w-full min-h-11 rounded-xl py-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
                  >
                    적용하기
                  </button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* SortBar */}
          <SortBar
            total={total}
            sort={sort}
            onSortChange={(v) => updateParams({ sort: v })}
            view={view}
            onViewChange={setView}
          />

          {/* 결과 or 빈 상태 */}
          {isLoading ? (
            <LoadingState rows={PAGE_SIZE} />
          ) : isError ? (
            <ErrorState
              title="검색 결과를 불러오지 못했어요"
              description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
              onRetry={() => { void refetch() }}
            />
          ) : total === 0 ? (
            <SearchEmptyState q={q} hasFilters={activeFilterCount > 0} onReset={handleReset} />
          ) : (
            <>
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col divide-y divide-neutral-100"}>
                {paginated.map((r) => (
                  <ResourceCard key={r.id} resource={r} view={view} />
                ))}
              </div>
              {totalPages > 1 && (
                <PaginationBar
                  current={page}
                  total={totalPages}
                  onChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page export ───────────────────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  )
}
