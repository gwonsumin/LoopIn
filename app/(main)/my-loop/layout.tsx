import Link from "next/link"
import Image from "next/image"
import { Bookmark, PlayCircle, Clock } from "lucide-react"

const NAV_LINKS = [
  { label: "My Loop",     href: "/my-loop", icon: Bookmark,   active: true  },
  { label: "이어보기",    href: "/my-loop", icon: PlayCircle, active: false },
  { label: "최근 본 자료", href: "/my-loop", icon: Clock,      active: false },
]

export default function MyLoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen">
      {/* 사이드바 */}
      <aside className="w-56 shrink-0 hidden lg:flex flex-col bg-white border-r border-neutral-100 px-4 py-8">
        {/* 내비 */}
        <div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 px-3">
            내 학습
          </p>
          <nav className="space-y-1">
            {NAV_LINKS.map(({ label, href, icon: Icon, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-primary/[0.08] text-primary font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단 CTA */}
        <div className="mt-auto rounded-2xl bg-gradient-to-b from-violet-50 to-purple-50 border border-violet-100 p-4">
          <div className="rounded-xl bg-white shadow-sm p-1.5 inline-block">
            <Image
              src="/images/loopin-logo.svg"
              alt="LoopIn"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <p className="text-sm font-semibold text-neutral-800 mt-3 leading-snug">
            나만의 학습 흐름을 만들어보세요
          </p>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            저장한 자료를 연결해 Learning Flow로 관리해보세요.
          </p>
          <Link
            href="/search?view=flows"
            className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 transition-colors text-center block"
          >
            Flow 생성하기
          </Link>
        </div>
      </aside>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0 bg-neutral-50">
        {children}
      </div>
    </div>
  )
}
