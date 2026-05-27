import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { mockFlows } from "@/lib/mock/flows"

export const metadata: Metadata = {
  title: "Learning Flows | LoopIn",
  description: "단계별로 설계된 학습 흐름을 탐색해보세요.",
}

const ACCENT_BADGE: Record<string, string> = {
  pink:  "bg-pink-50 text-pink-600 border border-pink-200",
  blue:  "bg-blue-50 text-blue-600 border border-blue-200",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-200",
}

const ACCENT_ARROW: Record<string, string> = {
  pink:  "group-hover:text-pink-500",
  blue:  "group-hover:text-blue-500",
  green: "group-hover:text-emerald-500",
}

export default function FlowsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900">Learning Flows</h1>
        <p className="mt-2 text-neutral-500">
          단계별로 설계된 학습 흐름을 따라가며, 체계적으로 실력을 쌓아보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockFlows.map((flow) => {
          const badgeCls  = ACCENT_BADGE[flow.accentColor]  ?? "bg-neutral-50 text-neutral-600 border border-neutral-200"
          const arrowCls  = ACCENT_ARROW[flow.accentColor]  ?? "group-hover:text-neutral-500"

          return (
            <Link
              key={flow.slug}
              href={`/flows/${flow.slug}`}
              className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeCls}`}>
                  {flow.level === "practical" ? "실무" : flow.level === "beginner" ? "입문" : "중급"}
                </span>
                <span className="text-xs text-neutral-400">{flow.estimatedTime}</span>
              </div>

              <h2 className="text-base font-bold text-neutral-900 leading-snug mb-2">
                {flow.title}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed flex-1">
                {flow.description}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">{flow.totalResources}개 자료</span>
                <ArrowRight className={`w-4 h-4 text-neutral-300 transition-colors ${arrowCls}`} />
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
