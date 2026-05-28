"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import type { Resource } from "@/lib/types"
import { EmptyState } from "@/components/common/EmptyState"

interface ProgressData {
  status: "started" | "completed" | "not-started"
  percent: number
  updatedAt: string
}

const CATEGORY_ACCENT: Record<string, { label: string; color: string; badgeBg: string; badgeText: string }> = {
  "ux-ui":       { label: "UX·UI",     color: "#F96A84", badgeBg: "bg-pink-50",   badgeText: "text-pink-600" },
  "frontend":    { label: "프론트엔드", color: "#6366F1", badgeBg: "bg-indigo-50", badgeText: "text-indigo-600" },
  "ai-data":     { label: "AI·데이터", color: "#10B981", badgeBg: "bg-emerald-50", badgeText: "text-emerald-600" },
  "productivity":{ label: "생산성",    color: "#F59E0B", badgeBg: "bg-amber-50",  badgeText: "text-amber-600" },
  "design-tool": { label: "디자인 툴", color: "#8B5CF6", badgeBg: "bg-violet-50", badgeText: "text-violet-600" },
}

const RADIUS = 32
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function DonutChart({ percent, accentColor }: { percent: number; accentColor: string }) {
  const filled = (percent / 100) * CIRCUMFERENCE
  const gap = CIRCUMFERENCE - filled

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="#F3F4F6" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth="8"
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-neutral-900">{percent}%</span>
        <span className="text-[10px] text-neutral-400 leading-tight">진행 중</span>
      </div>
    </div>
  )
}

function ContinuingCard({ resource, percent }: { resource: Resource; percent: number }) {
  const accent = CATEGORY_ACCENT[resource.category]
  const accentColor = accent?.color ?? "#F96A84"
  const badgeBg = accent?.badgeBg ?? "bg-neutral-100"
  const badgeText = accent?.badgeText ?? "text-neutral-600"
  const categoryLabel = accent?.label ?? resource.category

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeBg} ${badgeText}`}>
          {categoryLabel}
        </span>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-neutral-300 hover:text-neutral-500 transition-colors"
          aria-label="더보기"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <p className="font-semibold text-neutral-900 text-sm leading-snug">{resource.title}</p>

      <div className="flex items-center gap-4">
        <DonutChart percent={percent} accentColor={accentColor} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-400 mb-1">학습 진행률</p>
          <p className="text-sm text-neutral-700 line-clamp-2 leading-snug">
            {resource.description}
          </p>
        </div>
      </div>

      <Link
        href={`/resources/${resource.id}/learn`}
        className="flex min-h-11 w-full items-center justify-center py-2 rounded-full border text-sm font-medium text-center transition-colors hover:opacity-80"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        이어보기
      </Link>
    </div>
  )
}

export function ContinuingSection({ resources }: { resources: Resource[] }) {
  const [progressMap, setProgressMap] = useState<Record<string, ProgressData>>({})

  useEffect(() => {
    const map: Record<string, ProgressData> = {}
    for (const r of resources) {
      const raw = localStorage.getItem(`loopin-progress-${r.id}`)
      if (raw) {
        try {
          map[r.id] = JSON.parse(raw) as ProgressData
        } catch {
          // ignore malformed entries
        }
      }
    }
    setProgressMap(map)
  }, [resources])

  const inProgress = resources
    .filter((r) => progressMap[r.id]?.status === "started")
    .sort((a, b) => {
      const aTime = progressMap[a.id]?.updatedAt ?? ""
      const bTime = progressMap[b.id]?.updatedAt ?? ""
      return bTime.localeCompare(aTime)
    })
    .slice(0, 3)

  if (inProgress.length === 0) {
    if (resources.length === 0) return null
    return (
      <section>
        <h2 className="text-lg font-bold text-neutral-900 mb-4">이어 학습 중</h2>
        <div className="rounded-2xl border border-neutral-100 bg-white">
          <EmptyState
            title="아직 이어 학습할 자료가 없어요"
            description="저장한 자료에서 학습을 시작하면 이곳에 진행 중인 자료가 표시돼요."
            actions={[{ label: "저장한 자료 보기", href: "#saved-resources", variant: "secondary" }]}
            className="py-10"
          />
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">이어 학습 중</h2>
        <Link
          href="/my-loop/continuing"
          className="inline-flex min-h-11 items-center text-sm text-neutral-400 hover:text-primary transition-colors"
        >
          전체 보기 &gt;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inProgress.map((r) => (
          <ContinuingCard key={r.id} resource={r} percent={progressMap[r.id]?.percent ?? 0} />
        ))}
      </div>
    </section>
  )
}
