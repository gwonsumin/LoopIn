# LoopIn — Project Context

서비스: 디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼
핵심 흐름: 검색 → 필터 → 저장(My Loop) → 재탐색 → 이어 학습

## 디자인 원칙
- Primary: #F96A84 / 폰트: Pretendard / rounded-2xl card
- Hero는 검색창 X → 브랜드 경험 중심, 검색은 SearchOverlay
- My Loop = 단순 즐겨찾기가 아닌 개인 학습 아카이브

## 기술 스택
- Next.js 15 App Router / TypeScript / Tailwind / shadcn/ui
- 초반: mock data 기반 / 후반: MongoDB + NextAuth 연결

## 폴더 구조 기준
app/ components/ lib/ public/ (src 폴더 없음)

## Subagent 역할
- UI Builder: 컴포넌트 생성, 페이지 구현
- UX Reviewer: 탐색 흐름 검토, Figma 일치 확인