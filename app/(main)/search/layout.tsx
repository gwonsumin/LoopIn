import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '탐색',
  description: '카테고리, 난이도, 형식으로 필터링해서 원하는 학습 자료를 찾아보세요.',
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
