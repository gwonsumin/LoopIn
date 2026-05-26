import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

const SLUG_ICON: Record<string, string> = {
  "ux-ui":       "/icons/figma.svg",
  frontend:      "/icons/code.svg",
  "ai-data":     "/icons/cpu.svg",
  productivity:  "/icons/tool.svg",
  "design-tool": "/icons/design.svg",
}

const ACCENT_BG: Record<string, string> = {
  pink:   "bg-pink-50",
  blue:   "bg-blue-50",
  purple: "bg-purple-50",
  green:  "bg-green-50",
  yellow: "bg-yellow-50",
}

interface Props {
  categories: Category[]
}

export default function ExploreSection({ categories }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 섹션 헤더 */}
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">
          Explore by Interest
        </h2>
        <p className="text-sm text-neutral-500">
          관심 분야를 선택하면, 연결된 학습 자료를 탐색해보세요.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const iconSrc = SLUG_ICON[cat.slug] ?? "/icons/sparkle.svg"
          const iconBg = ACCENT_BG[cat.accentColor] ?? "bg-neutral-50"

          return (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="group rounded-2xl border border-neutral-100 bg-white p-5 text-center transition-all duration-150 hover:bg-neutral-50 hover:shadow-sm hover:-translate-y-0.5"
            >
              {/* 아이콘 */}
              <div className="flex justify-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    iconBg
                  )}
                >
                  <Image
                    src={iconSrc}
                    alt={cat.name}
                    width={24}
                    height={24}
                    className="object-contain icon-muted"
                  />
                </div>
              </div>

              {/* 카테고리명 */}
              <p className="text-sm font-semibold text-neutral-800 mt-3">
                {cat.name}
              </p>

              {/* 자료 수 */}
              <p className="text-xs font-medium text-neutral-500 mt-1">
                {cat.resourceCount.toLocaleString()}개 자료
              </p>

              {/* 화살표 */}
              <div className="flex justify-center mt-3">
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#F96A84] transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <Link href="/search" className="text-sm font-medium text-primary hover:underline">
          전체 카테고리 보기 →
        </Link>
      </div>
    </section>
  )
}
