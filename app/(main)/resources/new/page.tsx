"use client"

import { useState, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResourceCreateSchema, type ResourceCreateInput } from "@/lib/validations/resource"
import { mockResources } from "@/lib/mock/resources"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// ── 상수 ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "UX·UI", value: "ux-ui" },
  { label: "프론트엔드", value: "frontend" },
  { label: "AI·데이터", value: "ai-data" },
  { label: "생산성", value: "productivity" },
] as const

const LEVELS = [
  { label: "입문", value: "beginner" },
  { label: "초급", value: "intermediate" },
  { label: "중급", value: "advanced" },
  { label: "실무 활용", value: "practical" },
] as const

const TYPES = [
  { label: "강의", value: "lecture" },
  { label: "아티클", value: "article" },
  { label: "문서", value: "docs" },
  { label: "실습", value: "practice" },
  { label: "영상", value: "video" },
] as const

// ── SuccessView ────────────────────────────────────────────────────────────
function SuccessView({ newId, onReset }: { newId: string; onReset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto mt-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-neutral-900 mb-2">자료가 등록되었습니다!</h2>
      <p className="text-sm text-neutral-500 mb-8">공유해주셔서 감사해요 :)</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/resources/${newId}`}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
        >
          자료 보러 가기 →
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-600 hover:border-neutral-400 transition-colors"
        >
          계속 등록하기
        </button>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ResourceNewPage() {
  const router = useRouter()
  const [newId, setNewId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResourceCreateInput>({
    resolver: zodResolver(ResourceCreateSchema),
    defaultValues: { tags: [] },
  })

  const titleLen = watch("title")?.length ?? 0
  const descLen = watch("description")?.length ?? 0
  const urlVal = watch("url") ?? ""
  const tags = watch("tags") ?? []

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    e.preventDefault()
    const val = tagInput.trim()
    if (!val || tags.length >= 5 || tags.includes(val)) return
    setValue("tags", [...tags, val], { shouldValidate: true })
    setTagInput("")
  }

  function removeTag(tag: string) {
    setValue("tags", tags.filter((t) => t !== tag), { shouldValidate: true })
  }

  function onSubmit(data: ResourceCreateInput) {
    const id = `r-${Date.now()}`
    mockResources.unshift({
      id,
      title: data.title,
      description: data.description,
      url: data.url,
      category: data.category,
      level: data.level,
      type: data.type,
      tags: data.tags,
      savedCount: 0,
      createdAt: new Date().toISOString(),
    })
    setNewId(id)
  }

  function handleReset() {
    reset({ tags: [] })
    setTagInput("")
    setNewId(null)
  }

  if (newId) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4">
        <SuccessView newId={newId} onReset={handleReset} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-600 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-600">자료 등록</span>
        </nav>

        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-neutral-900 mt-6">자료 등록하기</h1>
        <p className="text-sm text-neutral-400 mt-1">학습에 도움이 되는 자료를 공유해주세요</p>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

          {/* 1. 제목 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-neutral-700">제목</label>
              <span className="text-xs text-neutral-400">{titleLen}/100</span>
            </div>
            <Input
              {...register("title")}
              placeholder="자료 제목을 입력하세요"
              className="h-10 w-full rounded-xl border-neutral-200 px-3 text-sm"
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* 2. 설명 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-neutral-700">설명</label>
              <span className="text-xs text-neutral-400">{descLen}/500</span>
            </div>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="어떤 내용을 다루는 자료인지 간단히 설명해주세요"
              className="w-full rounded-xl border-neutral-200 px-3 py-2.5 text-sm resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* 3. URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">링크</label>
            <div className="flex gap-2">
              <Input
                {...register("url")}
                placeholder="https://"
                className="flex-1 h-10 rounded-xl border-neutral-200 px-3 text-sm"
              />
              <button
                type="button"
                disabled={!urlVal}
                onClick={() => window.open(urlVal, "_blank")}
                className="border border-neutral-200 px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                확인
              </button>
            </div>
            {errors.url && (
              <p className="text-xs text-red-400 mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* 4. 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">카테고리</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => field.onChange(c.value)}
                      className={`border rounded-full px-4 py-2 text-sm cursor-pointer transition-colors ${
                        field.value === c.value
                          ? "bg-primary text-white border-primary"
                          : "border-neutral-200 text-neutral-600 hover:border-primary/30"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.category && (
              <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* 5. 난이도 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">난이도</label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => field.onChange(l.value)}
                      className={`border rounded-xl px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                        field.value === l.value
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.level && (
              <p className="text-xs text-red-400 mt-1">{errors.level.message}</p>
            )}
          </div>

          {/* 6. 자료 유형 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">자료 유형</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={`border rounded-full px-4 py-2 text-sm cursor-pointer transition-colors ${
                        field.value === t.value
                          ? "bg-primary text-white border-primary"
                          : "border-neutral-200 text-neutral-600 hover:border-primary/30"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-400 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* 7. 태그 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-neutral-700">태그</label>
              <span className="text-xs text-neutral-400">최대 5개</span>
            </div>
            <div className="border border-neutral-200 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-neutral-400 transition-colors bg-white">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-neutral-100 text-neutral-600 text-xs px-3 py-1 rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors leading-none"
                    aria-label={`${tag} 태그 제거`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "입력 후 Enter" : ""}
                  className="border-none outline-none text-sm bg-transparent min-w-[120px] flex-1 placeholder:text-neutral-400"
                />
              )}
            </div>
            {errors.tags && (
              <p className="text-xs text-red-400 mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-between pt-2 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "자료 등록하기"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
