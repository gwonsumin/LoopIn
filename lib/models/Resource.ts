import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IResource extends Document {
  title: string
  description: string
  category: 'ux-ui' | 'frontend' | 'ai-data' | 'productivity' | 'design-tool'
  level: 'beginner' | 'intermediate' | 'advanced' | 'practical'
  type: 'lecture' | 'article' | 'docs' | 'practice' | 'video'
  url: string
  tags: string[]
  thumbnail?: string
  uploaderId: mongoose.Types.ObjectId
  savedCount: number
  isFlagged: boolean
  createdAt: Date
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    category: {
      type: String,
      enum: ['ux-ui', 'frontend', 'ai-data', 'productivity', 'design-tool'],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'practical'],
      required: true,
    },
    type: {
      type: String,
      enum: ['lecture', 'article', 'docs', 'practice', 'video'],
      required: true,
    },
    url: { type: String, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    savedCount: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
)

ResourceSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 }, name: 'text_search' }
)

ResourceSchema.index({ category: 1, level: 1 })
ResourceSchema.index({ isFlagged: 1, createdAt: -1 })
ResourceSchema.index({ savedCount: -1 })

export const Resource: Model<IResource> =
  mongoose.models.Resource ||
  mongoose.model<IResource>('Resource', ResourceSchema)
