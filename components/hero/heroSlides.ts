import type { CategorySlug } from "@/lib/types"

export interface HeroTag {
  label: string
  icon: string
}

export interface HeroSlide {
  flowSlug: string
  category: CategorySlug
  badgeText: string
  titlePrefix: string
  titleAccent: string
  description: string
  tags: HeroTag[]
  ctaText: string
  bgImage: string
  accentTextClass: string
  accentBgClass: string
  accentHoverClass: string
  accentBorderClass: string
}

export const heroSlides: HeroSlide[] = [
  {
    flowSlug: 'ux-portfolio',
    category: 'ux-ui',
    badgeText: '추천 학습 흐름',
    titlePrefix: 'UX Portfolio ',
    titleAccent: 'Flow',
    description:
      '리서치부터 포트폴리오 완성까지,\nUX 포트폴리오 제작 흐름을 단계별로 탐색해보세요.',
    tags: [
      { label: 'UX Research',  icon: '/icons/user.svg'        },
      { label: '와이어프레임', icon: '/icons/wireframe.svg'   },
      { label: '프로토타입',   icon: '/icons/arrow-flow.svg'  },
      { label: 'Case Study',   icon: '/icons/graph.svg'       },
    ],
    ctaText: 'Flow 탐색하기',
    bgImage: '/illustrations/hero-ux-portfolio.png',
    accentTextClass: 'text-[#F96A84]',
    accentBgClass: 'bg-[#F96A84]',
    accentHoverClass: 'hover:bg-[#E84D6A]',
    accentBorderClass: 'border-[#F96A84]/30',
  },
  {
    flowSlug: 'frontend-starter',
    category: 'frontend',
    badgeText: '프론트엔드 코스',
    titlePrefix: 'Frontend Starter\n',
    titleAccent: 'Flow',
    description:
      '기초 개념부터 React까지,\n프론트엔드 핵심 흐름을 단계별로 따라가보세요.',
    tags: [
      { label: 'HTML',       icon: '/icons/html.svg'       },
      { label: 'CSS',        icon: '/icons/css.svg'        },
      { label: 'JavaScript', icon: '/icons/javaScript.svg' },
      { label: 'React',      icon: '/icons/react.svg'      },
    ],
    ctaText: 'Flow 탐색하기',
    bgImage: '/illustrations/hero-frontend-starter.png',
    accentTextClass: 'text-[#7B6CF6]',
    accentBgClass: 'bg-[#7B6CF6]',
    accentHoverClass: 'hover:bg-[#5C4DE0]',
    accentBorderClass: 'border-[#7B6CF6]/30',
  },
  {
    flowSlug: 'ai-productivity',
    category: 'ai-data',
    badgeText: 'AI 생산성 코스',
    titlePrefix: 'AI Productivity\n',
    titleAccent: 'Flow',
    description:
      'AI 도구와 자동화를 활용해\n업무 생산성을 높이는 방법을 배워보세요.',
    tags: [
      { label: 'Notion',     icon: '/icons/notion.svg'     },
      { label: 'Prompt',     icon: '/icons/pronpt.svg'     },
      { label: 'Automation', icon: '/icons/automation.svg' },
      { label: 'WorkFlow',   icon: '/icons/tool.svg'       },
    ],
    ctaText: 'Flow 탐색하기',
    bgImage: '/illustrations/hero-ai-productivity.png',
    accentTextClass: 'text-[#3DBA89]',
    accentBgClass: 'bg-[#3DBA89]',
    accentHoverClass: 'hover:bg-[#2DA374]',
    accentBorderClass: 'border-[#3DBA89]/30',
  },
]
