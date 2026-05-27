import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { mockResources } from "@/lib/mock/resources"
import type { Resource } from "@/lib/types"
import { SaveButton } from "@/components/loop/SaveButton"
import { ReportButton } from "@/components/resource/ReportButton"
import { connectDB } from "@/lib/mongodb"
import { Resource as ResourceModel } from "@/lib/models/Resource"

function isObjectId(id: string) {
  return /^[0-9a-f]{24}$/i.test(id)
}

async function getResource(id: string): Promise<Resource | null> {
  if (isObjectId(id)) {
    try {
      await connectDB()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await ResourceModel.findById(id).lean() as any
      if (doc) {
        return {
          id: String(doc._id),
          title: doc.title,
          description: doc.description,
          category: doc.category,
          level: doc.level,
          type: doc.type,
          tags: doc.tags,
          thumbnail: doc.thumbnail,
          url: doc.url,
          savedCount: doc.savedCount,
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
        }
      }
    } catch {
      // DB 연결 실패 시 mock으로 폴백
    }
  }
  return mockResources.find((r) => r.id === id) ?? null
}

async function getRelated(resource: Resource): Promise<Resource[]> {
  if (isObjectId(resource.id)) {
    try {
      await connectDB()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docs = await ResourceModel.find({ category: resource.category, _id: { $ne: resource.id } }).limit(3).lean() as any[]
      return docs.map((doc: any) => ({
        id: String(doc._id),
        title: doc.title,
        description: doc.description,
        category: doc.category,
        level: doc.level,
        type: doc.type,
        tags: doc.tags,
        thumbnail: doc.thumbnail,
        url: doc.url,
        savedCount: doc.savedCount,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      }))
    } catch {
      // DB 실패 시 빈 배열
    }
  }
  return mockResources
    .filter((r) => r.category === resource.category && r.id !== resource.id)
    .slice(0, 3)
}

// ── 상수 ──────────────────────────────────────────────────────────────────
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
const CATEGORY_LABEL: Record<string, string> = {
  "ux-ui":       "UX·UI",
  frontend:      "프론트엔드",
  "ai-data":     "AI·데이터",
  productivity:  "생산성",
  "design-tool": "디자인 툴",
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const resource = await getResource(id)
  if (!resource) return {}
  return {
    title: `${resource.title} — LoopIn`,
    description: resource.description,
  }
}

// mock IDs만 정적 생성, DB IDs는 동적 처리 (dynamicParams 기본값 true)
export function generateStaticParams() {
  return mockResources.map((r) => ({ id: r.id }))
}

// ── RelatedCard ────────────────────────────────────────────────────────────
function RelatedCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}
        >
          {TYPE_LABEL[resource.type]}
        </span>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_BADGE[resource.level]}`}
        >
          {LEVEL_LABEL[resource.level]}
        </span>
      </div>
      <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-1 leading-snug group-hover:text-primary transition-colors">
        {resource.title}
      </p>
      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
        {resource.description}
      </p>
    </Link>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resource = await getResource(id)
  if (!resource) notFound()

  const related = await getRelated(resource)

  return (
    <div className="bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* 브레드크럼 */}
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          탐색으로 돌아가기
        </Link>

        {/* 2컬럼 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">

          {/* 좌측 — 본문 */}
          <div className="md:col-span-2 space-y-6">

            {/* 배지 + 제목 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}>
                  {TYPE_LABEL[resource.type]}
                </span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${LEVEL_BADGE[resource.level]}`}>
                  {LEVEL_LABEL[resource.level]}
                </span>
                <span className="text-xs text-neutral-400">
                  {CATEGORY_LABEL[resource.category]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 leading-snug">
                {resource.title}
              </h1>
            </div>

            {/* 설명 */}
            <p className="text-base text-neutral-600 leading-relaxed">
              {resource.description}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs px-3 py-1 bg-neutral-50 text-neutral-500 rounded-full border border-neutral-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* 바로가기 버튼 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href={`/resources/${resource.id}/learn`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors duration-200"
              >
                학습 시작하기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                원본 링크 열기 ↗
              </a>
            </div>

            {/* 관련 자료 */}
            {related.length > 0 && (
              <section className="pt-2">
                <h2 className="text-base font-semibold text-neutral-800 mb-4">
                  같은 카테고리 자료
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {related.map((r) => (
                    <RelatedCard key={r.id} resource={r} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 우측 — 메타 + 액션 */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-3">

              {/* 메타 정보 카드 */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">카테고리</span>
                  <span className="font-medium text-neutral-700">{CATEGORY_LABEL[resource.category]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">유형</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[resource.type]}`}>
                    {TYPE_LABEL[resource.type]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">난이도</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_BADGE[resource.level]}`}>
                    {LEVEL_LABEL[resource.level]}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex items-center gap-1.5 text-sm text-neutral-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{resource.savedCount.toLocaleString()}명이 저장했어요</span>
                </div>
              </div>

              {/* SaveButton */}
              <SaveButton resourceId={resource.id} className="w-full justify-center" />

              {/* 신고 버튼 */}
              <div className="flex justify-end">
                <ReportButton resourceId={resource.id} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
