import type { Metadata } from 'next'
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import { Loop } from "@/lib/models/Loop"
import { User } from "@/lib/models/User"
import type { Resource, CategorySlug, Level, ResourceType } from "@/lib/types"
import { HeroSection } from "@/components/hero/HeroSection"
import ContinueLoopSection from "@/components/home/ContinueLoopSection"
import LearningFlowsSection from "@/components/home/LearningFlowsSection"
import ExploreSection from "@/components/home/ExploreSection"
import WhyLoopInSection from "@/components/home/WhyLoopInSection"
import NewsletterSection from "@/components/home/NewsletterSection"
import RevealSection from "@/components/home/RevealSection"
import { mockFlows } from "@/lib/mock/flows"
import { mockCategories } from "@/lib/mock/categories"
import { mockResources } from "@/lib/mock/resources"

export const metadata: Metadata = {
  title: '홈',
  description: '지금 뜨는 디지털 직무 강의를 탐색하고, 나만의 학습 루프를 시작해보세요.',
  openGraph: {
    title: 'LoopIn — 내 학습 흐름을 설계하는 공간',
    description: '지금 뜨는 디지털 직무 강의를 탐색하고, 나만의 학습 루프를 시작해보세요.',
  },
}

async function getRecentSaved(email: string): Promise<Resource[]> {
  try {
    await connectDB()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await User.findOne({ email }).lean() as any
    if (!user) return []

    const loops = await Loop.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("resourceId")
      .lean()

    return loops
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((l) => l.resourceId as any)
      .filter(Boolean)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((doc: any) => ({
        id: String(doc._id),
        title: doc.title as string,
        description: doc.description as string,
        category: doc.category as CategorySlug,
        level: doc.level as Level,
        type: doc.type as ResourceType,
        tags: doc.tags as string[],
        thumbnail: doc.thumbnail as string | undefined,
        url: doc.url as string,
        savedCount: doc.savedCount as number,
        createdAt: doc.createdAt instanceof Date
          ? (doc.createdAt as Date).toISOString()
          : String(doc.createdAt),
      }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const session = await auth()
  const recentSaved: Resource[] = session?.user?.email === 'test@loopin.kr'
    ? mockResources.filter(r => ['r-001', 'r-002', 'r-003', 'r-005', 'r-006', 'r-017'].includes(r.id))
    : session?.user?.email
      ? await getRecentSaved(session.user.email)
      : []

  return (
    <>
      <RevealSection delay={0}>
        <HeroSection />
      </RevealSection>
      {recentSaved.length > 0 && (
        <RevealSection delay={0}>
          <ContinueLoopSection resources={recentSaved} />
        </RevealSection>
      )}
      <LearningFlowsSection flows={mockFlows} />
      <ExploreSection categories={mockCategories} />
      <WhyLoopInSection />
      <RevealSection delay={0}>
        <NewsletterSection />
      </RevealSection>
    </>
  )
}
