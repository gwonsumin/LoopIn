import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Resource } from '@/lib/models/Resource'

export async function PATCH(req: Request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { resourceId, isFlagged } = await req.json()
  await Resource.findByIdAndUpdate(resourceId, { isFlagged })
  return Response.json({ success: true })
}
