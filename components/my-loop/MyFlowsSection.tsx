'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { Resource } from "@/lib/types"
import { CreateFlowModal } from "./CreateFlowModal"

interface MyCustomFlow {
  id: string
  title: string
  resourceIds: string[]
  createdAt: string
}

function CustomFlowCard({ flow, resources }: { flow: MyCustomFlow; resources: Resource[] }) {
  const flowResources = flow.resourceIds
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean) as Resource[]
  const firstId = flow.resourceIds[0]

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col gap-3">
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
        <Link
          href={firstId ? `/resources/${firstId}/learn` : "/my-loop"}
          className="block w-full py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium text-center transition-colors"
        >
          학습 시작하기 →
        </Link>
      </div>
    </div>
  )
}

export function MyFlowsSection({ resources }: { resources: Resource[] }) {
  const [myFlows, setMyFlows] = useState<MyCustomFlow[]>([])
  const [showModal, setShowModal] = useState(false)

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
            <CustomFlowCard key={flow.id} flow={flow} resources={resources} />
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
    </section>
  )
}
