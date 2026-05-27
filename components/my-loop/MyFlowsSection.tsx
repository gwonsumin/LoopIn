import Link from "next/link"
import { Check } from "lucide-react"
import { mockFlows } from "@/lib/mock/flows"
import type { Flow } from "@/lib/types"

const THEME_COLOR: Record<string, string> = {
  pink:  "#F96A84",
  blue:  "#3B82F6",
  green: "#10B981",
}

function StepIcon({
  status,
  index,
  color,
}: {
  status: "done" | "current" | "pending"
  index: number
  color: string
}) {
  if (status === "done") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Check className="w-4 h-4" style={{ color }} />
      </div>
    )
  }
  if (status === "current") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}33` }}
      >
        <span className="text-xs font-semibold" style={{ color }}>
          {index + 1}
        </span>
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100">
      <span className="text-xs font-medium text-neutral-400">{index + 1}</span>
    </div>
  )
}

function FlowCard({ flow }: { flow: Flow }) {
  const color = THEME_COLOR[flow.theme] ?? "#F96A84"

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5">
      {/* 상단 행 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900 truncate mr-2">
          {flow.title}
        </p>
        <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full shrink-0">
          {flow.cardSteps.length}단계
        </span>
      </div>

      {/* 스텝 아이콘 행 */}
      <div className="flex items-start gap-1 mt-4">
        {flow.cardSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <StepIcon status={step.status} index={i} color={color} />
              <span className="text-[10px] text-neutral-400 text-center mt-1 w-10 leading-tight truncate">
                {step.label}
              </span>
            </div>
            {i < flow.cardSteps.length - 1 && (
              <span className="text-xs text-neutral-300 mb-4">→</span>
            )}
          </div>
        ))}
      </div>

      {/* 하단 행 */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
        <span className="text-xs text-neutral-500">{flow.totalResources}개 자료</span>
        <span className="text-xs text-neutral-400">업데이트: 2일 전</span>
      </div>
    </div>
  )
}

export function MyFlowsSection() {
  const flows = mockFlows.slice(0, 3)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">내 학습 Flow</h2>
        <Link
          href="/search?view=flows"
          className="text-sm text-neutral-400 hover:text-primary transition-colors"
        >
          전체 보기 &gt;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {flows.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}
      </div>
    </section>
  )
}
