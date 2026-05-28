# LoopIn

**디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼**

단순한 강의 목록이 아닌, 학습 자료를 *발견하고 → 저장하고 → 이어가는* 흐름을 설계한 서비스입니다.

🔗 **배포 URL**: [loop-in-mu.vercel.app](https://loop-in-mu.vercel.app)

---

## 핵심 개념

> "탐색 경험이 곧 학습 경험이다"

기존 EduTech 플랫폼의 문제는 콘텐츠 소비에 집중한 나머지, 사용자가 **무엇을 배울지 결정하는 과정**을 설계하지 않는다는 것입니다. LoopIn은 검색 → 필터 → 저장 → 재탐색 → 이어 학습의 흐름을 핵심 UX로 삼았습니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| **Search Overlay** | 헤더 검색 버튼 → 오버레이 탐색 UX. 추천 탐색 + 최근 검색어 지원. |
| **필터 + 정렬** | 카테고리 / 난이도 / 자료 유형 복합 필터. URL 파라미터 기반 상태 관리. |
| **My Loop** | 저장한 자료를 학습 아카이브로 관리. 진행률 / 완료 통계 / 커스텀 Flow 생성. |
| **Learn View** | 자료별 학습 뷰. 시간 기반 진행률 자동 적산, Flow 컨텍스트 표시, 완료 후 다음 자료 CTA. |
| **Learning Flows** | 큐레이션 학습 경로. 카드 플립 인터랙션으로 자료 저장 유도. |
| **자료 등록** | 관리자 전용 자료 등록 폼. 제출 후 데모 안내 처리. |
| **Google OAuth** | NextAuth.js 기반 소셜 로그인. 세션 기반 저장 자료 연동. |

---

## 기술 스택

```
Frontend   Next.js 16 App Router / React 19 / TypeScript
Styling    Tailwind CSS v4 / shadcn/ui (base-ui 기반)
Data       TanStack Query v5 / localStorage (진행률 상태)
Auth       NextAuth.js v5 (Google OAuth)
Database   MongoDB Atlas / Mongoose
Deploy     Vercel
```

### 주요 기술 선택 이유

- **Next.js App Router** — 라우트별 레이아웃 분리(Learn View 독립 레이아웃)와 서버 컴포넌트 활용으로 초기 로딩 최적화
- **TanStack Query** — 저장 자료 목록의 캐싱 및 낙관적 업데이트 처리
- **localStorage + DB 혼용** — 학습 진행률은 빠른 UX를 위해 localStorage, 저장 자료는 로그인 연동을 위해 DB 저장
- **shadcn/ui (base-ui)** — headless 기반으로 LoopIn 디자인 시스템에 맞게 커스터마이징

---

## 폴더 구조

```
app/
├── (auth)/          # 로그인 레이아웃
├── (main)/          # 메인 레이아웃 (헤더/푸터 포함)
│   ├── page.tsx     # 홈
│   ├── search/      # 검색 결과
│   ├── resources/   # 자료 상세 + Learn View
│   ├── my-loop/     # 개인 학습 아카이브
│   ├── flows/       # Learning Flows
│   └── profile/     # 마이페이지
├── admin/           # 관리자 패널
└── api/             # Route Handlers

components/
├── layout/          # Header, Footer
├── hero/            # Hero 섹션
├── home/            # 홈 섹션 컴포넌트
├── search/          # SearchOverlay, FilterPanel, ResourceCard
├── my-loop/         # My Loop 섹션별 컴포넌트
└── common/          # EmptyState, LoadingState, ErrorState
```

---

## 로컬 실행

```bash
pnpm install

# .env.local 생성 후 아래 환경변수 설정
pnpm dev
```

### 환경변수

| 변수명 | 설명 |
|---|---|
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 |
| `NEXTAUTH_SECRET` | 세션 서명 키 |
| `NEXTAUTH_URL` | 앱 URL (로컬: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

### 시딩

```bash
MONGODB_URI="mongodb+srv://..." pnpm seed
```

---

## 디자인 원칙

- **Primary** `#F96A84` / **Font** Pretendard / **Radius** rounded-2xl 카드
- Hero는 검색창 대신 브랜드 경험 중심 → 검색은 SearchOverlay
- My Loop = 단순 즐겨찾기가 아닌 개인 학습 아카이브
- Subtle interaction, airy spacing, soft shadow
- 모바일 터치 영역 44px 이상 / 375px~1280px+ 반응형 대응

---

## 케이스스터디

설계 의도, UX 결정 과정, 기술 선택 이유를 정리한 케이스스터디는 [CASE_STUDY.md](./CASE_STUDY.md)에서 확인할 수 있습니다.
