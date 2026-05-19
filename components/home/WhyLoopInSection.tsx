import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"

const BEFORE_ITEMS = [
  "😫 자료가 유튜브·블로그·PDF에 흩어져 있음",
  "🔍 다시 찾으려면 처음부터 검색",
  "📚 수준에 맞는 자료인지 판단하기 어려움",
  "⏸ 어디까지 봤는지 기억이 안 남",
]

const AFTER_ITEMS = [
  "✅ 한 곳에서 검색·필터·저장",
  "🔖 My Loop에서 언제든 다시 탐색",
  "🎯 난이도·유형 필터로 딱 맞는 자료 발견",
  "🔄 학습 흐름이 끊기지 않음",
]

export default function WhyLoopInSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 섹션 헤더 */}
      <div className="flex flex-col items-center text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-[#F96A84]/10 text-[#F96A84] text-xs font-medium">
          왜 LoopIn인가요?
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">
          흩어진 학습, 이제 하나로
        </h2>
        <p className="text-sm text-neutral-500 max-w-md">
          유튜브, 블로그, PDF... 자료는 많은데 정작 학습은 이어지지 않으셨나요?
        </p>
      </div>

      {/* Before / Arrow / After */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-10">

        {/* Before 카드 */}
        <div className="flex-1 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <span className="inline-block px-3 py-1 rounded-full bg-neutral-200 text-neutral-500 text-xs font-bold">
            Before
          </span>
          <p className="text-base font-semibold text-neutral-600 mt-3">
            지금의 학습
          </p>
          <ul className="mt-3 space-y-2">
            {BEFORE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-500">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 화살표 */}
        <div className="shrink-0 text-[#F96A84]">
          <ArrowRight className="hidden md:block h-6 w-6" />
          <ArrowDown className="block md:hidden h-6 w-6" />
        </div>

        {/* After 카드 */}
        <div className="flex-1 w-full rounded-2xl border border-[#F96A84]/20 bg-[#F96A84]/5 p-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F96A84]/15 text-[#F96A84] text-xs font-bold">
            After
          </span>
          <p className="text-base font-semibold text-neutral-800 mt-3">
            LoopIn으로 학습
          </p>
          <ul className="mt-3 space-y-2">
            {AFTER_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 하단 CTA */}
      <div className="flex justify-center mt-10">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F96A84] hover:bg-[#E84D6A] text-white font-medium transition-colors"
        >
          지금 탐색 시작하기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
