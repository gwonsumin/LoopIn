'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import type { Resource } from "@/lib/types"

interface HistoryItem {
  resource: Resource
  percent: number
  status: 'started' | 'completed'
  updatedAt: string
}

export function LearningHistory({ resources }: { resources: Resource[] }) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const items: HistoryItem[] = []
    resources.forEach(r => {
      const raw = localStorage.getItem(`loopin-progress-${r.id}`)
      if (!raw) return
      try {
        const data = JSON.parse(raw)
        if ((data.percent ?? 0) > 0) {
          items.push({
            resource: r,
            percent: data.percent ?? 0,
            status: data.status,
            updatedAt: data.updatedAt ?? '',
          })
        }
      } catch {}
    })
    items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    setHistory(items)
  }, [resources])

  if (history.length === 0) {
    return (
      <section id="learning-history">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">학습 히스토리</h2>
        <div className="bg-white rounded-2xl border border-neutral-100 px-6 py-10 text-center">
          <p className="text-sm font-medium text-neutral-500">아직 학습 기록이 없어요</p>
          <p className="text-xs text-neutral-400 mt-1 mb-4">
            자료 상세 페이지에서 학습을 시작하면 여기에 기록이 쌓여요.
          </p>
          <Link
            href="/search"
            className="inline-flex min-h-10 items-center px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm font-medium transition-colors"
          >
            자료 탐색하러 가기
          </Link>
        </div>
      </section>
    )
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000 / 60)
    if (diff < 60) return `${diff}분 전`
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`
    return `${Math.floor(diff / 60 / 24)}일 전`
  }

  return (
    <section id="learning-history">
      <h2 className="text-lg font-bold text-neutral-900 mb-4">학습 히스토리</h2>
      <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
        {history.map(item => (
          <div key={item.resource.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4">
            {/* 상태 도트 */}
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              item.status === 'completed' ? 'bg-emerald-400' : 'bg-primary'
            }`} />

            {/* 정보 */}
            <div className="w-full flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 line-clamp-1">
                {item.resource.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.status === 'completed' ? 'bg-emerald-400' : 'bg-primary'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-400 shrink-0">{item.percent}%</span>
              </div>
            </div>

            {/* 날짜 + 링크 */}
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 shrink-0">
              <span className="text-xs text-neutral-400">{formatDate(item.updatedAt)}</span>
              <Link
                href={`/resources/${item.resource.id}/learn`}
                className="inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors text-xs"
              >
                {item.status === 'completed' ? '다시 보기' : '이어보기'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
