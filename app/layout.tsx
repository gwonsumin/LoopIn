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
  title: "LoopIn — 디지털 직무 학습 플랫폼",
  description:
    "검색하고, 저장하고, 이어 배우세요. 나만의 학습 루프를 만들어보세요.",
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
