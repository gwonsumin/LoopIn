'use client'
import { useState } from "react"
import { X } from "lucide-react"
import type { Resource } from "@/lib/types"

interface MyCustomFlow {
  id: string
  title: string
  resourceIds: string[]
  createdAt: string
}

const TYPE_LABEL: Record<string, string> = {
  article: "아티클", video: "영상", docs: "문서", lecture: "강의", practice: "실습",
}
const TYPE_BADGE: Record<string, string> = {
  article: "bg-blue-50 text-blue-700", video: "bg-purple-50 text-purple-700",
  docs: "bg-green-50 text-green-700", lecture: "bg-pink-50 text-pink-700",
  practice: "bg-orange-50 text-orange-700",
}

export function CreateFlowModal({
  resources,
  onClose,
  onSave,
}: {
  resources: Resource[]
  onClose: () => void
  onSave: (flow: MyCustomFlow) => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [title, setTitle] = useState("")

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function handleSave() {
    if (!title.trim() || selected.length === 0) return
    const flow: MyCustomFlow = {
      id: Date.now().toString(),
      title: title.trim(),
      resourceIds: selected,
      createdAt: new Date().toISOString(),
    }
    onSave(flow)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">나만의 Flow 만들기</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* resource list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          <p className="text-xs text-neutral-400 mb-3">저장한 자료에서 선택하세요 ({selected.length}개 선택됨)</p>
          {resources.map(r => {
            const idx = selected.indexOf(r.id)
            const isSelected = idx !== -1
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-neutral-100 bg-white hover:border-neutral-200"
                }`}
              >
                {/* 순서 번호 */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isSelected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
                }`}>
                  {isSelected ? idx + 1 : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 line-clamp-1">{r.title}</p>
                  <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full ${TYPE_BADGE[r.type]}`}>
                    {TYPE_LABEL[r.type]}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-neutral-100 space-y-3">
          <input
            type="text"
            placeholder="Flow 이름을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition"
          />
          <button
            onClick={handleSave}
            disabled={!title.trim() || selected.length === 0}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
          >
            Flow 저장하기
          </button>
        </div>
      </div>
    </div>
  )
}
