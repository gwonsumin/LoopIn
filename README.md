# LoopIn

디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼

## 기술 스택

- Next.js 16 App Router / TypeScript
- Tailwind CSS v4
- MongoDB Atlas / Mongoose
- NextAuth.js v5 (Google OAuth)
- TanStack Query v5
- Vercel 배포

## 주요 기능

- A. 학습 자료 통합 검색 + 필터
- B. 자료 카드 & 상세 보기
- C. 자료 등록 폼
- D. My Loop (개인 학습 아카이브)
- E. Google OAuth 인증
- F. 관리자 패널

## 로컬 실행

```bash
pnpm install
# .env.local 설정 (아래 환경변수 참고)
pnpm dev
```

## 환경변수

| 변수명 | 설명 |
|---|---|
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 |
| `NEXTAUTH_SECRET` | 세션 서명 키 |
| `NEXTAUTH_URL` | 앱 URL (로컬: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

## 시딩

```bash
MONGODB_URI="mongodb+srv://..." pnpm seed
```

## 배포

<https://loop-in-mu.vercel.app>
