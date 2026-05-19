import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'

interface StatCard {
  label: string
  value: number
  highlight?: boolean
}

function Card({ label, value, highlight }: StatCard) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <p className={`text-3xl font-bold ${highlight ? 'text-red-500' : 'text-neutral-900'}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-neutral-400 mt-1">{label}</p>
    </div>
  )
}

export default async function AdminDashboard() {
  await auth() // layout already guards, but keeps type inference

  await connectDB()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalResources, flaggedResources, totalUsers, todayResources] =
    await Promise.all([
      Resource.countDocuments(),
      Resource.countDocuments({ isFlagged: true }),
      User.countDocuments(),
      Resource.countDocuments({ createdAt: { $gte: today } }),
    ])

  const stats: StatCard[] = [
    { label: '전체 자료 수', value: totalResources },
    { label: '신고된 자료', value: flaggedResources, highlight: flaggedResources > 0 },
    { label: '전체 사용자', value: totalUsers },
    { label: '오늘 등록', value: todayResources },
  ]

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">관리자 대시보드</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} {...s} />
        ))}
      </div>
    </>
  )
}
