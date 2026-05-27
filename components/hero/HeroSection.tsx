"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Bookmark, Play } from "lucide-react"

const SUGGESTED_TAGS = ["Figma Auto Layout", "React 상태관리", "Next.js 입문", "UX 포트폴리오", "ChatGPT 활용법"]

export function HeroSection() {
  const [q, setQ] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = q.trim()
    if (!trimmed) return
    router.push("/search?q=" + encodeURIComponent(trimmed))
  }

  return (
    <section className="bg-gradient-to-br from-[#F0EEFF] via-white to-white">
      <div className="min-h-[560px] md:min-h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-12">
        {/* 좌측 콘텐츠 */}
        <div className="flex-1 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-neutral-900 leading-tight tracking-tight whitespace-pre-line">
            {"탐색하고, 저장하고,\n다시 "}
            <span className="text-[#F96A84]">이어가는</span>
            {" 학습 경험"}
          </h1>

          <p className="mt-5 text-base md:text-lg text-neutral-500 leading-relaxed">
            흩어진 디지털 직무 학습 자료를 더 빠르게 발견하고 이어 학습하세요.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl flex items-center bg-white rounded-2xl shadow-md border border-neutral-100 px-5 py-4 gap-3">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="무엇을 배우고 싶으신가요?"
              className="flex-1 text-base text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-[#7C6FF7] flex items-center justify-center shrink-0 hover:bg-[#6B5FE6] transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-neutral-400">추천 검색어</span>
            {SUGGESTED_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push("/search?q=" + encodeURIComponent(tag))}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-[#F96A84]/40 hover:text-[#F96A84] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 일러스트 */}
        <div className="relative w-[480px] h-[420px] shrink-0 hidden lg:block">
          <Image
            src="/images/loopHero.png"
            alt="LoopIn 학습 루프"
            fill
            className="object-contain"
            priority
            unoptimized
          />

          {/* 북마크 버블 — 느린 플로트 */}
          <div className="animate-float-a absolute top-8 right-14 w-12 h-12 rounded-full bg-[#F96A84] flex items-center justify-center shadow-lg">
            <Bookmark className="w-5 h-5 text-white fill-white" />
          </div>

          {/* 검색 버블 — 중간 속도, 다른 리듬 */}
          <div className="animate-float-b absolute top-[42%] -translate-y-1/2 -left-2 w-11 h-11 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-md">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>

          {/* 플레이 버블 — 빠르게, 후행 */}
          <div className="animate-float-c absolute bottom-14 right-4 w-11 h-11 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-md">
            <Play className="w-4 h-4 text-[#7C6FF7] fill-[#7C6FF7]" />
          </div>
        </div>
      </div>
    </section>
  )
}
