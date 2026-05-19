import Link from "next/link"

const NAV_LINKS = [
  { label: "홈", href: "/" },
  { label: "전체 자료", href: "/search" },
  { label: "Learning Flows", href: "/search?view=flows" },
  { label: "My Loop", href: "/my-loop" },
]

const CATEGORY_LINKS = [
  { label: "UX/UI", href: "/search?category=ux-ui" },
  { label: "프론트엔드", href: "/search?category=frontend" },
  { label: "AI/데이터", href: "/search?category=ai-data" },
  { label: "생산성", href: "/search?category=productivity" },
]

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    defaultIcon: "/icons/github-default.svg",
    hoverIcon: "/icons/github-hover.svg",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    defaultIcon: "/icons/instagram-default.svg",
    hoverIcon: "/icons/instagram-hover.svg",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    defaultIcon: "/icons/youtube-default.svg",
    hoverIcon: "/icons/youtube-hover.svg",
  },
]

const SERVICE_LINKS = [
  { label: "자료 등록", href: "/resources/new" },
  { label: "공지사항", href: "#" },
  { label: "문의하기", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* 4열 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* 열 1: 브랜드 */}
          <div>
            <Link href="/" className="text-xl font-bold text-[#F96A84]">
              LoopIn
            </Link>
            <p className="text-sm text-neutral-500 mt-2 max-w-[200px] leading-relaxed">
              디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group"
                >
                  <span className="relative block w-5 h-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={social.defaultIcon}
                      alt=""
                      width={20}
                      height={20}
                      className="absolute inset-0 transition-opacity duration-150 opacity-100 group-hover:opacity-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={social.hoverIcon}
                      alt=""
                      width={20}
                      height={20}
                      className="absolute inset-0 transition-opacity duration-150 opacity-0 group-hover:opacity-100"
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 열 2: 탐색 */}
          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-3">탐색</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 열 3: 카테고리 */}
          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-3">카테고리</p>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 열 4: 서비스 */}
          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-3">서비스</p>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 하단 구분선 + 카피라이트 */}
        <div className="border-t border-neutral-100 pt-6 mt-8 flex flex-wrap justify-between items-center gap-2">
          <p className="text-xs text-neutral-400">
            © 2026 LoopIn. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 italic">
            검색하고, 저장하고, 이어 학습하다.
          </p>
        </div>

      </div>
    </footer>
  )
}
