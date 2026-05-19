import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const { searchParams } = req.nextUrl
  const q          = searchParams.get('q') ?? ''
  const flaggedOnly = searchParams.get('flaggedOnly') === 'true'
  const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit      = 20

  const filter: Record<string, unknown> = {}
  if (q) filter.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } },
  ]
  if (flaggedOnly) filter.isFlagged = true

  const [total, docs] = await Promise.all([
    Resource.countDocuments(filter),
    Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = docs.map((d: any) => ({
    id: String(d._id),
    title: d.title as string,
    category: d.category as string,
    level: d.level as string,
    type: d.type as string,
    isFlagged: d.isFlagged as boolean,
    savedCount: d.savedCount as number,
    createdAt: (d.createdAt as Date).toISOString(),
  }))

  return Response.json({ data, total, totalPages: Math.ceil(total / limit), page })
}
