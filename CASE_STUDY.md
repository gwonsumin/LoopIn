# LoopIn — 케이스스터디

**디지털 직무 학습자를 위한 탐색 중심 EduTech 플랫폼**

> 설계자: 권수민 (UI/UX Design + Frontend)  
> 기간: 2025 포트폴리오 프로젝트  
> 배포: [loop-in-mu.vercel.app](https://loop-in-mu.vercel.app)

---

## 1. 문제 정의

### 기존 EduTech의 구조적 한계

대부분의 학습 플랫폼은 **콘텐츠 소비 이후**의 경험을 잘 설계하지만, 정작 **무엇을 배울지 결정하는 탐색 과정**은 단순한 검색창과 카테고리 나열로 처리합니다.

결과적으로 사용자는:
- 검색 결과를 보고 저장하지 않으면 잊어버림
- 학습을 시작했다가 어디까지 했는지 파악하기 어려움
- 관련 자료를 발견해도 흐름으로 연결되지 않아 단발로 끝남

### 핵심 질문

> "학습 콘텐츠 자체보다 탐색과 이어가기 경험을 설계하면 어떨까?"

---

## 2. 서비스 개요

LoopIn은 직무 학습 자료를 **발견 → 저장 → 이어가기** 흐름으로 연결하는 탐색 중심 EduTech 플랫폼입니다.

```
검색 → 필터 → 자료 발견 → 저장(My Loop) → 재탐색 → 이어 학습(Learn View) → 완료
```

---

## 3. 핵심 UX 결정

### 3-1. 검색은 오버레이, Hero는 브랜드 경험

일반적인 EduTech는 Hero 영역에 검색창을 배치합니다. LoopIn은 이 결정을 반대로 했습니다.

- **Hero** → 브랜드 무드와 탐색 동기 부여 중심
- **검색** → 헤더 아이콘 클릭 시 SearchOverlay로 진입

이유: 첫 방문 사용자가 "무엇을 배울 수 있는지"를 먼저 인지한 뒤 검색으로 연결되는 흐름이 더 자연스럽다고 판단했습니다.

### 3-2. My Loop = 즐겨찾기가 아닌 학습 아카이브

저장 기능을 단순 북마크가 아닌 **개인 학습 아카이브**로 설계했습니다.

| 일반 즐겨찾기 | My Loop |
|---|---|
| 저장 여부만 표시 | 진행률 + 완료 상태 추적 |
| 정렬/필터 없음 | 카테고리 탭 필터 |
| 단순 목록 | 이어 학습 중 / 완료 / 전체 구분 |
| 통계 없음 | 저장 수 / 이어본 수 / 완료 수 표시 |

추가로 **커스텀 Flow** 기능을 통해 저장한 자료를 직접 큐레이션 경로로 묶어 순서대로 학습할 수 있습니다.

### 3-3. Learn View — 독립된 학습 공간

자료 학습 시 일반 페이지 레이아웃(헤더/푸터)에서 벗어나 **학습에 집중할 수 있는 독립 뷰**를 제공합니다.

- Slim 헤더: 제목 + 진행률 + 완료 버튼만 표시
- 상단 Progress Bar: 학습 진행률 시각화
- Flow 컨텍스트 배너: 어느 학습 경로에서 왔는지 표시
- 완료 후 CTA: 다음 자료 / Flow 이어가기 / My Loop 보기

### 3-4. 탐색 판단을 위한 카드 메타정보

검색 결과 카드에는 탐색 단계에서 선택 판단에 필요한 정보를 우선 배치했습니다.

- 자료 유형 (강의 / 아티클 / 실습 / 영상 / 문서)
- 난이도 (입문 / 중급 / 고급 / 실무)
- 예상 소요 시간
- 저장 수 (사회적 증거)
- 태그

---

## 4. 정보 구조 (IA)

```
LoopIn
├── 홈 (브랜드 경험 + 탐색 진입점)
│   ├── Hero
│   ├── Continue Your Loop (이어 학습 CTA)
│   ├── Learning Flows (큐레이션 경로)
│   ├── 탐색 섹션
│   └── Newsletter
├── 탐색하기 (검색 결과)
│   ├── SearchOverlay (헤더 진입)
│   └── 필터 / 정렬 / 결과 그리드
├── 자료 상세
│   └── Learn View (독립 레이아웃)
├── Learning Flows
│   └── Flow 상세 (카드 플립 → 저장)
├── My Loop (개인 학습 아카이브)
│   ├── 통계 (저장 / 이어본 / 완료)
│   ├── 이어 학습 중
│   ├── 내 학습 Flow
│   ├── 학습 히스토리
│   └── 저장한 자료 전체
└── 마이페이지
```

---

## 5. 기술 구조

### 기술 스택 선택 이유

**Next.js 16 App Router**

라우트별 레이아웃 독립 분리가 핵심 이유였습니다. Learn View는 헤더/푸터 없이 독립 레이아웃이 필요했고, App Router의 중첩 레이아웃 구조가 이를 자연스럽게 해결했습니다.

```
app/(main)/layout.tsx        ← 헤더/푸터 포함
app/(main)/resources/[id]/learn/layout.tsx  ← Learn View 독립 레이아웃
```

**localStorage + MongoDB 혼용 전략**

| 데이터 | 저장소 | 이유 |
|---|---|---|
| 학습 진행률, 커스텀 Flow | localStorage | 즉각적인 UX 반응, 서버 호출 없이 실시간 업데이트 |
| 저장한 자료 (My Loop) | MongoDB | 로그인 유저 간 동기화, 세션 유지 |
| 최근 검색어 | localStorage | 세션성 데이터, 개인화 목적 |

**TanStack Query**

My Loop 저장 자료 목록의 캐싱과 staleTime 설정으로 불필요한 서버 요청을 최소화했습니다. `staleTime: 30_000` 설정으로 30초 내 재방문 시 캐시 데이터를 즉시 사용합니다.

**shadcn/ui (base-ui 기반)**

headless 컴포넌트 기반으로 Sheet, Dialog, Tabs를 LoopIn 디자인 시스템에 맞게 커스터마이징했습니다. Tailwind 클래스를 직접 제어할 수 있어 브랜드 무드(#F96A84, rounded-2xl, soft shadow)를 일관되게 유지했습니다.

---

## 6. 주요 구현 결정

### 진행률 자동 적산 방식

실제 영상 재생 API 연동 없이도 학습 진행감을 주기 위해 **시간 기반 진행률**을 구현했습니다.

```typescript
// 3초마다 1% 증가 → 약 5분에 99% 도달
useEffect(() => {
  if (status === 'completed') return
  const timer = setInterval(() => {
    setPercent(prev => Math.min(prev + 1, 99))
  }, 3000)
  return () => clearInterval(timer)
}, [status])
```

99%에서 멈추고 "학습 완료하기" 버튼을 통해 100%로 전환되도록 했습니다. 사용자의 명시적 완료 액션을 유도해 완료 경험을 의미있게 만들었습니다.

### Flow 컨텍스트 연결

Learn View 진입 시 커스텀 Flow 또는 큐레이션 Flow에서 왔는지 자동 감지하여 "다음 자료" CTA를 동적으로 표시합니다.

```typescript
// 1순위: 사용자 커스텀 Flow 확인
const found = myFlows.find(f => f.resourceIds.includes(resource.id))

// 2순위: 큐레이션 Flow(mockFlows) 확인
const curatedFlow = mockFlows.find(f => f.steps.some(s => s.resourceId === resource.id))
```

### SearchOverlay UX

모바일에서 fullscreen, 데스크탑에서 centered modal로 동작합니다.

```
모바일: fixed inset-0, h-full (전체 화면)
데스크탑: sm:top-[10%], sm:max-w-2xl (중앙 모달)
```

ESC 닫기, body 스크롤 잠금, 최근 검색어 localStorage 연동까지 구현했습니다.

---

## 7. 반응형 대응

| 브레이크포인트 | 주요 처리 |
|---|---|
| 375px (모바일 S) | 카드 1열, Search fullscreen, 터치 영역 44px |
| 430px (모바일 L) | 카드 1열 유지, 여백 조정 |
| 768px (태블릿) | 카드 2열, 사이드 필터 |
| 1280px+ (데스크탑) | 카드 3열, GNB 드롭다운, 전체 레이아웃 |

---

## 8. 배운 점

**탐색 UX는 정보 구조 설계가 전부다**

검색 → 저장 → 이어 학습의 흐름이 끊기지 않으려면 각 페이지가 서로 다음 액션을 명확하게 제시해야 합니다. 자료 상세 페이지에서 Learn View로, Learn View 완료 후 My Loop로, My Loop에서 다시 탐색으로 연결되는 순환 구조를 의식적으로 설계했습니다.

**localStorage는 강력하지만 설계가 필요하다**

진행률, 커스텀 Flow, 최근 검색어를 localStorage로 관리하면서 키 네이밍 규칙(`loopin-progress-{id}`, `loopin-my-flows`)과 로그아웃 시 일괄 초기화 로직이 필수임을 경험했습니다.

**디자인 시스템 일관성이 개발 속도를 올린다**

Tailwind 커스텀 변수(`--color-primary: #F96A84`)와 shadcn/ui 커스터마이징을 통해 컴포넌트 단위로 디자인 무드를 일관되게 유지했습니다. 후반부 polish 작업에서 수정 범위가 예측 가능했던 이유는 초반 디자인 시스템 설계 덕분입니다.
