import type { Metadata } from "next"
import Link from "next/link"
import { Clock, FileText } from "lucide-react"
import { mockFlows } from "@/lib/mock/flows"

export const metadata: Metadata = {
  title: "Learning Flows | LoopIn",
  description: "단계별로 설계된 학습 흐름을 탐색해보세요.",
}

const THEME_BADGE: Record<string, string> = {
  pink:  "bg-pink-50 text-pink-600 border border-pink-200",
  blue:  "bg-blue-50 text-blue-600 border border-blue-200",
  green: "bg-green-50 text-green-700 border border-green-200",
}
const THEME_ACCENT: Record<string, string> = {
  pink:  "text-pink-500",
  blue:  "text-blue-500",
  green: "text-green-600",
}
const THEME_BAR: Record<string, string> = {
  pink:  "bg-pink-400",
  blue:  "bg-blue-400",
  green: "bg-green-500",
}

export default function FlowsPage() {
  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Learning Flows</h1>
          <p className="text-sm text-neutral-500 mt-1">
            단계별로 설계된 학습 흐름을 탐색하고, 나만의 루프를 시작해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockFlows.map((flow) => (
            <Link
              key={flow.slug}
              href={`/flows/${flow.slug}`}
              className="group rounded-2xl bg-white border border-neutral-100 shadow-sm p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${THEME_BADGE[flow.theme]}`}>
                  {flow.categoryLabel}
                </span>
                <span className={`text-xs font-medium ${THEME_ACCENT[flow.theme]}`}>
                  {flow.displayLevel}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-base font-bold text-neutral-900 group-hover:text-primary transition-colors leading-snug">
                  {flow.title}
                </h2>
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {flow.description}
                </p>
              </div>

              <div className="flex gap-1.5">
                {flow.cardSteps.map((step) => (
                  <div key={step.label} className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className={`h-1.5 rounded-full ${
                      step.status === "done" ? THEME_BAR[flow.theme] :
                      step.status === "current" ? `${THEME_BAR[flow.theme]} opacity-40` :
                      "bg-neutral-100"
                    }`} />
                    <span className="text-[10px] text-neutral-400 truncate">{step.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {flow.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {flow.totalResources}개 자료
                  </span>
                </div>
                <span className="text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                  시작하기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
