import Link from "next/link"
import type { Flow } from "@/lib/types"
import FlowCard from "./FlowCard"
import RevealSection from "./RevealSection"

interface Props {
  flows: Flow[]
}

export default function LearningFlowsSection({ flows }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl px-5 py-8 sm:px-8 sm:py-12 shadow-sm border border-neutral-100">

        {/* 섹션 헤더 */}
        <RevealSection delay={0}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-neutral-900">Learning Flows</h2>
              <p className="text-sm text-neutral-500">
                목표에 맞는 학습 흐름을 선택하고, 연결된 자료들을 탐색해보세요.
              </p>
            </div>
            <Link
              href="/search?view=flows"
              className="shrink-0 self-start inline-flex min-h-11 items-center text-sm text-neutral-600 border border-neutral-200 rounded-full px-4 py-2 hover:bg-neutral-50 transition-colors"
            >
              모두 보기 →
            </Link>
          </div>
        </RevealSection>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow, index) => (
            <RevealSection key={flow.id} delay={index * 100}>
              <FlowCard flow={flow} />
            </RevealSection>
          ))}
        </div>

        {/* 하단 안내문 */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/sparkle.svg" alt="" width={14} height={14} className="icon-primary opacity-70" />
          <p className="text-xs text-neutral-400">
            각 흐름은 사용자의 학습 상황에 맞게 계속 업데이트됩니다.
          </p>
        </div>

      </div>
    </section>
  )
}
