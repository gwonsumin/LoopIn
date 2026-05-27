import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

const SLUG_ICON: Record<string, string> = {
  "ux-ui":       "/icons/figma.svg",
  frontend:      "/icons/code.svg",
  "ai-data":     "/icons/cpu.svg",
  productivity:  "/icons/folder.svg",
  "design-tool": "/icons/tool.svg",
}

// #F96A84(pink) 기준 hue-rotate로 각 accent 색상으로 보정
const ICON_FILTER: Record<string, string | undefined> = {
  "ux-ui":       undefined,                               // pink → as-is
  frontend:      "hue-rotate(231deg) saturate(1.3)",      // pink → blue
  "ai-data":     undefined,                               // cpu.svg 자체 purple
  productivity:  "hue-rotate(156deg) saturate(1.5)",      // pink → green
  "design-tool": "hue-rotate(52deg) saturate(1.2) brightness(1.1)", // pink → amber
}

const ICON_BG: Record<string, string> = {
  pink:   "bg-rose-50",
  blue:   "bg-blue-50",
  purple: "bg-purple-50",
  green:  "bg-emerald-50",
  yellow: "bg-amber-50",
}

const COUNT_BADGE: Record<string, string> = {
  pink:   "text-[#F96A84] bg-rose-50",
  blue:   "text-blue-500 bg-blue-50",
  purple: "text-purple-500 bg-purple-50",
  green:  "text-emerald-600 bg-emerald-50",
  yellow: "text-amber-500 bg-amber-50",
}

interface Props {
  categories: Category[]
}

export default function ExploreSection({ categories }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1.5">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
            <Image
              src="/icons/sparkle.svg"
              alt=""
              width={22}
              height={22}
              className="flex-shrink-0"
            />
            Explore by Interest
          </h2>
          <p className="text-sm text-neutral-400">
            관심 분야를 선택하고, 연결된 학습 흐름을 탐색해보세요.
          </p>
        </div>
        <Link href="/search" className="text-sm font-medium text-[#F96A84] hover:underline shrink-0 mb-0.5">
          전체 카테고리 보기 →
        </Link>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const iconSrc    = SLUG_ICON[cat.slug]   ?? "/icons/sparkle.svg"
          const iconBg     = ICON_BG[cat.accentColor]    ?? "bg-neutral-50"
          const badgeCls   = COUNT_BADGE[cat.accentColor] ?? "text-neutral-500 bg-neutral-50"
          const iconFilter = ICON_FILTER[cat.slug]

          return (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* 아이콘 + 자료 수 뱃지 */}
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                  <Image
                    src={iconSrc}
                    alt={cat.name}
                    width={32}
                    height={32}
                    className="object-contain"
                    style={iconFilter ? { filter: iconFilter } : undefined}
                  />
                </div>
                <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", badgeCls)}>
                  {cat.resourceCount.toLocaleString()}개 자료
                </span>
              </div>

              {/* 카테고리명 */}
              <p className="text-[15px] font-bold text-neutral-900 leading-snug">
                {cat.name}
              </p>

              {/* 설명 */}
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {cat.description}
              </p>

              {/* 화살표 */}
              <div className="flex justify-end mt-auto pt-4">
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#F96A84] transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

    </section>
  )
}
