import { HeroSection } from "@/components/hero/HeroSection"
import ContinueLoopSection from "@/components/home/ContinueLoopSection"
import LearningFlowsSection from "@/components/home/LearningFlowsSection"
import ExploreSection from "@/components/home/ExploreSection"
import WhyLoopInSection from "@/components/home/WhyLoopInSection"
import NewsletterSection from "@/components/home/NewsletterSection"
import { mockUserProgress } from "@/lib/mock/user-progress"
import { mockFlows } from "@/lib/mock/flows"
import { mockCategories } from "@/lib/mock/categories"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ContinueLoopSection progress={mockUserProgress} />
      <LearningFlowsSection flows={mockFlows} />
      <ExploreSection categories={mockCategories} />
      <WhyLoopInSection />
      <NewsletterSection />
    </>
  )
}
