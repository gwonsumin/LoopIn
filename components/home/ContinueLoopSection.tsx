"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContinueLoopProgress } from "@/lib/mock/user-progress"

// ── 상대 시간 ─────────────────────────────────────────────────────────────
function getRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days === 1) return "어제"
  return `${days}일 전`
}

// ── 뱃지 매핑 ─────────────────────────────────────────────────────────────
const TYPE_BADGE: Record<string, string> = {
  article: "bg-blue-50 text-blue-700",
  video: "bg-purple-50 text-purple-700",
  docs: "bg-green-50 text-green-700",
  lecture: "bg-pink-50 text-pink-700",
  practice: "bg-orange-50 text-orange-700",
}
const TYPE_LABEL: Record<string, string> = {
  article: "아티클",
  video: "영상",
  docs: "문서",
  lecture: "강의",
  practice: "실습",
}

const LEVEL_BADGE: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-yellow-50 text-yellow-700",
  advanced: "bg-red-50 text-red-700",
  practical: "bg-neutral-100 text-neutral-600",
}
const LEVEL_LABEL: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
  practical: "실전",
}

// ── 원형 프로그레스 ──────────────────────────────────────────────────────
const R = 44
const CIRC = 2 * Math.PI * R // ≈ 276.46

function CircleProgress({ percent }: { percent: number }) {
  const offset = CIRC * (1 - percent / 100)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* 배경 링 */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="6"
          />
          {/* 진행 링 */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#F96A84"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#F96A84] leading-none">
            {percent}%
          </span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 text-center leading-relaxed">
        완료
      </p>
    </div>
  )
}

// ── 추천 카드 ─────────────────────────────────────────────────────────────
function NextResourceCard({
  resource,
}: {
  resource: ContinueLoopProgress["nextResources"][number]
}) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group block rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* 상단: 유형 뱃지 + 시간 */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
            TYPE_BADGE[resource.type]
          )}
        >
          {TYPE_LABEL[resource.type]}
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="h-3 w-3" />
          {resource.estimatedMinutes}분
        </span>
      </div>

      {/* 제목 */}
      <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-4 leading-snug">
        {resource.title}
      </p>

      {/* 하단: 난이도 뱃지 + 시작 링크 */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
            LEVEL_BADGE[resource.level]
          )}
        >
          {LEVEL_LABEL[resource.level]}
        </span>
        <span className="flex items-center gap-0.5 text-xs font-medium text-[#F96A84] group-hover:gap-1.5 transition-all">
          시작하기
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

// ── 메인 섹션 ─────────────────────────────────────────────────────────────
interface Props {
  progress: ContinueLoopProgress
}

export default function ContinueLoopSection({ progress }: Props) {
  const { currentFlow, progressPercent, completedResourceIds, nextResources, lastAccessedAt } =
    progress

  if (progressPercent === 0 || completedResourceIds.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-neutral-50 px-8 py-10 text-center">
          <p className="text-sm text-neutral-400">아직 시작한 플로우가 없어요</p>
          <Link href="/search" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            학습 플로우 탐색하기 →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-neutral-50/60 rounded-3xl px-6 py-8 md:px-8 md:py-10">

        {/* 상단: 텍스트 + 진행률 링 */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] lg:grid-cols-[7fr_3fr] gap-6 md:gap-10 mb-8">

          {/* 왼쪽: 텍스트 블록 */}
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F96A84]/10 text-[#F96A84] text-xs font-medium">
              이어 학습하기
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              {currentFlow.title}
            </h2>
            <p className="text-sm text-neutral-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              마지막 학습:{" "}
              <time dateTime={lastAccessedAt}>
                {getRelativeTime(lastAccessedAt)}
              </time>
            </p>
            <div className="pt-1">
              <Link
                href="/my-loop"
                className="inline-flex items-center gap-1.5 px-5 h-10 rounded-full bg-[#F96A84] hover:bg-[#E84D6A] text-white text-sm font-medium shadow-sm transition-colors"
              >
                학습 이어가기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 오른쪽: 진행률 링 */}
          <div className="flex flex-col items-center justify-center gap-1">
            <CircleProgress percent={progressPercent} />
            <p className="text-xs text-neutral-500 text-center">
              {completedResourceIds.length} / {currentFlow.totalResources} 완료
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-neutral-200/60 mb-6" />

        {/* 하단: 추천 카드 3개 */}
        <div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
            다음 학습 자료
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nextResources.map((r) => (
              <NextResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
