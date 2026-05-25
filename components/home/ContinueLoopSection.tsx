import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Resource } from "@/lib/types"

const TYPE_BADGE: Record<string, string> = {
  article: "bg-blue-50 text-blue-700",
  video: "bg-purple-50 text-purple-700",
  docs: "bg-green-50 text-green-700",
  lecture: "bg-pink-50 text-pink-700",
  practice: "bg-orange-50 text-orange-700",
}
const TYPE_LABEL: Record<string, string> = {
  article: "아티클",
  video: "영상",
  docs: "문서",
  lecture: "강의",
  practice: "실습",
}
const LEVEL_BADGE: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-yellow-50 text-yellow-700",
  advanced: "bg-red-50 text-red-700",
  practical: "bg-neutral-100 text-neutral-600",
}
const LEVEL_LABEL: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
  practical: "실전",
}

function SavedResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex flex-col justify-between min-h-[120px] rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
            TYPE_BADGE[resource.type]
          )}
        >
          {TYPE_LABEL[resource.type]}
        </span>
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
            LEVEL_BADGE[resource.level]
          )}
        >
          {LEVEL_LABEL[resource.level]}
        </span>
      </div>

      <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-4 leading-snug group-hover:text-primary transition-colors">
        {resource.title}
      </p>

      <div className="flex justify-end">
        <span className="flex items-center gap-0.5 text-xs font-medium text-[#F96A84] group-hover:gap-1.5 transition-all">
          바로가기
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

interface Props {
  resources: Resource[]
}

export default function ContinueLoopSection({ resources }: Props) {
  if (resources.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-neutral-50/60 rounded-3xl px-6 py-8 md:px-8 md:py-10">

        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F96A84]/10 text-[#F96A84] text-xs font-medium">
              이어 학습하기
            </span>
            <h2 className="text-xl font-bold text-neutral-900">최근 저장한 자료</h2>
          </div>
          <Link
            href="/my-loop"
            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-primary transition-colors mt-1"
          >
            전체 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resources.map((r) => (
            <SavedResourceCard key={r.id} resource={r} />
          ))}
        </div>

      </div>
    </section>
  )
}
