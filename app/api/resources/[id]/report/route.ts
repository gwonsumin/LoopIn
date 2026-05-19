import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  await connectDB()
  await Resource.findByIdAndUpdate(id, { isFlagged: true })
  return Response.json({ success: true })
}
