import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

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

  return Response.json({ totalResources, flaggedResources, totalUsers, todayResources })
}
