import { z } from 'zod'

export const ResourceCreateSchema = z.object({
  title: z.string()
    .min(2, '제목을 2자 이상 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요'),
  description: z.string()
    .min(10, '설명을 10자 이상 입력해주세요')
    .max(500, '설명은 500자 이하로 입력해주세요'),
  url: z.string()
    .url('올바른 URL 형식으로 입력해주세요'),
  category: z.enum(['ux-ui', 'frontend', 'ai-data', 'productivity'], {
    required_error: '카테고리를 선택해주세요',
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'practical'], {
    required_error: '난이도를 선택해주세요',
  }),
  type: z.enum(['lecture', 'article', 'docs', 'practice', 'video'], {
    required_error: '자료 유형을 선택해주세요',
  }),
  tags: z.array(z.string())
    .max(5, '태그는 최대 5개까지 입력할 수 있어요'),
})

export type ResourceCreateInput = z.infer<typeof ResourceCreateSchema>
