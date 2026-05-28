'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bookmark, Clock, FileText, BarChart2, User, CheckCircle2, Check } from "lucide-react"
import { useSession } from "next-auth/react"
import type { Flow } from "@/lib/types"
import { mockFlows } from "@/lib/mock/flows"
import { mockResources } from "@/lib/mock/resources"

// ── 테마 ──────────────────────────────────────────────────────────────────
const THEME = {
  pink: {
    badge:       "bg-pink-50 text-pink-600 border border-pink-200",
    accent:      "text-pink-600",
    accentBg:    "bg-pink-500 hover:bg-pink-600",
    stepDone:    "bg-pink-500 text-white",
    stepCurrent: "border-2 border-pink-500 text-pink-600 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-pink-200",
    tag:         "bg-pink-50 text-pink-600 border border-pink-100",
    sectionBg:   "bg-pink-50/50 border border-pink-100",
    checkColor:  "#ec4899",
    userIconBg:  "bg-pink-50",
  },
  blue: {
    badge:       "bg-blue-50 text-blue-600 border border-blue-200",
    accent:      "text-blue-600",
    accentBg:    "bg-blue-500 hover:bg-blue-600",
    stepDone:    "bg-blue-500 text-white",
    stepCurrent: "border-2 border-blue-500 text-blue-600 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-blue-200",
    tag:         "bg-blue-50 text-blue-600 border border-blue-100",
    sectionBg:   "bg-blue-50/50 border border-blue-100",
    checkColor:  "#3b82f6",
    userIconBg:  "bg-blue-50",
  },
  green: {
    badge:       "bg-green-50 text-green-700 border border-green-200",
    accent:      "text-green-700",
    accentBg:    "bg-green-500 hover:bg-green-600",
    stepDone:    "bg-green-500 text-white",
    stepCurrent: "border-2 border-green-500 text-green-700 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-green-200",
    tag:         "bg-green-50 text-green-700 border border-green-100",
    sectionBg:   "bg-green-50/50 border border-green-100",
    checkColor:  "#22c55e",
    userIconBg:  "bg-green-50",
  },
} as const

const HERO_BG: Record<string, string> = {
  pink:  "bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100",
  blue:  "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100",
  green: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100",
}

const TYPE_BADGE: Record<string, string> = {
  article:  "bg-blue-50 text-blue-700",
  video:    "bg-purple-50 text-purple-700",
  docs:     "bg-green-50 text-green-700",
  lecture:  "bg-pink-50 text-pink-700",
  practice: "bg-orange-50 text-orange-700",
}
const TYPE_LABEL: Record<string, string> = {
  article:  "아티클",
  video:    "영상",
  docs:     "문서",
  lecture:  "강의",
  practice: "실습",
}

// ── Component ─────────────────────────────────────────────────────────────
export function FlowClient({ flow }: { flow: Flow }) {
  const { data: session } = useSession()
  const SAVE_KEY = `loopin-saved-flow-${flow.id}`

  const [steps, setSteps] = useState(flow.steps)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/loops')
        .then(r => r.json())
        .then(() => setIsSaved(localStorage.getItem(SAVE_KEY) === 'true'))
        .catch(() => setIsSaved(localStorage.getItem(SAVE_KEY) === 'true'))
    } else {
      setIsSaved(localStorage.getItem(SAVE_KEY) === 'true')
    }
  }, [session, SAVE_KEY])

  async function handleSave() {
    if (isSaved) {
      localStorage.removeItem(SAVE_KEY)
      setIsSaved(false)
      window.dispatchEvent(new CustomEvent('loopin-loop-updated'))
      return
    }
    localStorage.setItem(SAVE_KEY, 'true')
    setIsSaved(true)
    window.dispatchEvent(new CustomEvent('loopin-loop-updated'))
  }

  useEffect(() => {
    let passedCurrent = false
    const computed = flow.steps.map(step => {
      const raw = localStorage.getItem(`loopin-progress-${step.resourceId}`)
      let progress: { status: string } | null = null
      try { if (raw) progress = JSON.parse(raw) } catch {}

      if (progress?.status === 'completed') {
        return { ...step, status: 'completed' as const }
      }
      if (!passedCurrent) {
        passedCurrent = true
        return { ...step, status: 'current' as const }
      }
      return { ...step, status: 'pending' as const }
    })
    setSteps(computed)
  }, [flow.steps])

  const t = THEME[flow.theme]
  const currentStep = steps.find((s) => s.status === "current")
  const relatedFlows = mockFlows.filter((f) => f.slug !== flow.slug).slice(0, 3)

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── 브레드크럼 ────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-neutral-400 mb-6">
          <Link href="/flows" className="hover:text-neutral-600 transition-colors">
            Learning Flows
          </Link>
          <span>/</span>
          <span className="text-neutral-600">{flow.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_288px] lg:gap-10">
          {/* ════════════════════════════════════════════════════════════
              왼쪽 콘텐츠
          ════════════════════════════════════════════════════════════ */}
          <div className="min-w-0">
            {/* ── Hero 카드 ─────────────────────────────────────────── */}
            <div className={`rounded-3xl p-8 mb-8 ${HERO_BG[flow.theme]}`}>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${t.badge}`}>
                {flow.categoryLabel} · {flow.displayLevel}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
                {flow.title}
              </h1>
              <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                {flow.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                  <Clock className="w-4 h-4" />
                  총 {flow.estimatedTime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                  <FileText className="w-4 h-4" />
                  자료 {flow.totalResources}개
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                  <BarChart2 className="w-4 h-4" />
                  난이도 {flow.displayLevel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                  <User className="w-4 h-4" />
                  {flow.targetUsers[0]}
                </span>
              </div>
            </div>

            {/* ── Progress Bar ──────────────────────────────────────── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-neutral-900">학습 흐름</h2>
                {currentStep && (
                  <span className={`text-sm font-medium ${t.accent}`}>
                    현재 {currentStep.order}단계 · {currentStep.title}
                  </span>
                )}
              </div>
              <div className="flex items-start">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-start flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          step.status === "completed"
                            ? t.stepDone
                            : step.status === "current"
                            ? t.stepCurrent
                            : t.stepPending
                        }`}
                      >
                        {step.status === "completed" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.order
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 text-center leading-tight ${
                          step.status === "pending"
                            ? "text-neutral-400"
                            : "font-medium text-neutral-800"
                        }`}
                      >
                        {step.order}. {step.title}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-none w-6 h-0.5 mt-[18px] ${t.connector}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 단계별 자료 섹션 ──────────────────────────────────── */}
            {steps.map((step) => {
              const primaryResource = mockResources.find((r) => r.id === step.resourceId)
              const relatedResources = mockResources
                .filter((r) => r.category === flow.category && r.id !== step.resourceId)
                .slice((step.order - 1) * 2, (step.order - 1) * 2 + 2)
              const stepResources = [
                ...(primaryResource ? [primaryResource] : []),
                ...relatedResources,
              ].slice(0, 3)

              return (
                <div key={step.id}>
                  {/* 섹션 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`text-xs font-bold ${t.accent}`}>{step.order}단계</span>
                      <span className="text-base font-bold text-neutral-900 ml-1.5">{step.title}</span>
                    </div>
                    {step.status === "completed" && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        완료
                      </span>
                    )}
                    {step.status === "current" && (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${t.badge}`}>
                        진행 중
                      </span>
                    )}
                    {step.status === "pending" && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">
                        예정
                      </span>
                    )}
                  </div>

                  {/* 자료 카드 그리드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {stepResources.map((r) => (
                      <Link
                        key={r.id}
                        href={`/resources/${r.id}`}
                        className="rounded-2xl bg-white border border-neutral-100 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col"
                      >
                        <span
                          className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[r.type] ?? ""}`}
                        >
                          {TYPE_LABEL[r.type] ?? r.type}
                        </span>
                        <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mt-2 leading-snug">
                          {r.title}
                        </p>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-1">
                          {r.description}
                        </p>
                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                          <Bookmark className="w-3.5 h-3.5 text-neutral-300" />
                          <span className="text-xs text-neutral-400">
                            {r.savedCount.toLocaleString()}명 저장
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* ── CTA 배너 ──────────────────────────────────────────── */}
            <div className={`rounded-2xl p-6 mb-10 text-center ${t.sectionBg}`}>
              <p className="font-bold text-neutral-900">
                이 플로우의 모든 자료를 한 번에 탐색하기
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {flow.totalResources}개의 관련 자료를 전체 목록으로 확인하고 탐색해보세요.
              </p>
              <Link
                href={flow.ctaLink}
                className={`inline-flex items-center gap-1.5 mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${t.accentBg}`}
              >
                전체 자료 탐색하기 →
              </Link>
            </div>

            {/* ── Related Flows ─────────────────────────────────────── */}
            <div>
              <h2 className="font-bold text-lg text-neutral-900 mb-4">이런 플로우도 추천해요</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedFlows.map((f) => {
                  const ft = THEME[f.theme]
                  return (
                    <Link
                      key={f.slug}
                      href={`/flows/${f.slug}`}
                      className="rounded-2xl bg-white border border-neutral-100 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ft.badge}`}>
                          {f.categoryLabel}
                        </span>
                        <span className={`text-xs font-medium ${ft.accent}`}>
                          {f.displayLevel === "입문" ? "입문 추천" : "실무 추천"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">{f.title}</p>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-1">{f.description}</p>
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            총 {f.estimatedTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {f.totalResources}개 자료
                          </span>
                        </div>
                        <span className="text-neutral-300 text-sm">→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              오른쪽 사이드바
          ════════════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* 저장 카드 */}
              <div className="rounded-2xl bg-white border border-neutral-100 p-5">
                <p className="font-semibold text-sm text-neutral-800">이 플로우 저장하기</p>
                <p className="text-xs text-neutral-400 mt-1">
                  나만의 학습 루프에 저장하고 언제든 다시 이어보세요.
                </p>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`mt-4 w-full rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    isSaved
                      ? 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      : `text-white ${t.accentBg}`
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? '저장됨' : 'My Loop에 저장'}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">127명이 저장했어요</p>
              </div>

              {/* 단계 목록 카드 */}
              <div className="rounded-2xl bg-white border border-neutral-100 p-5">
                <p className="font-semibold text-sm text-neutral-900 mb-3">플로우 한눈에 보기</p>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          step.status === "completed"
                            ? t.stepDone
                            : step.status === "current"
                            ? t.stepCurrent
                            : t.stepPending
                        }`}
                      >
                        {step.status === "completed" ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          step.order
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800">{step.title}</p>
                        <p className="text-xs text-neutral-400 truncate">
                          {flow.outcomes[i] ?? ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추천 대상 카드 */}
              <div className="rounded-2xl bg-white border border-neutral-100 p-5">
                <p className="font-semibold text-sm text-neutral-900 mb-3">이런 분께 추천해요</p>
                <div className="space-y-2.5">
                  {flow.targetUsers.map((user) => (
                    <div key={user} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accent}`} />
                      <span className="text-sm text-neutral-600">{user}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1.5">
                {flow.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2.5 py-1 rounded-full ${t.tag}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
