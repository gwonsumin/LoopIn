import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/lib/models/Subscriber'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return NextResponse.json({ message: 'invalid_email' }, { status: 400 })
    }

    await connectDB()

    const existing = await Subscriber.findOne({ email: email.trim() })
    if (existing) {
      return NextResponse.json({ message: 'already_subscribed' }, { status: 200 })
    }

    await Subscriber.create({ email: email.trim() })
    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'server_error' }, { status: 500 })
  }
}
