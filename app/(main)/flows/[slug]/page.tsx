import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { mockFlows } from "@/lib/mock/flows"
import { FlowClient } from "./FlowClient"

// ── Static ────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return mockFlows.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const flow = mockFlows.find((f) => f.slug === slug)
  if (!flow) return {}
  return {
    title: `${flow.title} — LoopIn`,
    description: flow.description,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function FlowPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const flow = mockFlows.find((f) => f.slug === slug)
  if (!flow) notFound()

  return <FlowClient flow={flow} />
}
