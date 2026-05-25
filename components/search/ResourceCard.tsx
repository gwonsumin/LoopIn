import Link from "next/link"
import { Bookmark } from "lucide-react"
import type { Resource } from "@/lib/types"
import { ProgressBadge } from "./ProgressBadge"

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
const LEVEL_BADGE: Record<string, string> = {
  beginner:     "bg-emerald-50 text-emerald-700",
  intermediate: "bg-yellow-50 text-yellow-700",
  advanced:     "bg-red-50 text-red-700",
  practical:    "bg-neutral-100 text-neutral-600",
}
const LEVEL_LABEL: Record<string, string> = {
  beginner:     "입문",
  intermediate: "중급",
  advanced:     "고급",
  practical:    "실무",
}
export const CATEGORY_LABEL: Record<string, string> = {
  "ux-ui":       "UX·UI",
  frontend:      "프론트엔드",
  "ai-data":     "AI·데이터",
  productivity:  "생산성",
  "design-tool": "디자인 툴",
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      {/* 상단: 유형 배지 + 진행 뱃지 + 저장 수 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}
          >
            {TYPE_LABEL[resource.type]}
          </span>
          <ProgressBadge resourceId={resource.id} />
        </div>
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Bookmark className="h-3 w-3" />
          {resource.savedCount.toLocaleString()}
        </span>
      </div>

      {/* 제목 */}
      <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-2 leading-snug">
        {resource.title}
      </p>

      {/* 설명 */}
      <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed flex-1">
        {resource.description}
      </p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded-full border border-neutral-100"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 하단: 난이도 + 카테고리 */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_BADGE[resource.level]}`}
        >
          {LEVEL_LABEL[resource.level]}
        </span>
        <span className="text-xs text-neutral-400">
          {CATEGORY_LABEL[resource.category] ?? resource.category}
        </span>
      </div>
    </Link>
  )
}
