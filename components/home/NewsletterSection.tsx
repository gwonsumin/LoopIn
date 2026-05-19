"use client"

import { useState } from "react"

type FormState = "idle" | "error-empty" | "error-format" | "success"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setState("error-empty")
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setState("error-format")
      return
    }
    setState("success")
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-neutral-900 rounded-3xl px-8 py-12 text-white">
        <div className="max-w-lg mx-auto text-center">
          {/* 태그 칩 */}
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
            뉴스레터
          </span>

          {/* 제목 */}
          <h2 className="text-2xl font-bold mt-4">
            새로운 학습 자료, 가장 먼저 받아보세요
          </h2>

          {/* 부제 */}
          <p className="text-sm text-white/60 mt-2">
            매주 1회, 직무별 큐레이션 자료를 보내드려요
          </p>

          {/* 폼 or 성공 메시지 */}
          {state === "success" ? (
            <p className="text-white/80 text-sm text-center mt-6">
              ✅ 구독 완료! 다음 뉴스레터를 기대해주세요
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (state !== "idle") setState("idle")
                  }}
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F96A84] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F96A84] hover:bg-[#E84D6A] text-white px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
                >
                  구독하기
                </button>
              </div>
              {state === "error-empty" && (
                <p className="text-red-400 text-xs mt-2 text-left">
                  이메일을 입력해주세요
                </p>
              )}
              {state === "error-format" && (
                <p className="text-red-400 text-xs mt-2 text-left">
                  올바른 이메일 형식으로 입력해주세요
                </p>
              )}
            </form>
          )}

          {/* 하단 안내 */}
          <p className="text-xs text-white/40 mt-4">
            스팸 없음 · 언제든 수신 취소 가능
          </p>
        </div>
      </div>
    </section>
  )
}
