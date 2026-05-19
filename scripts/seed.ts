import mongoose from 'mongoose'
import { mockResources } from '../lib/mock/resources'

// ── 인라인 모델 정의 (import 경로 문제 우회) ─────────────────────────────

const CategorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role:  { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true })

const ResourceSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  category:    { type: String, enum: ['ux-ui', 'frontend', 'ai-data', 'productivity', 'design-tool'], required: true },
  level:       { type: String, enum: ['beginner', 'intermediate', 'advanced', 'practical'], required: true },
  type:        { type: String, enum: ['lecture', 'article', 'docs', 'practice', 'video'], required: true },
  url:         { type: String, required: true },
  tags:        [{ type: String }],
  thumbnail:   { type: String },
  uploaderId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  savedCount:  { type: Number, default: 0 },
  isFlagged:   { type: Boolean, default: false },
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const User     = mongoose.models.User     || mongoose.model('User', UserSchema)
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)

// ── 시드 데이터 ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'UX/UI',   slug: 'ux-ui',        order: 1 },
  { name: '프론트엔드', slug: 'frontend',     order: 2 },
  { name: 'AI·데이터', slug: 'ai-data',      order: 3 },
  { name: '생산성',   slug: 'productivity',  order: 4 },
]

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI 환경변수를 설정해주세요.')

  await mongoose.connect(uri, { bufferCommands: false })
  console.log('✅ MongoDB 연결 완료')

  // 기존 데이터 초기화
  await Promise.all([
    Category.deleteMany({}),
    Resource.deleteMany({}),
  ])
  console.log('🗑  기존 데이터 삭제')

  // 카테고리 삽입
  await Category.insertMany(CATEGORIES)
  console.log(`📂 카테고리 ${CATEGORIES.length}개 삽입`)

  // 어드민 유저 upsert
  const admin = await User.findOneAndUpdate(
    { email: 'admin@loopin.dev' },
    { $setOnInsert: { name: 'Admin', email: 'admin@loopin.dev', role: 'admin' } },
    { upsert: true, new: true },
  )
  console.log(`👤 어드민 유저: ${admin._id}`)

  // 자료 삽입
  const docs = mockResources.map((r) => ({
    title:       r.title,
    description: r.description,
    category:    r.category,
    level:       r.level,
    type:        r.type,
    url:         r.url,
    tags:        r.tags,
    thumbnail:   r.thumbnail,
    uploaderId:  admin._id,
    savedCount:  r.savedCount,
    isFlagged:   false,
    createdAt:   new Date(r.createdAt),
  }))

  await Resource.insertMany(docs)
  console.log(`📚 자료 ${docs.length}건 삽입`)

  await mongoose.disconnect()
  console.log('✅ 완료')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
