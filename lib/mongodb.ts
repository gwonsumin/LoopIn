import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

const cached = global.mongoose ?? { conn: null, promise: null }
global.mongoose = cached

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI 환경변수가 설정되지 않았습니다.')

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then(m => m.connection)
  }

  cached.conn = await cached.promise
  return cached.conn
}
