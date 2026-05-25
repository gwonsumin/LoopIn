'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Resource } from "@/lib/types"

type ProgressStatus = 'not_started' | 'started' | 'completed'

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1)
    }
  } catch {
    // invalid URL
  }
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

export function LearnClient({ resource }: { resource: Resource }) {
  const storageKey = `loopin-progress-${resource.id}`
  const [status, setStatus] = useState<ProgressStatus>('not_started')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as ProgressStatus | null
    if (saved === 'completed') {
      setStatus('completed')
    } else {
      localStorage.setItem(storageKey, 'started')
      setStatus('started')
    }
  }, [storageKey])

  function handleComplete() {
    localStorage.setItem(storageKey, 'completed')
    setStatus('completed')
  }

  const youtubeId = resource.type === 'lecture' ? extractYouTubeId(resource.url) : null

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* 뒤로가기 */}
        <Link
          href={`/resources/${resource.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          자료 상세로 돌아가기
        </Link>

        <div className="space-y-6">

          {/* 제목 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}>
                {TYPE_LABEL[resource.type]}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {resource.title}
            </h1>
          </div>

          {/* 콘텐츠 */}
          {youtubeId ? (
            <div className="rounded-2xl overflow-hidden shadow-sm bg-black">
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
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-base text-neutral-600 leading-relaxed">
                {resource.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-neutral-50 text-neutral-500 rounded-full border border-neutral-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors duration-200"
              >
                외부 링크로 열기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}

          {/* 완료 상태 */}
          <div className="pt-2">
            {status === 'completed' ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                완료한 자료예요
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors duration-200"
              >
                완료하기
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
