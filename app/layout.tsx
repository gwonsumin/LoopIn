import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import Providers from "./providers";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://loopin.vercel.app'),
  title: {
    default: 'LoopIn — 내 학습 흐름을 설계하는 공간',
    template: '%s | LoopIn',
  },
  description: '강의를 검색하고, 저장하고, 이어서 배우세요. 나만의 디지털 직무 학습 루프를 만들어보세요.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'LoopIn',
    title: 'LoopIn — 내 학습 흐름을 설계하는 공간',
    description: '강의를 검색하고, 저장하고, 이어서 배우세요. 나만의 디지털 직무 학습 루프를 만들어보세요.',
    images: [
      {
        url: '/og/LoopIn-og.jpg',
        width: 1200,
        height: 630,
        alt: 'LoopIn — 디지털 직무 학습 탐색 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoopIn — 내 학습 흐름을 설계하는 공간',
    description: '강의를 검색하고, 저장하고, 이어서 배우세요.',
    images: ['/og/LoopIn-og.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <QueryProvider>
          <Providers>
            {children}
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
