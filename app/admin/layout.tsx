import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: '대시보드', href: '/admin' },
  { label: '자료 관리', href: '/admin/resources' },
  { label: '카테고리', href: '/admin/categories' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="w-48 shrink-0 min-h-screen bg-white border-r border-neutral-100 p-4 pt-8">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">관리자</p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  )
}
