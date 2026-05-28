'use client'

import { signIn } from 'next-auth/react'
import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function LoginContent() {
  const [loading, setLoading] = useState(false)

  function handleGoogleSignIn() {
    const callbackUrl = '/'
    signIn('google', { callbackUrl })
  }

  async function handleTestLogin() {
    setLoading(true)
    await signIn('credentials', {
      email: 'test@loopin.kr',
      password: 'loopin1234',
      callbackUrl: '/',
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 패널 */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-[#EDE9FF] via-[#F3E8FF] to-[#FFE4EE]">
        <Image
          src="/images/loopin-logo.svg"
          alt="LoopIn"
          width={120}
          height={38}
          priority
          unoptimized
        />
        <h2 className="text-5xl font-bold text-neutral-900 leading-tight whitespace-pre-line mt-12">
          {"다시 이어지는\n나의 "}
          <span className="text-[#F96A84]">학습 루프</span>
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed whitespace-pre-line mt-5">
          {"흩어진 학습 자료를 저장하고,\n다시 탐색하며 나만의 학습 흐름을 만들어보세요."}
        </p>
      </div>

      {/* 오른쪽 패널 */}
      <div className="md:w-1/2 min-h-screen bg-gradient-to-br from-[#F8F6FF] to-[#FFF0F5] flex items-center justify-center p-6 md:px-8 md:py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold text-neutral-900 text-center">Welcome Back</h1>
          <p className="text-sm text-neutral-500 text-center mt-2">
            오늘의 학습 흐름을 다시 이어가요.
          </p>

          <div className="border-t border-neutral-100 my-8" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-neutral-200 rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors"
          >
            <Image
              src="/icons/Google.svg"
              width={20}
              height={20}
              alt="Google"
              unoptimized
            />
            <span className="text-sm font-medium text-neutral-700">Google로 계속하기</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-100" />
            <span className="text-xs text-neutral-400">또는</span>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-500 mb-2">🧪 포트폴리오 체험용 테스트 계정</p>
            <p className="text-xs text-neutral-400 mb-3">
              ID: test@loopin.kr &nbsp;|&nbsp; PW: loopin1234
            </p>
            <button
              type="button"
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '테스트 계정으로 로그인'}
            </button>
          </div>

          <p className="mt-6 text-center">
            <Link href="/" className="text-xs text-neutral-400 hover:text-primary transition-colors">
              로그인 없이 탐색하기 →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
