'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()

  function handleGoogleSignIn() {
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm border border-neutral-100">

        {/* 로고 */}
        <div className="flex justify-center">
          <Image
            src="/images/loopin-logo.svg"
            alt="LoopIn"
            width={96}
            height={30}
            priority
            unoptimized
          />
        </div>

        {/* 제목 */}
        <h1 className="text-xl font-bold mt-6 text-center text-neutral-900 leading-snug">
          다시 이어가고 싶은 학습이 있나요?
        </h1>
        <p className="text-sm text-neutral-400 text-center mt-2 leading-relaxed">
          학습 자료를 탐색하고, 저장하고, 이어 학습하세요
        </p>

        <div className="border-t border-neutral-100 my-8" />

        {/* Google 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-neutral-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors"
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

        {/* 탐색 링크 */}
        <p className="text-xs text-neutral-400 text-center mt-6">
          <Link
            href="/"
            className="hover:text-primary transition-colors"
          >
            로그인 없이 탐색하기 →
          </Link>
        </p>

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
