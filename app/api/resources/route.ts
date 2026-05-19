import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'
import { ResourceCreateSchema } from '@/lib/validations/resource'
import { auth } from '@/auth'

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
  await connectDB()

  const { searchParams } = req.nextUrl
  const q        = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const level    = searchParams.get('level') ?? ''
  const type     = searchParams.get('type') ?? ''
  const sort     = searchParams.get('sort') ?? 'latest'
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '12'))

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

  return NextResponse.json({
    data: docs.map(normalize),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
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
