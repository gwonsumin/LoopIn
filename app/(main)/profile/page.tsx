import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { SavedCount } from '@/components/profile/SavedCount'
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* 프로필 카드 */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-8">
          <div className="flex items-center gap-5">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? '프로필'}
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xl font-bold text-neutral-900">{user?.name ?? '이름 없음'}</p>
              <p className="text-sm text-neutral-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl bg-neutral-50 px-5 py-4">
              <p className="text-xs text-neutral-400 mb-1">저장한 자료</p>
              <p className="text-2xl font-bold text-neutral-900">
                <SavedCount />
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 px-5 py-4">
              <p className="text-xs text-neutral-400 mb-1">등록한 자료</p>
              <p className="text-2xl font-bold text-neutral-900">0</p>
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="mt-6 flex justify-end">
          <SignOutButton />
        </div>

      </div>
    </div>
  )
}
