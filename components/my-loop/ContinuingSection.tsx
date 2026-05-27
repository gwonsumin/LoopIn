import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

interface ContinuingItem {
  category: string
  categoryColor: string
  title: string
  percent: number
  nextLabel: string
  nextTitle: string
  accentColor: string
}

const MOCK_CONTINUING: ContinuingItem[] = [
  {
    category: "React",
    categoryColor: "bg-blue-50 text-blue-600",
    title: "React 기초부터 실전까지",
    percent: 65,
    nextLabel: "다음 학습",
    nextTitle: "useState와 기본 Hook 이해하기",
    accentColor: "#6366F1",
  },
  {
    category: "Figma",
    categoryColor: "bg-green-50 text-green-600",
    title: "Figma Auto Layout 마스터",
    percent: 40,
    nextLabel: "다음 학습",
    nextTitle: "복잡한 레이아웃 구성하기",
    accentColor: "#10B981",
  },
  {
    category: "UX Research",
    categoryColor: "bg-orange-50 text-orange-600",
    title: "사용자 리서치 실무 가이드",
    percent: 20,
    nextLabel: "다음 학습",
    nextTitle: "인터뷰 질문지 작성법",
    accentColor: "#F59E0B",
  },
]

const RADIUS = 32
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function DonutChart({ percent, accentColor }: { percent: number; accentColor: string }) {
  const filled = (percent / 100) * CIRCUMFERENCE
  const gap = CIRCUMFERENCE - filled

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="8"
        />
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth="8"
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-neutral-900">{percent}%</span>
        <span className="text-[10px] text-neutral-400 leading-tight">진행 중</span>
      </div>
    </div>
  )
}

function ContinuingCard({ item }: { item: ContinuingItem }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5 flex flex-col gap-3">
      {/* 상단: 카테고리 + 더보기 */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.categoryColor}`}>
          {item.category}
        </span>
        <button
          type="button"
          className="text-neutral-300 hover:text-neutral-500 transition-colors"
          aria-label="더보기"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 제목 */}
      <p className="font-semibold text-neutral-900 text-sm leading-snug">{item.title}</p>

      {/* 도넛 + 다음 학습 */}
      <div className="flex items-center gap-4">
        <DonutChart percent={item.percent} accentColor={item.accentColor} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-400 mb-1">{item.nextLabel}</p>
          <p className="text-sm text-neutral-700 line-clamp-2 leading-snug">
            {item.nextTitle}
          </p>
        </div>
      </div>

      {/* 이어보기 버튼 */}
      <button
        type="button"
        className="w-full py-2 rounded-full border text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: item.accentColor, borderColor: item.accentColor }}
      >
        이어보기
      </button>
    </div>
  )
}

export function ContinuingSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">이어 학습 중</h2>
        <Link
          href="/my-loop/continuing"
          className="text-sm text-neutral-400 hover:text-primary transition-colors"
        >
          전체 보기 &gt;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_CONTINUING.map((item) => (
          <ContinuingCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  )
}
