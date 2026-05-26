import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscriber extends Document {
  email: string
  subscribedAt: Date
  source: string
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: () => new Date() },
  source: { type: String, default: 'newsletter' },
})

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
