# LoopIn

디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼.
흩어진 학습 자료를 모아 나만의 학습 아카이브를 만들어보세요.

> 검색 → 필터 → 저장(My Loop) → 재탐색 → 이어 학습

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일**: Tailwind CSS / shadcn/ui
- **폰트**: Pretendard
- **패키지 매니저**: pnpm

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 확인할 수 있습니다.

## 폴더 구조

```
app/          # Next.js App Router 페이지
components/   # UI 컴포넌트
lib/          # 타입, 유틸리티, mock 데이터
public/       # 정적 파일 (이미지, 아이콘, 폰트)
```

## 주요 화면

| 경로 | 설명 |
|------|------|
| `/` | 홈 (Hero, 탐색 섹션) |
| `/search` | 검색 및 필터 |
| `/resources/[id]` | 자료 상세 |
| `/my-loop` | 나의 학습 아카이브 |
