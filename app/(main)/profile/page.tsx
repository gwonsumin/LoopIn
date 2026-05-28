import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ProfileStats } from '@/components/profile/ProfileStats'
import SignOutButton from '@/components/profile/SignOutButton'

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { user } = session
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-5">

        {/* 프로필 카드 */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 sm:p-8">
          <div className="flex items-center gap-4 sm:gap-5">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? '프로필'}
                width={72}
                height={72}
                className="rounded-full object-cover ring-2 ring-primary/10"
                unoptimized
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xl font-bold text-neutral-900">{user?.name ?? '이름 없음'}</p>
              <p className="text-sm text-neutral-400 mt-0.5 break-all">{user?.email}</p>
              {(user as { role?: string })?.role === 'admin' && (
                <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  관리자
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 활동 통계 — client 컴포넌트 */}
        <ProfileStats />

        {/* My Loop 바로가기 */}
        <Link
          href="/my-loop"
          className="flex min-h-11 items-center justify-between rounded-2xl border border-neutral-100 bg-white px-6 py-4 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold text-neutral-800">My Loop 보기</p>
            <p className="text-xs text-neutral-400 mt-0.5">저장한 자료와 학습 흐름을 확인하세요</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 group-hover:text-primary transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>

        {/* 로그아웃 */}
        <div className="flex justify-end pt-2">
          <SignOutButton />
        </div>

      </div>
    </div>
  )
}
