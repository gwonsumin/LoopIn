import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { User } from '@/lib/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  const doc = await Resource.findById(id).lean()
  if (!doc) {
    return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json(normalize(doc))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  await connectDB()

  const [doc, uploader] = await Promise.all([
    Resource.findById(id),
    User.findOne({ email: session.user.email }),
  ])

  if (!doc) {
    return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 })
  }

  const isOwner = uploader && doc.uploaderId.toString() === uploader._id.toString()
  const isAdmin = uploader?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
  }

  await Resource.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
