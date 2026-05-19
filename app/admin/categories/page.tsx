'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface CategoryDoc {
  _id: string
  name: string
  slug: string
  description?: string
  order: number
}

const EMPTY = { name: '', slug: '', description: '', order: 0 }

export default function AdminCategoriesPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<CategoryDoc | null>(null)
  const [form, setForm] = useState(EMPTY)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: () => fetch('/api/categories').then((r) => r.json()) as Promise<CategoryDoc[]>,
  })

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
  }

  function startEdit(cat: CategoryDoc) {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', order: cat.order })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(EMPTY)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await fetch(`/api/categories/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    qc.invalidateQueries({ queryKey: ['categories-admin'] })
    cancelEdit()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    qc.invalidateQueries({ queryKey: ['categories-admin'] })
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">카테고리 관리</h1>

      <div className="flex gap-8 items-start">
        {/* 목록 */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-neutral-100 rounded animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-400">카테고리가 없습니다.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['이름', 'Slug', '순서', '액션'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-800">{cat.name}</td>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-neutral-400">{cat.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 등록/수정 폼 */}
        <div className="w-72 shrink-0 bg-white rounded-2xl border border-neutral-100 p-6">
          <h2 className="text-sm font-bold text-neutral-800 mb-4">
            {editing ? '카테고리 수정' : '카테고리 등록'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">이름</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Slug</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">설명 (선택)</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">순서</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-2 text-sm font-medium transition-colors"
              >
                {editing ? '저장' : '등록'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-sm text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
