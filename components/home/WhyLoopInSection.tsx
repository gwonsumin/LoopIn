import Link from "next/link"
import { ArrowRight, Search, Bookmark, FolderOpen, Repeat } from "lucide-react"

// ── Before: chaos illustration ───────────────────────────────────────────────
function BeforeGraph() {
  return (
    <div className="flex-1 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/before-learning-chaos.svg"
        alt="흩어진 학습 도구들"
        className="w-full max-w-md object-contain"
      />
    </div>
  )
}

// ── After: flow diagram with large circles + dot connectors ──────────────────
const FLOW_STEPS = [
  { Icon: Search,     label: "탐색",     desc: "필요한 자료를 빠르게 발견"       },
  { Icon: Bookmark,   label: "저장",     desc: "마음에 드는 자료를 손쉽게 저장"  },
  { Icon: FolderOpen, label: "구조화",   desc: "나만의 방식으로 자료를 정리"     },
  { Icon: Repeat,     label: "이어 학습", desc: "끊기지 않고 학습을 이어가기"    },
]

function AfterFlowDiagram() {
  return (
    <div>
      {/* Circles + dot connectors row */}
      <div className="relative flex items-center justify-between">
        {/* Background line + dots: 3 segments between 4 circles, each [line][dot][line] */}
        <div className="absolute left-7 right-7 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {/* Segment 1 */}
          <div className="flex-1 h-px bg-violet-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 shrink-0" />
          <div className="flex-1 h-px bg-violet-200" />
          {/* Segment 2 */}
          <div className="flex-1 h-px bg-violet-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 shrink-0" />
          <div className="flex-1 h-px bg-violet-200" />
          {/* Segment 3 */}
          <div className="flex-1 h-px bg-violet-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 shrink-0" />
          <div className="flex-1 h-px bg-violet-200" />
        </div>

        {/* Step circles */}
        {FLOW_STEPS.map(({ Icon, label }) => (
          <div
            key={label}
            className="relative z-10 w-14 h-14 rounded-full bg-white border border-violet-200 flex items-center justify-center shrink-0"
          >
            <Icon className="w-7 h-7 text-violet-500" />
          </div>
        ))}
      </div>

      {/* Labels + sub-descriptions row */}
      <div className="flex justify-between mt-4">
        {FLOW_STEPS.map(({ label, desc }) => (
          <div key={label} className="w-16 text-center">
            <p className="text-sm font-bold text-neutral-800 leading-tight">{label}</p>
            <p className="text-[11px] text-neutral-500 mt-1 leading-snug break-keep">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function WhyLoopInSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section header */}
      <div className="flex items-end justify-between mb-7">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900">왜 LoopIn인가요?</h2>
          <p className="text-sm text-neutral-500">
            디지털 학습자의 탐색 경험을 더 풍부하고 연결되게 만들어요.
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-[#F96A84] transition-colors shrink-0 mb-0.5"
        >
          자세히 보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Before / After cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Before card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm flex flex-col">
          <span className="self-start px-3 py-1 rounded-full bg-neutral-200 text-neutral-500 text-xs font-bold">
            Before
          </span>
          <h3 className="text-base font-bold text-neutral-700 mt-3 mb-2">
            흩어진 자료, 끊기는 학습 흐름
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed mb-5">
            유튜브, 블로그, 노션, 커뮤니티를 오가며 반복되는 탐색 피로
          </p>
          <div className="flex-1 flex items-center">
            <BeforeGraph />
          </div>
        </div>

        {/* ── After card ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-violet-100 bg-[#F5F3FF] p-6 shadow-sm flex flex-col">
          <span className="self-start px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-bold">
            After
          </span>
          <h3 className="text-lg font-bold text-neutral-800 mt-3 mb-2">
            LoopIn 하나로 이어지는 학습 흐름
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            탐색부터 저장, 구조화, 이어 학습까지
            모든 과정이 자연스럽게 연결됩니다.
          </p>

          {/* Flow diagram */}
          <div className="bg-white rounded-2xl px-6 py-5 border border-violet-100">
            <AfterFlowDiagram />
          </div>

          {/* My Loop sub-card */}
          <Link
            href="/my-loop"
            className="group mt-4 flex items-center gap-3 bg-white rounded-xl p-4 border border-violet-100 hover:shadow-sm transition-shadow"
          >
            {/* Logo symbol */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-symbol.svg"
              alt="LoopIn"
              width={48}
              height={25}
              className="shrink-0"
            />

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-neutral-800">나만의 학습 아카이브</span>
                <span className="text-sm font-bold text-neutral-800">My Loop</span>
                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-medium">
                  내 자료
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 break-keep leading-snug">
                저장한 자료를 다시 탐색하고 자신만의 학습 흐름으로 이어보세요.
              </p>
            </div>

            {/* Arrow button */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-violet-600 transition-colors" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  )
}
