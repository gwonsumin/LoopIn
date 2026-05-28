'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Resource } from "@/lib/types"
import { mockFlows } from "@/lib/mock/flows"

type ProgressStatus = 'not_started' | 'started' | 'completed'

interface ProgressData {
  status: ProgressStatus
  percent: number
  updatedAt: string
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v')
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
  } catch { /* invalid URL */ }
  return null
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
const LEVEL_BADGE: Record<string, string> = {
  beginner:     "bg-emerald-50 text-emerald-700",
  intermediate: "bg-yellow-50 text-yellow-700",
  advanced:     "bg-red-50 text-red-700",
  practical:    "bg-neutral-100 text-neutral-600",
}
const LEVEL_LABEL: Record<string, string> = {
  beginner:     "입문",
  intermediate: "중급",
  advanced:     "고급",
  practical:    "실무",
}

export function LearnClient({ resource, related }: { resource: Resource; related: Resource[] }) {
  const storageKey = `loopin-progress-${resource.id}`
  const relatedFlow = mockFlows.find(f => f.steps.some(s => s.resourceId === resource.id))

  const [status, setStatus] = useState<ProgressStatus>('not_started')
  const [percent, setPercent] = useState(0)
  const [nextResourceId, setNextResourceId] = useState<string | null>(null)
  const [currentFlowTitle, setCurrentFlowTitle] = useState<string | null>(null)

  const DEMO_VIDEO_ID = 'Tn6-PIqc4UM'
  const youtubeId = extractYouTubeId(resource.url) ?? DEMO_VIDEO_ID

  // Load persisted progress
  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      try {
        const data: ProgressData = JSON.parse(raw)
        setStatus(data.status)
        setPercent(data.percent)
        return
      } catch { /* malformed, ignore */ }
    }
    const initial: ProgressData = { status: 'started', percent: 0, updatedAt: new Date().toISOString() }
    localStorage.setItem(storageKey, JSON.stringify(initial))
    setStatus('started')
  }, [storageKey])

  // Time-based progress (1% per 3s ≈ 99% at ~5min)
  useEffect(() => {
    if (status === 'completed') return
    const timer = setInterval(() => {
      setPercent(prev => {
        const next = Math.min(prev + 1, 99)
        const data: ProgressData = { status: 'started', percent: next, updatedAt: new Date().toISOString() }
        localStorage.setItem(storageKey, JSON.stringify(data))
        return next
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [status, storageKey])

  // Custom Flow / 큐레이션 Flow에서 다음 자료 찾기
  useEffect(() => {
    // 1. 사용자 커스텀 Flow 확인
    const raw = localStorage.getItem("loopin-my-flows")
    if (raw) {
      try {
        const myFlows: { id: string; title: string; resourceIds: string[] }[] = JSON.parse(raw)
        const found = myFlows.find(f => f.resourceIds.includes(resource.id))
        if (found) {
          const idx = found.resourceIds.indexOf(resource.id)
          const next = found.resourceIds[idx + 1]
          if (next) {
            setNextResourceId(next)
            setCurrentFlowTitle(found.title)
            return
          }
        }
      } catch {}
    }

    // 2. 큐레이션 Flow(mockFlows) 확인
    const curatedFlow = mockFlows.find(f => f.steps.some(s => s.resourceId === resource.id))
    if (curatedFlow) {
      const step = curatedFlow.steps.find(s => s.resourceId === resource.id)
      const nextStep = curatedFlow.steps.find(s => s.order === (step?.order ?? 0) + 1)
      if (nextStep?.resourceId) {
        setNextResourceId(nextStep.resourceId)
        setCurrentFlowTitle(curatedFlow.title)
      }
    }
  }, [resource.id])

  function handleComplete() {
    const data: ProgressData = { status: 'completed', percent: 100, updatedAt: new Date().toISOString() }
    localStorage.setItem(storageKey, JSON.stringify(data))
    setStatus('completed')
    setPercent(100)
  }

  const displayPercent = status === 'completed' ? 100 : percent

  return (
    <>
      {/* SlimHeader */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/95 backdrop-blur border-b border-neutral-100 flex items-center px-4 gap-3">
        <Link
          href={`/resources/${resource.id}`}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          뒤로
        </Link>
        <p className="flex-1 text-sm font-medium text-neutral-800 truncate">{resource.title}</p>
        <div className="flex items-center gap-2 shrink-0">
          {currentFlowTitle && (
            <span className="hidden sm:block text-xs text-neutral-400 truncate max-w-[120px]">
              {currentFlowTitle}
            </span>
          )}
          <span className="text-xs text-neutral-400">{displayPercent}%</span>
          {status === 'completed' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              완료됨
            </span>
          ) : (
            <button
              onClick={handleComplete}
              className="px-3 py-1 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-medium transition-colors"
            >
              완료하기
            </button>
          )}
        </div>
      </header>

      {/* ProgressBar */}
      <div className="fixed top-14 left-0 w-full h-1 bg-neutral-800 z-40">
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${displayPercent}%` }}
        />
      </div>

      {/* Body */}
      <div className="pt-16 max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* 자료 메타 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}>
              {TYPE_LABEL[resource.type]}
            </span>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${LEVEL_BADGE[resource.level]}`}>
              {LEVEL_LABEL[resource.level]}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {resource.title}
          </h1>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-white/10 text-neutral-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        {youtubeId && (
          <div className="rounded-2xl overflow-hidden bg-black">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={resource.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* 완료 패널 */}
        {status === 'completed' && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">🎉 학습 완료!</p>
              {(currentFlowTitle ?? relatedFlow?.title) && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  이 자료는 <span className="text-primary">{currentFlowTitle ?? relatedFlow?.title}</span>의 일부예요
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {nextResourceId && (
                <Link
                  href={`/resources/${nextResourceId}/learn`}
                  className="px-4 py-2 rounded-xl bg-white text-primary border border-primary/30 hover:bg-primary/5 text-xs font-medium transition-colors"
                >
                  다음 자료로 →
                </Link>
              )}
              {relatedFlow && (
                <Link
                  href={`/flows/${relatedFlow.slug}`}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-medium transition-colors"
                >
                  Flow 이어가기
                </Link>
              )}
              <Link
                href="/my-loop"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                My Loop 보기
              </Link>
            </div>
          </div>
        )}

        {/* 다음 추천 자료 */}
        {related.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-neutral-300 mb-4">다음 추천 자료</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.id}`}
                  className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 p-4 hover:-translate-y-0.5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[r.type]}`}>
                      {TYPE_LABEL[r.type]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {r.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
