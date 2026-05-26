"use client"

import { useState } from "react"

type FormState = "idle" | "loading" | "error-empty" | "error-format" | "error-server" | "already-subscribed" | "success"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setState("error-empty")
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setState("error-format")
      return
    }
    setState("loading")
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setState("error-server")
        return
      }
      if (data.message === "already_subscribed") {
        setState("already-subscribed")
      } else {
        setState("success")
      }
    } catch {
      setState("error-server")
    }
  }

  return (
    <section className="bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* 좌측: 텍스트 */}
          <div className="max-w-sm text-left">
            <h2 className="text-2xl font-bold leading-snug text-neutral-900">
              새로운 자료, 놓치지 마세요.
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              업데이트되는 자료와 추천 콘텐츠를 이메일로 받아보세요.
            </p>
          </div>

          {/* 우측: 폼 */}
          <div className="w-full md:w-auto md:min-w-[420px] shrink-0">
            {state === "success" ? (
              <p className="text-neutral-700 text-sm">
                ✅ 구독 완료! 다음 뉴스레터를 기대해주세요
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex gap-2">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state !== "idle") setState("idle")
                    }}
                    placeholder="이메일 주소를 입력하세요"
                    disabled={state === "loading"}
                    className="flex-1 bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F96A84] transition-colors disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="bg-[#F96A84] hover:bg-[#E84D6A] text-white px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? "구독 중..." : "구독하기"}
                  </button>
                </div>
                {state === "error-empty" && (
                  <p className="text-red-500 text-xs mt-2">이메일을 입력해주세요</p>
                )}
                {state === "error-format" && (
                  <p className="text-red-500 text-xs mt-2">올바른 이메일 형식으로 입력해주세요</p>
                )}
                {state === "already-subscribed" && (
                  <p className="text-neutral-500 text-xs mt-2">이미 구독 중인 이메일이에요 😊</p>
                )}
                {state === "error-server" && (
                  <p className="text-red-500 text-xs mt-2">잠시 후 다시 시도해주세요</p>
                )}
              </form>
            )}
            <p className="text-xs text-neutral-400 mt-3">
              스팸 없음 · 언제든 수신 취소 가능
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
