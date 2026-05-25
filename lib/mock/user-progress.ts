import type { UserProgress, ContinueLoopProgress } from '@/lib/types'
import { mockFlows } from '@/lib/mock/flows'
import { mockResources } from '@/lib/mock/resources'

// ── STEP 01-A: Flow 진행 상태 (기존 구조 유지) ─────────────────────────────
export const mockFlowProgress: UserProgress = {
  flowId: 'ux-portfolio',
  currentStepOrder: 3,
  progressPercent: 65,
}

export const currentFlow = mockFlows.find(
  (f) => f.slug === mockFlowProgress.flowId
)!

const pendingStepResourceIds = currentFlow.steps
  .filter((s) => s.order >= mockFlowProgress.currentStepOrder)
  .map((s) => s.resourceId)
  .filter((id, i, arr) => arr.indexOf(id) === i)
  .slice(0, 3)

export const recommendedResources = pendingStepResourceIds
  .map((id) => mockResources.find((r) => r.id === id))
  .filter((r): r is NonNullable<typeof r> => r !== undefined)

export const mockUserProgress: ContinueLoopProgress = {
  currentFlow: {
    id: 'ux-portfolio',
    title: 'UX 포트폴리오 완성 플로우',
    category: 'ux-ui',
    totalResources: 12,
  },
  progressPercent: 65,
  completedResourceIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'],
  nextResources: [
    {
      id: 'r-003',
      title: '케이스 스터디 작성법',
      type: 'article',
      level: 'intermediate',
      estimatedMinutes: 15,
    },
    {
      id: 'r-004',
      title: 'Figma 프로토타입 고급',
      type: 'video',
      level: 'advanced',
      estimatedMinutes: 40,
    },
    {
      id: 'r-002',
      title: '포트폴리오 피드백 체크리스트',
      type: 'docs',
      level: 'practical',
      estimatedMinutes: 10,
    },
  ],
  lastAccessedAt: '2026-05-18T10:30:00Z',
}
