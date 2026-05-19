import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Loop } from '@/lib/models/Loop'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

async function getUploader(email: string) {
  return User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name: 'Anonymous', email } },
    { upsert: true, new: true },
  )
}

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  await connectDB()
  const uploader = await getUploader(session.user.email)

  const loops = await Loop.find({ userId: uploader._id })
    .populate('resourceId')
    .lean()

  const resources = loops
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((l) => l.resourceId as any)
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((doc: any) => ({
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
        ? (doc.createdAt as Date).toISOString()
        : String(doc.createdAt),
    }))

  return NextResponse.json({ data: resources })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { resourceId } = await req.json()
  if (!mongoose.isValidObjectId(resourceId)) {
    return NextResponse.json({ error: '유효하지 않은 자료 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  const uploader = await getUploader(session.user.email)

  const existing = await Loop.findOne({ userId: uploader._id, resourceId })
  if (existing) {
    return NextResponse.json({ error: '이미 저장된 자료입니다.' }, { status: 409 })
  }

  await Promise.all([
    Loop.create({ userId: uploader._id, resourceId }),
    Resource.findByIdAndUpdate(resourceId, { $inc: { savedCount: 1 } }),
  ])

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const resourceId = req.nextUrl.searchParams.get('resourceId')
  if (!resourceId || !mongoose.isValidObjectId(resourceId)) {
    return NextResponse.json({ error: '유효하지 않은 자료 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  const uploader = await getUploader(session.user.email)

  const deleted = await Loop.findOneAndDelete({ userId: uploader._id, resourceId })
  if (deleted) {
    await Resource.findByIdAndUpdate(resourceId, { $inc: { savedCount: -1 } })
  }

  return NextResponse.json({ success: true })
}
