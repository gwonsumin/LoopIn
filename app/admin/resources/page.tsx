'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const CATEGORY_LABEL: Record<string, string> = {
  'ux-ui': 'UX·UI', frontend: '프론트엔드', 'ai-data': 'AI·데이터',
  productivity: '생산성', 'design-tool': '디자인 툴',
}
const LEVEL_LABEL: Record<string, string> = {
  beginner: '입문', intermediate: '중급', advanced: '고급', practical: '실무',
}

interface AdminResource {
  id: string
  title: string
  category: string
  level: string
  isFlagged: boolean
  savedCount: number
  createdAt: string
}

export default function AdminResourcesPage() {
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-resources', { q, flaggedOnly, page }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (flaggedOnly) params.set('flaggedOnly', 'true')
      params.set('page', String(page))
      const res = await fetch(`/api/admin/resources?${params}`)
      if (!res.ok) throw new Error('목록 조회 실패')
      return res.json() as Promise<{ data: AdminResource[]; total: number; totalPages: number; page: number }>
    },
    staleTime: 10_000,
  })

  async function handleUnflag(id: string) {
    await fetch('/api/admin/report', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId: id, isFlagged: false }),
    })
    qc.invalidateQueries({ queryKey: ['admin-resources'] })
  }

  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await fetch(`/api/resources/${id}`, { method: 'DELETE' })
    qc.invalidateQueries({ queryKey: ['admin-resources'] })
  }

  const resources = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">자료 관리</h1>

      {/* 필터 */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="제목 검색..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          className="border border-neutral-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:border-neutral-400"
        />
        <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => { setFlaggedOnly(e.target.checked); setPage(1) }}
            className="rounded"
          />
          신고된 자료만 보기
        </label>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50">
            <tr>
              {['제목', '카테고리', '난이도', '등록일', '신고', '액션'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">
                  자료가 없습니다.
                </td>
              </tr>
            ) : (
              resources.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 max-w-[240px]">
                    <span className="font-medium text-neutral-800 truncate block" title={r.title}>
                      {r.title.length > 40 ? r.title.slice(0, 40) + '…' : r.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs">
                      {CATEGORY_LABEL[r.category] ?? r.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs">
                      {LEVEL_LABEL[r.level] ?? r.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    {r.isFlagged ? (
                      <span className="text-red-500 text-xs font-medium">🚩 신고됨</span>
                    ) : (
                      <span className="text-neutral-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.isFlagged && (
                        <button
                          type="button"
                          onClick={() => handleUnflag(r.id)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                          신고 해제
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                p === page ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </>
  )
}
