import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { mockFlows } from "@/lib/mock/flows"
import { mockResources } from "@/lib/mock/resources"

// ── 테마 ──────────────────────────────────────────────────────────────────
const THEME = {
  pink: {
    badge:       "bg-pink-50 text-pink-600 border border-pink-200",
    accent:      "text-pink-600",
    accentBg:    "bg-pink-500 hover:bg-pink-600",
    stepDone:    "bg-pink-500 text-white",
    stepCurrent: "border-2 border-pink-500 text-pink-600 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-pink-200",
    tag:         "bg-pink-50 text-pink-600 border border-pink-100",
    sectionBg:   "bg-pink-50/50 border border-pink-100",
    checkColor:  "#ec4899",
    userIconBg:  "bg-pink-50",
  },
  blue: {
    badge:       "bg-blue-50 text-blue-600 border border-blue-200",
    accent:      "text-blue-600",
    accentBg:    "bg-blue-500 hover:bg-blue-600",
    stepDone:    "bg-blue-500 text-white",
    stepCurrent: "border-2 border-blue-500 text-blue-600 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-blue-200",
    tag:         "bg-blue-50 text-blue-600 border border-blue-100",
    sectionBg:   "bg-blue-50/50 border border-blue-100",
    checkColor:  "#3b82f6",
    userIconBg:  "bg-blue-50",
  },
  green: {
    badge:       "bg-green-50 text-green-700 border border-green-200",
    accent:      "text-green-700",
    accentBg:    "bg-green-500 hover:bg-green-600",
    stepDone:    "bg-green-500 text-white",
    stepCurrent: "border-2 border-green-500 text-green-700 bg-white",
    stepPending: "border border-neutral-200 text-neutral-300 bg-white",
    connector:   "bg-green-200",
    tag:         "bg-green-50 text-green-700 border border-green-100",
    sectionBg:   "bg-green-50/50 border border-green-100",
    checkColor:  "#22c55e",
    userIconBg:  "bg-green-50",
  },
} as const

const TYPE_BADGE: Record<string, string> = {
  article:  "bg-blue-50 text-blue-700",
  video:    "bg-purple-50 text-purple-700",
  docs:     "bg-green-50 text-green-700",
  lecture:  "bg-pink-50 text-pink-700",
  practice: "bg-orange-50 text-orange-700",
}
const TYPE_LABEL: Record<string, string> = {
  article:  "아티클",
  video:    "영상",
  docs:     "문서",
  lecture:  "강의",
  practice: "실습",
}

// ── Static ────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return mockFlows.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const flow = mockFlows.find((f) => f.slug === slug)
  if (!flow) return {}
  return {
    title: `${flow.title} — LoopIn`,
    description: flow.description,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function FlowPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const flow = mockFlows.find((f) => f.slug === slug)
  if (!flow) notFound()

  const t = THEME[flow.theme]

  return (
    <div className="bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* 뒤로가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          홈으로
        </Link>

        {/* ── 헤더 ────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${t.badge}`}>
            {flow.categoryLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug mb-3">
            {flow.title}
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed mb-5">
            {flow.description}
          </p>

          {/* 메타 칩 */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-sm text-neutral-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {flow.estimatedTime}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-sm text-neutral-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {flow.totalResources}개 자료
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-sm text-neutral-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              {flow.displayLevel}
            </span>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2">
            {flow.tags.map((tag) => (
              <span key={tag} className={`text-xs px-3 py-1 rounded-full font-medium ${t.tag}`}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* ── 학습 단계 ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">학습 단계</h2>

          <div>
            {flow.steps.map((step, i) => {
              const resource = mockResources.find((r) => r.id === step.resourceId)
              const isLast = i === flow.steps.length - 1

              return (
                <div key={step.id} className="flex gap-4">
                  {/* 번호 + 연결선 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        step.status === "completed"
                          ? t.stepDone
                          : step.status === "current"
                          ? t.stepCurrent
                          : t.stepPending
                      }`}
                    >
                      {step.status === "completed" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        step.order
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[28px] my-1 rounded-full ${t.connector}`} />
                    )}
                  </div>

                  {/* 스텝 카드 */}
                  <div className={`flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                    <Link
                      href={`/resources/${step.resourceId}/learn`}
                      className="group flex items-start justify-between gap-3 bg-white rounded-2xl border border-neutral-100 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold mb-1 ${t.accent}`}>
                          STEP {step.order} · {step.title}
                        </p>
                        <p className="text-sm font-semibold text-neutral-800 leading-snug group-hover:text-primary transition-colors">
                          {resource?.title ?? "자료를 찾을 수 없어요"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {resource && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[resource.type]}`}>
                            {TYPE_LABEL[resource.type]}
                          </span>
                        )}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 group-hover:text-primary transition-colors shrink-0" aria-hidden="true">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 학습 후 성과 ──────────────────────────────────────────────── */}
        <section className={`rounded-2xl p-6 mb-5 ${t.sectionBg}`}>
          <h2 className="text-base font-bold text-neutral-900 mb-4">완료 후 할 수 있는 것</h2>
          <ul className="space-y-2.5">
            {flow.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-center gap-2.5 text-sm text-neutral-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ stroke: t.checkColor, flexShrink: 0 }}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 이런 분께 추천 ────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
          <h2 className="text-base font-bold text-neutral-900 mb-4">이런 분께 추천해요</h2>
          <ul className="space-y-2.5">
            {flow.targetUsers.map((user, i) => (
              <li key={user} className="flex items-center gap-2.5 text-sm text-neutral-700">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.userIconBg}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: t.checkColor }}>
                    {i === 0 ? (
                      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
                    ) : i === 1 ? (
                      <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></>
                    ) : (
                      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
                    )}
                  </svg>
                </div>
                {user}
              </li>
            ))}
          </ul>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            href={flow.ctaLink}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-colors ${t.accentBg}`}
          >
            관련 자료 탐색하기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
