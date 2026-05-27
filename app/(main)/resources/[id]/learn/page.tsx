import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { mockResources } from "@/lib/mock/resources"
import type { Resource } from "@/lib/types"
import { connectDB } from "@/lib/mongodb"
import { Resource as ResourceModel } from "@/lib/models/Resource"
import { LearnClient } from "./LearnClient"

function isObjectId(id: string) {
  return /^[0-9a-f]{24}$/i.test(id)
}

async function getResource(id: string): Promise<Resource | null> {
  if (isObjectId(id)) {
    try {
      await connectDB()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await ResourceModel.findById(id).lean() as any
      if (doc) {
        return {
          id: String(doc._id),
          title: doc.title,
          description: doc.description,
          category: doc.category,
          level: doc.level,
          type: doc.type,
          tags: doc.tags,
          thumbnail: doc.thumbnail,
          url: doc.url,
          savedCount: doc.savedCount,
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
        }
      }
    } catch {
      // DB 연결 실패 시 mock으로 폴백
    }
  }
  return mockResources.find((r) => r.id === id) ?? null
}

async function getRelated(resource: Resource): Promise<Resource[]> {
  if (isObjectId(resource.id)) {
    try {
      await connectDB()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docs = await ResourceModel.find({ category: resource.category, _id: { $ne: resource.id } }).limit(3).lean() as any[]
      return docs.map((doc: any) => ({
        id: String(doc._id),
        title: doc.title,
        description: doc.description,
        category: doc.category,
        level: doc.level,
        type: doc.type,
        tags: doc.tags,
        thumbnail: doc.thumbnail,
        url: doc.url,
        savedCount: doc.savedCount,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      }))
    } catch {
      // DB 실패 시 빈 배열
    }
  }
  return mockResources
    .filter((r) => r.category === resource.category && r.id !== resource.id)
    .slice(0, 3)
}

export function generateStaticParams() {
  return mockResources.map((r) => ({ id: r.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const resource = await getResource(id)
  if (!resource) return {}
  return {
    title: `${resource.title} — 학습하기 | LoopIn`,
    description: resource.description,
  }
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resource = await getResource(id)
  if (!resource) notFound()

  const related = await getRelated(resource)

  return <LearnClient resource={resource} related={related} />
}
