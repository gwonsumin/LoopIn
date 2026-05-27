import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'
import { ResourceCreateSchema } from '@/lib/validations/resource'
import { auth } from '@/auth'
import { mockResources } from '@/lib/mock/resources'

function filterMock(params: {
  q: string; category: string; level: string
  type: string; sort: string; page: number; limit: number
}) {
  let data = [...mockResources]
  if (params.q) {
    const kw = params.q.toLowerCase()
    data = data.filter(r =>
      r.title.toLowerCase().includes(kw) ||
      r.description.toLowerCase().includes(kw) ||
      r.tags.some(t => t.toLowerCase().includes(kw))
    )
  }
  if (params.category) data = data.filter(r => r.category === params.category)
  if (params.level)    data = data.filter(r => r.level === params.level)
  if (params.type)     data = data.filter(r =>
    params.type.split(',').includes(r.type)
  )
  data.sort((a, b) =>
    params.sort === 'popular'
      ? b.savedCount - a.savedCount
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const total = data.length
  const paginated = data.slice((params.page - 1) * params.limit, params.page * params.limit)
  return { data: paginated, total, totalPages: Math.ceil(total / params.limit), page: params.page }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(doc: any) {
  return {
    id: String(doc._id),
    title: doc.title as string,
    description: doc.description as string,
    category: doc.category as string,
    level: doc.level as string,
    type: doc.type as string,
    tags: doc.tags as string[],
    thumbnail: doc.thumbnail as string | undefined,
    url: doc.url as string,
    savedCount: doc.savedCount as number,
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : String(doc.createdAt),
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q        = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const level    = searchParams.get('level') ?? ''
  const type     = searchParams.get('type') ?? ''
  const sort     = searchParams.get('sort') ?? 'latest'
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '12'))

  const mockParams = { q, category, level, type, sort, page, limit }

  try {
    await connectDB()

    const filter: Record<string, unknown> = { isFlagged: false }
    if (q)        filter.$text = { $search: q }
    if (category) filter.category = category
    if (level)    filter.level = level
    if (type)     filter.type = { $in: type.split(',').filter(Boolean) }

    const sortOption: Record<string, 1 | -1> = sort === 'popular'
      ? { savedCount: -1 }
      : { createdAt: -1 }

    const [total, docs] = await Promise.all([
      Resource.countDocuments(filter),
      Resource.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ])

    if (total === 0) {
      return NextResponse.json(filterMock(mockParams))
    }

    return NextResponse.json({
      data: docs.map(normalize),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json(filterMock(mockParams))
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  await connectDB()

  const body = await req.json()
  const parsed = ResourceCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // 세션 유저를 User 컬렉션에서 찾거나 생성
  const uploader = await User.findOneAndUpdate(
    { email: session.user.email },
    { $setOnInsert: { name: session.user.name ?? 'Anonymous', email: session.user.email, image: session.user.image } },
    { upsert: true, new: true },
  )

  const resource = await Resource.create({
    ...parsed.data,
    uploaderId: uploader._id,
    savedCount: 0,
    isFlagged: false,
  })

  return NextResponse.json(normalize(resource.toObject()), { status: 201 })
}
