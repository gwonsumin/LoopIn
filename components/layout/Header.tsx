"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { getAllSaved } from "@/lib/utils/loop-storage";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import SearchOverlay from "@/components/search/SearchOverlay";

// ── 메뉴 데이터 ────────────────────────────────────────────────────────────
interface DropdownItem {
  label: string;
  href: string;
  isPrimary?: boolean;
}
interface NavItem {
  label: string;
  href: string;
  dropdown: DropdownItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "탐색하기",
    href: "/search",
    dropdown: [
      { label: "입문자 추천", href: "/search?level=beginner" },
      { label: "지금 인기 있는 자료", href: "/search?sort=popular" },
      { label: "실습 중심 자료", href: "/search?type=practice" },
      { label: "짧게 학습하기", href: "/search?type=article" },
      { label: "많이 저장된 자료", href: "/search?sort=popular" },
      { label: "전체 자료 보기 →", href: "/search", isPrimary: true },
    ],
  },
  {
    label: "Learning Flows",
    href: "/search?view=flows",
    dropdown: [
      { label: "UX Portfolio", href: "/search?flow=ux-portfolio" },
      { label: "Frontend Starter", href: "/search?flow=frontend-starter" },
      { label: "AI Productivity", href: "/search?flow=ai-productivity" },
      { label: "Data Analysis", href: "/search?flow=data-analysis" },
      { label: "모든 Flow 보기 →", href: "/search?view=flows", isPrimary: true },
    ],
  },
  {
    label: "My Loop",
    href: "/my-loop",
    dropdown: [
      { label: "저장한 자료", href: "/my-loop" },
      { label: "이어 학습하기", href: "/my-loop#continue" },
      { label: "최근 본 자료", href: "/my-loop#recent" },
      { label: "내 Learning Flows", href: "/my-loop#flows" },
    ],
  },
  {
    label: "자료 등록",
    href: "/resources/new",
    dropdown: [
      { label: "자료 등록하기", href: "/resources/new" },
      { label: "등록 가이드", href: "/resources/new#guide" },
    ],
  },
];

// ── Header ─────────────────────────────────────────────────────────────────
export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getAllSaved().length);
    function onUpdate() {
      setSavedCount(getAllSaved().length);
    }
    window.addEventListener("loopin-loop-updated", onUpdate);
    return () => window.removeEventListener("loopin-loop-updated", onUpdate);
  }, []);

  function isActive(href: string) {
    const base = href.split("?")[0];
    return pathname === base;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 로고 */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/loopin-logo.svg"
              alt="LoopIn"
              width={88}
              height={28}
              priority
              unoptimized
            />
          </Link>

          {/* 데스크탑 GNB */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="relative group">
                {/* 메뉴 버튼 */}
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:bg-neutral-50 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  {item.label}
                  {item.href === "/my-loop" && savedCount > 0 && (
                    <span className="min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                      {savedCount > 99 ? "99+" : savedCount}
                    </span>
                  )}
                </Link>

                {/* 드롭다운 패널 */}
                <div className="absolute top-full left-0 mt-1 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 py-2 min-w-[200px]">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href + sub.label}
                        href={sub.href}
                        className={`block px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50 ${
                          sub.isPrimary
                            ? "text-primary font-medium border-t border-neutral-100 mt-1 pt-3"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* 우측 액션 — 데스크탑 */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              aria-label="검색 열기"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Image
                src="/icons/header-search.svg"
                width={20}
                height={20}
                alt="검색"
                className="icon-muted"
              />
            </button>
            <button
              type="button"
              className="border border-neutral-200 text-sm px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-colors text-neutral-700"
            >
              로그인
            </button>
          </div>

          {/* 모바일 우측 */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              aria-label="검색 열기"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Image
                src="/icons/header-search.svg"
                width={20}
                height={20}
                alt="검색"
                className="icon-muted"
              />
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    aria-label="메뉴 열기"
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                  />
                }
              >
                <Menu className="h-5 w-5 text-neutral-700" />
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                {/* 모바일 시트 헤더 */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
                  <SheetTitle className="sr-only">메뉴</SheetTitle>
                  <Link href="/" onClick={() => setMobileOpen(false)}>
                    <Image
                      src="/images/loopin-logo.svg"
                      alt="LoopIn"
                      width={80}
                      height={25}
                      priority
                      unoptimized
                    />
                  </Link>
                  <button
                    type="button"
                    aria-label="메뉴 닫기"
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>

                {/* 메뉴 목록 */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-neutral-50 ${
                          isActive(item.href)
                            ? "text-primary"
                            : "text-neutral-800"
                        }`}
                      >
                        {item.label}
                        {item.href === "/my-loop" && savedCount > 0 && (
                          <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                            {savedCount > 99 ? "99+" : savedCount}
                          </span>
                        )}
                      </Link>
                      <div className="pl-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href + sub.label}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block text-sm px-5 py-2 rounded-lg transition-colors hover:bg-neutral-50 ${
                              sub.isPrimary
                                ? "text-primary font-medium"
                                : "text-neutral-500 hover:text-neutral-700"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>

                {/* 하단 로그인 */}
                <div className="p-4 border-t border-neutral-100 shrink-0">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
                  >
                    로그인
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
