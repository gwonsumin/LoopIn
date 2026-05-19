import type { Category } from '@/lib/types'

export const mockCategories: Category[] = [
  {
    slug: 'ux-ui',
    name: 'UX/UI 디자인',
    description: '포트폴리오·리서치·프로토타입',
    resourceCount: 1248,
    icon: 'pen',
    accentColor: 'pink',
  },
  {
    slug: 'frontend',
    name: '프론트엔드',
    description: 'React·Next.js·실습 중심',
    resourceCount: 2153,
    icon: 'code',
    accentColor: 'blue',
  },
  {
    slug: 'ai-data',
    name: 'AI / 데이터',
    description: '프롬프트·자동화·워크플로우',
    resourceCount: 1032,
    icon: 'brain',
    accentColor: 'purple',
  },
  {
    slug: 'productivity',
    name: '생산성 도구',
    description: 'Notion·앱·시스템 구축',
    resourceCount: 896,
    icon: 'folder',
    accentColor: 'green',
  },
  {
    slug: 'design-tool',
    name: '디자인 툴',
    description: 'Figma·Auto Layout·Design System',
    resourceCount: 711,
    icon: 'sparkles',
    accentColor: 'yellow',
  },
]
