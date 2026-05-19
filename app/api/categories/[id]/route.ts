import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  const body = await req.json()
  const updated = await Category.findByIdAndUpdate(id, body, { new: true })
  if (!updated) return Response.json({ error: '카테고리를 찾을 수 없습니다.' }, { status: 404 })
  return Response.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  await Category.findByIdAndDelete(id)
  return Response.json({ success: true })
}
