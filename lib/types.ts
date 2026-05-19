export type CategorySlug =
  | 'ux-ui'
  | 'frontend'
  | 'ai-data'
  | 'productivity'
  | 'design-tool'

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'practical'

export type ResourceType = 'lecture' | 'article' | 'docs' | 'practice' | 'video'

export interface Resource {
  id: string
  title: string
  description: string
  category: CategorySlug
  level: Level
  type: ResourceType
  tags: string[]
  thumbnail?: string
  url: string
  savedCount: number
  createdAt: string // ISO
}

export interface FlowStep {
  id: string
  order: number // 1-base
  title: string // 단계 라벨 (예: '리서치', '레퍼런스')
  resourceId: string // 연결된 자료
  status: 'completed' | 'current' | 'pending'
}

/** 카드 앞면 진행 단계 표시용 */
export interface FlowCardStep {
  label: string
  status: 'done' | 'current' | 'pending'
}

/** 카드 뒷면 포함 자료 미리보기 */
export interface FlowPreviewResource {
  title: string
  icon: string
}

export interface Flow {
  id: string
  slug: string
  title: string
  description: string
  category: CategorySlug
  level: Level
  illustration: string
  accentColor: 'pink' | 'blue' | 'green' | 'purple' | 'yellow'
  totalResources: number
  estimatedTime: string
  steps: FlowStep[]
  // ── 카드 UI 확장 필드 ──────────────────────────────
  image: string
  categoryLabel: string
  cardSteps: FlowCardStep[]
  displayLevel: string
  levelColor: 'green' | 'yellow'
  theme: 'pink' | 'blue' | 'green'
  ctaLink: string
  targetUsers: string[]
  previewResources: FlowPreviewResource[]
  outcomes: string[]
  tags: string[]
}

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  resourceCount: number
  icon: 'pen' | 'code' | 'brain' | 'folder' | 'sparkles'
  accentColor: 'pink' | 'blue' | 'purple' | 'green' | 'yellow'
}

export interface UserProgress {
  flowId: string
  currentStepOrder: number
  progressPercent: number // 0-100
}
