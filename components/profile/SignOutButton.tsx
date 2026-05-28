'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="min-h-11 border border-neutral-200 text-sm px-6 py-2.5 rounded-xl text-neutral-600 hover:border-red-200 hover:text-red-400 transition-colors"
    >
      로그아웃
    </button>
  )
}
