"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Flow } from "@/lib/types"

const THEME = {
  pink: {
    chip:       "bg-pink-50 text-pink-500 border border-pink-200",
    imgBg:      "bg-pink-50",
    stepDone:   "bg-pink-500",
    stepCur:    "border-2 border-pink-500 text-pink-500",
    btn:        "border border-pink-300 text-pink-500 hover:bg-pink-50",
    ctaBg:      "bg-pink-500 hover:bg-pink-600",
    backBg:     "bg-pink-50",
    tagBorder:  "border-pink-200",
    tagText:    "text-pink-600",
    iconFilter: "icon-primary",
  },
  blue: {
    chip:       "bg-blue-50 text-blue-500 border border-blue-200",
    imgBg:      "bg-blue-50",
    stepDone:   "bg-blue-500",
    stepCur:    "border-2 border-blue-500 text-blue-500",
    btn:        "border border-blue-300 text-blue-500 hover:bg-blue-50",
    ctaBg:      "bg-blue-500 hover:bg-blue-600",
    backBg:     "bg-blue-50/60",
    tagBorder:  "border-blue-200",
    tagText:    "text-blue-600",
    iconFilter: "icon-blue",
  },
  green: {
    chip:       "bg-green-50 text-green-600 border border-green-200",
    imgBg:      "bg-green-50",
    stepDone:   "bg-green-500",
    stepCur:    "border-2 border-green-500 text-green-600",
    btn:        "border border-green-300 text-green-600 hover:bg-green-50",
    ctaBg:      "bg-green-500 hover:bg-green-600",
    backBg:     "bg-green-50/60",
    tagBorder:  "border-green-200",
    tagText:    "text-green-700",
    iconFilter: "icon-green",
  },
} as const

const TARGET_ICONS = ["/icons/user.svg", "/icons/folder.svg", "/icons/edit.svg"]

interface Props {
  flow: Flow
}

export default function FlowCard({ flow }: Props) {
  const router = useRouter()
  const [flipped, setFlipped] = useState(false)
  const t = THEME[flow.theme]

  return (
    <div style={{ perspective: "1000px" }} className="min-h-[640px] flex flex-col">
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          flex: "1",
          minHeight: "inherit",
        }}
      >
        {/* ─── 앞면 ──────────────────────────────────────────────── */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-3xl bg-white border border-neutral-100 shadow-md overflow-hidden min-h-[560px] flex flex-col p-6"
        >
          {/* 이미지 영역 */}
          <div className={`relative h-44 shrink-0 mb-5 rounded-2xl ${t.imgBg} overflow-hidden`}>
            <Image
              src={flow.image}
              alt={flow.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 456px"
              className="object-contain p-4"
            />
          </div>

          {/* 카테고리 칩 */}
          <span className={`self-start text-xs font-medium px-3 py-1 rounded-full mb-2 ${t.chip}`}>
            {flow.categoryLabel}
          </span>

          {/* 제목 */}
          <h3 className="text-xl font-bold text-neutral-900 mb-1 leading-snug break-keep">
            {flow.title}
          </h3>

          {/* 설명 */}
          <p className="text-sm text-neutral-500 mb-5 line-clamp-2 leading-relaxed break-keep">
            {flow.description}
          </p>

          {/* 스텝 진행 */}
          <div className="flex items-start gap-1 mb-5">
            {flow.cardSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  {step.status === "done" ? (
                    <div className={`w-9 h-9 rounded-full ${t.stepDone} flex items-center justify-center shrink-0`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icons/check.svg" alt="" width={16} height={16} className="brightness-0 invert" />
                    </div>
                  ) : step.status === "current" ? (
                    <div className={`w-9 h-9 rounded-full ${t.stepCur} flex items-center justify-center font-bold text-sm shrink-0`}>
                      {i + 1}
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-sm text-neutral-300 shrink-0">
                      {i + 1}
                    </div>
                  )}
                  <span className={`text-xs mt-1 text-center whitespace-nowrap ${step.status === "current" ? "font-bold text-neutral-800" : "text-neutral-400"}`}>
                    {step.label}
                  </span>
                </div>
                {i < flow.cardSteps.length - 1 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/icons/arrow.svg" alt="" width={12} height={12} className="mb-5 opacity-30 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* 메타 행 */}
          <div className="flex flex-row gap-2 mb-0 pt-4 border-t border-neutral-100">
            <span className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg px-2 py-1.5 whitespace-nowrap text-xs text-neutral-700">
              {flow.displayLevel}
              <span className={`w-1.5 h-1.5 rounded-full ${flow.levelColor === "green" ? "bg-emerald-400" : "bg-yellow-400"}`} />
            </span>
            <span className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg px-2 py-1.5 whitespace-nowrap text-xs text-neutral-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/file.svg" alt="" width={13} height={13} className="icon-muted" />
              {flow.totalResources}개 자료
            </span>
            <span className="inline-flex items-center gap-1 border border-neutral-200 rounded-lg px-2 py-1.5 whitespace-nowrap text-xs text-neutral-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/clock.svg" alt="" width={13} height={13} className="icon-muted" />
              {flow.estimatedTime}
            </span>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className={`mt-auto w-full rounded-xl py-3 text-sm font-medium transition-colors ${t.btn}`}
          >
            자세히 보기 →
          </button>
        </div>

        {/* ─── 뒷면 ──────────────────────────────────────────────── */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 rounded-3xl overflow-hidden ${t.backBg}`}
        >
          {/* p-5(20px) × 2 = 40px 수직 패딩, 나머지 634px 내 콘텐츠 */}
          <div className="h-full flex flex-col p-5 overflow-hidden">

            {/* 섹션1 */}
            <p className="text-sm font-bold text-neutral-800 mb-2">이 흐름은 이런 학습자에게 좋아요.</p>
            <div className="space-y-1.5">
              {flow.targetUsers.map((user, i) => (
                <div key={user} className="bg-white rounded-xl px-3 py-2 text-sm text-neutral-700 flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={TARGET_ICONS[i] ?? "/icons/user.svg"} alt="" width={15} height={15} className={t.iconFilter} />
                  {user}
                </div>
              ))}
            </div>

            {/* 섹션2 */}
            <p className="text-sm font-bold text-neutral-800 mt-4 mb-2">포함 자료 미리보기</p>
            <div className="space-y-1.5">
              {flow.previewResources.map((res) => (
                <div key={res.title} className="bg-white rounded-xl px-3 py-2 text-sm text-neutral-700 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res.icon} alt="" width={13} height={13} className="icon-muted" />
                    {res.title}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/movetopage.svg" alt="" width={13} height={13} className="icon-muted opacity-60 shrink-0" />
                </div>
              ))}
            </div>

            {/* 섹션3 */}
            <p className="text-sm font-bold text-neutral-800 mt-4 mb-2">완료 후 할 수 있는 것</p>
            <div className="space-y-1">
              {flow.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-center gap-2 text-sm text-neutral-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/check.svg" alt="" width={13} height={13} className={t.iconFilter} />
                  {outcome}
                </div>
              ))}
            </div>

            {/* 섹션4 */}
            <p className="text-sm font-bold text-neutral-800 mt-4 mb-2">추천 태그</p>
            <div className="flex flex-wrap gap-1.5">
              {flow.tags.map((tag) => (
                <span key={tag} className={`bg-white text-xs px-3 py-1 rounded-full border ${t.tagBorder} ${t.tagText}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA + 돌아가기 — 하단 고정 */}
            <div className="mt-auto pt-4">
              <button
                type="button"
                onClick={() => router.push(flow.ctaLink)}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white transition-colors ${t.ctaBg}`}
              >
                Flow 시작하기 →
              </button>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="w-full mt-3 py-2 text-xs text-neutral-400 text-center hover:text-neutral-600 transition-colors"
              >
                ← 앞면으로 돌아가기
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
