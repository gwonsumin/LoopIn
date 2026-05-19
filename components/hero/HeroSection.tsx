"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { heroSlides } from "./heroSlides"

const AUTO_INTERVAL = 5000

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (isPaused || reducedMotionRef.current) return
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % heroSlides.length)
    }, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [isPaused])

  return (
    <section
      role="region"
      aria-label="추천 학습 흐름"
      className="relative h-[480px] md:h-[560px] overflow-hidden bg-neutral-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.flowSlug}
          aria-hidden={i !== activeIndex}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* 배경 일러스트 */}
          <Image
            src={slide.bgImage}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-right"
          />

          {/* 좌측 카피 가독성용 fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-transparent md:from-white/70 md:via-white/30 md:to-transparent" />

          {/* 카피 영역 */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="space-y-5 max-w-lg">
              {/* 배지 */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur border text-xs font-medium",
                  slide.accentTextClass,
                  slide.accentBorderClass
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/sparkle.svg" alt="" width={12} height={12} className="icon-muted" />
                {slide.badgeText}
              </div>

              {/* 제목 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight whitespace-pre-line">
                <span className="text-neutral-900">{slide.titlePrefix}</span>
                <span className={slide.accentTextClass}>{slide.titleAccent}</span>
              </h1>

              {/* 설명 */}
              <p className="text-sm md:text-base text-neutral-700 leading-relaxed whitespace-pre-line">
                {slide.description}
              </p>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {slide.tags.map((tag) => (
                  <Link
                    key={tag.label}
                    href={`/search?q=${encodeURIComponent(tag.label)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-neutral-200 text-xs md:text-sm text-neutral-700 hover:border-neutral-400 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tag.icon} alt="" width={14} height={14} className="shrink-0 icon-muted" />
                    {tag.label}
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/flows/${slide.flowSlug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-5 h-11 rounded-full text-white text-sm font-medium shadow-sm transition-colors",
                  slide.accentBgClass,
                  slide.accentHoverClass
                )}
              >
                {slide.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* 장식 아이콘 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/hero-star.svg"
        alt=""
        width={23}
        height={22}
        className="absolute top-10 right-[42%] opacity-70 pointer-events-none hidden md:block icon-muted"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/hero-lighting.svg"
        alt=""
        width={14}
        height={17}
        className="absolute bottom-16 right-[38%] opacity-60 pointer-events-none hidden md:block icon-muted"
        aria-hidden
      />

      {/* 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.flowSlug}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`${i + 1}번째 슬라이드로 이동`}
            aria-current={i === activeIndex}
            className="w-8 h-8 flex items-center justify-center"
          >
            <span
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-8 bg-neutral-900"
                  : "w-2 bg-neutral-400 hover:bg-neutral-600"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
