import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'

export async function GET() {
  await connectDB()
  const categories = await Category.find().sort({ order: 1 }).lean()
  return Response.json(categories)
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const body = await req.json()
  const category = await Category.create(body)
  return Response.json(category, { status: 201 })
}
