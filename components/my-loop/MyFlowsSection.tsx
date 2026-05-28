'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, X } from "lucide-react"
import type { Resource } from "@/lib/types"
import { CreateFlowModal } from "./CreateFlowModal"

interface MyCustomFlow {
  id: string
  title: string
  resourceIds: string[]
  createdAt: string
}

// ── FlowDetailModal ────────────────────────────────────────────────────────
function FlowDetailModal({
  flow,
  resources,
  onClose,
}: {
  flow: MyCustomFlow
  resources: Resource[]
  onClose: () => void
}) {
  const flowResources = flow.resourceIds
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean) as Resource[]

  const [progressMap, setProgressMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const map: Record<string, number> = {}
    flow.resourceIds.forEach(id => {
      const raw = localStorage.getItem(`loopin-progress-${id}`)
      if (raw) {
        try { map[id] = JSON.parse(raw).percent ?? 0 } catch {}
      }
    })
    setProgressMap(map)
  }, [flow.resourceIds])

  const firstIncompleteId = flow.resourceIds.find(id => (progressMap[id] ?? 0) < 100)
  const startId = firstIncompleteId ?? flow.resourceIds[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">{flow.title}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{flow.resourceIds.length}개 자료</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* resource list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {flowResources.map((r, i) => {
            const pct = progressMap[r.id] ?? 0
            return (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  pct >= 100
                    ? "bg-emerald-100 text-emerald-600"
                    : pct > 0
                    ? "bg-primary/10 text-primary"
                    : "bg-neutral-100 text-neutral-400"
                }`}>
                  {pct >= 100 ? "✓" : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 line-clamp-1">{r.title}</p>
                  <div className="mt-1.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-[width] duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-neutral-400 shrink-0 w-8 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-neutral-100">
          <Link
            href={startId ? `/resources/${startId}/learn` : "/my-loop"}
            onClick={onClose}
            className="block w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium text-center transition-colors"
          >
            {firstIncompleteId ? "이어서 학습하기 →" : "처음부터 다시 학습하기 →"}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── CustomFlowCard ─────────────────────────────────────────────────────────
function CustomFlowCard({
  flow,
  resources,
  onSelect,
}: {
  flow: MyCustomFlow
  resources: Resource[]
  onSelect: (flow: MyCustomFlow) => void
}) {
  const flowResources = flow.resourceIds
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean) as Resource[]

  return (
    <div
      className="rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
      onClick={() => onSelect(flow)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(flow) }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900 truncate mr-2">{flow.title}</p>
        <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full shrink-0">
          {flow.resourceIds.length}개 자료
        </span>
      </div>

      <div className="space-y-1.5">
        {flowResources.slice(0, 2).map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <p className="text-xs text-neutral-600 line-clamp-1">{r.title}</p>
          </div>
        ))}
        {flowResources.length > 2 && (
          <p className="text-xs text-neutral-400 pl-6">+{flowResources.length - 2}개 더</p>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100">
        <p className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium text-center">
          자세히 보기 →
        </p>
      </div>
    </div>
  )
}

// ── MyFlowsSection ─────────────────────────────────────────────────────────
export function MyFlowsSection({ resources }: { resources: Resource[] }) {
  const [myFlows, setMyFlows] = useState<MyCustomFlow[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<MyCustomFlow | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("loopin-my-flows")
    if (raw) {
      try { setMyFlows(JSON.parse(raw)) } catch {}
    }
  }, [])

  function handleSave(flow: MyCustomFlow) {
    const updated = [flow, ...myFlows]
    setMyFlows(updated)
    localStorage.setItem("loopin-my-flows", JSON.stringify(updated))
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">내 학습 Flow</h2>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Flow 만들기
        </button>
      </div>

      {myFlows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-400 mb-3">아직 만든 Flow가 없어요</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 번째 Flow 만들기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myFlows.map(flow => (
            <CustomFlowCard
              key={flow.id}
              flow={flow}
              resources={resources}
              onSelect={setSelectedFlow}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateFlowModal
          resources={resources}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {selectedFlow && (
        <FlowDetailModal
          flow={selectedFlow}
          resources={resources}
          onClose={() => setSelectedFlow(null)}
        />
      )}
    </section>
  )
}
