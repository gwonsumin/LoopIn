import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoSeeder } from '@/components/layout/DemoSeeder'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <DemoSeeder />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  )
}
