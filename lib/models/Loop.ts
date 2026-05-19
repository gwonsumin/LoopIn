import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILoop extends Document {
  userId: mongoose.Types.ObjectId
  resourceId: mongoose.Types.ObjectId
  createdAt: Date
}

const LoopSchema = new Schema<ILoop>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  },
  { timestamps: true }
)

LoopSchema.index({ userId: 1, resourceId: 1 }, { unique: true })

export const Loop: Model<ILoop> =
  mongoose.models.Loop ||
  mongoose.model<ILoop>('Loop', LoopSchema)
