"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Resource } from "@/lib/types"

interface ProgressData {
  status: 'not_started' | 'started' | 'completed'
  percent: number
  updatedAt: string
}

const TYPE_LABEL: Record<string, string> = {
  article: "아티클",
  video: "영상",
  docs: "문서",
  lecture: "강의",
  practice: "실습",
}

const DURATION_BY_TYPE: Record<string, string> = {
  article: "15분",
  video: "22분",
  docs: "10분",
  lecture: "30분",
  practice: "25분",
}

// SVG donut chart — no external library
function DonutChart({ percent }: { percent: number }) {
  const size = 140
  const strokeWidth = 12
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - percent / 100)

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F96A84"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-neutral-900">{percent}%</span>
        <span className="text-xs text-[#F96A84] font-medium mt-0.5">진행중</span>
      </div>
    </div>
  )
}

function StepProgress({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-start gap-1 flex-wrap">
      {steps.map((step, i) => {
        const isDone = i < currentStep
        const isCurrent = i === currentStep
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              {isDone ? (
                <div className="w-8 h-8 rounded-full bg-[#F96A84] flex items-center justify-center shrink-0">
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                    <path d="M1 5L4.5 8.5L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="w-8 h-8 rounded-full border-2 border-[#F96A84] text-[#F96A84] flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-neutral-200 text-neutral-300 flex items-center justify-center text-sm shrink-0">
                  {i + 1}
                </div>
              )}
              <span className={cn("text-[10px] text-center whitespace-nowrap", isCurrent ? "font-bold text-neutral-800" : "text-neutral-400")}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mb-5 shrink-0 opacity-30">
                <path d="M3 2L7 5L3 8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

function NextResourceRow({ resource, index, progressData }: { resource: Resource; index: number; progressData?: ProgressData }) {
  const router = useRouter()
  const thumbSrc = resource.thumbnail ?? `/images/resource-thumb-0${index + 1}.png`
  const duration = DURATION_BY_TYPE[resource.type] ?? "15분"

  function handleRestart() {
    localStorage.removeItem(`loopin-progress-${resource.id}`)
    router.push(`/resources/${resource.id}/learn`)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0">
      {/* Thumbnail */}
      <div className="shrink-0 w-16 h-11 rounded-lg overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Title + meta + progress */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 line-clamp-1 leading-snug">
          {resource.title}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {TYPE_LABEL[resource.type]} · {duration}
        </p>
        {progressData && progressData.percent > 0 && (
          <div className="mt-1.5 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-300"
              style={{ width: `${progressData.percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleRestart}
          className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 transition-colors whitespace-nowrap"
        >
          처음부터
        </button>
        <Link
          href={`/resources/${resource.id}/learn`}
          className="px-3 py-1.5 rounded-full bg-[#F96A84] text-xs font-medium text-white hover:bg-[#e85a74] transition-colors whitespace-nowrap"
        >
          이어보기
        </Link>
      </div>
    </div>
  )
}

interface Props {
  resources: Resource[]
}

export default function ContinueLoopSection({ resources }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, ProgressData>>({})

  useEffect(() => {
    const map: Record<string, ProgressData> = {}
    resources.forEach(r => {
      const raw = localStorage.getItem(`loopin-progress-${r.id}`)
      if (raw) {
        try { map[r.id] = JSON.parse(raw) } catch {}
      }
    })
    setProgressMap(map)
  }, [resources])

  if (resources.length === 0) return null

  const started = resources.filter(r => (progressMap[r.id]?.percent ?? 0) > 0)
  const avgPercent = started.length
    ? Math.round(started.reduce((s, r) => s + (progressMap[r.id]?.percent ?? 0), 0) / started.length)
    : 0

  const nextResources = [...resources]
    .sort((a, b) => {
      const pa = progressMap[a.id]
      const pb = progressMap[b.id]
      if (pa?.status === 'completed' && pb?.status !== 'completed') return 1
      if (pb?.status === 'completed' && pa?.status !== 'completed') return -1
      return (pb?.updatedAt ?? '').localeCompare(pa?.updatedAt ?? '')
    })
    .slice(0, 3)

  const flowTitle = "UX Portfolio Flow"
  const description = "실무에서 필요로 하는 포트폴리오를 단계적으로 완성해보세요."
  const steps = ["리서치", "케이스스터디", "UX Writing", "프로토타이핑", "포트폴리오 구성"]
  const currentStep = 2

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section header */}
      <div className="flex items-end justify-between mb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900">Continue Your Loop</h2>
          <p className="text-sm text-neutral-500">
            이어가고 있는 학습 흐름을 선택하고 계속 학습해보세요.
          </p>
        </div>
        <Link
          href="/my-loop"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-[#F96A84] transition-colors shrink-0 mb-0.5"
        >
          모두 보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main 3-panel card */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* ── Left panel: Donut chart ─────────────────────────── */}
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-8 lg:py-10 lg:w-56 lg:shrink-0 bg-neutral-50/60 border-b lg:border-b-0 lg:border-r border-neutral-100">
            <DonutChart percent={avgPercent} />
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              학습 진행률
            </p>
          </div>

          {/* ── Center panel: Flow info + Steps ─────────────────── */}
          <div className="flex flex-col justify-center px-6 py-8 lg:flex-1 border-b lg:border-b-0 lg:border-r border-neutral-100">
            <span className="self-start inline-block px-3 py-1 rounded-full bg-[#F96A84]/10 text-[#F96A84] text-xs font-medium mb-3">
              진행중인 플로우
            </span>
            <h3 className="text-lg font-bold text-neutral-900 mb-1 leading-snug">{flowTitle}</h3>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed break-keep">{description}</p>
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* ── Right panel: Next resources ─────────────────────── */}
          <div className="flex flex-col px-6 py-8 lg:w-[380px] lg:shrink-0">
            <p className="text-sm font-bold text-neutral-800 mb-1">다음 추천자료</p>
            <p className="text-xs text-neutral-400 mb-3">현재 스텝의 학습 자료를 이어보세요.</p>
            <div className="flex flex-col">
              {nextResources.map((r, i) => (
                <NextResourceRow key={r.id} resource={r} index={i} progressData={progressMap[r.id]} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
