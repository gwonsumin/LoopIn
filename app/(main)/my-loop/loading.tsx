import { LoadingState } from "@/components/common/LoadingState"

export default function Loading() {
  return (
    <div className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-28 bg-neutral-100 rounded-lg animate-pulse" />
          <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
        </div>
        <LoadingState rows={6} />
      </div>
    </div>
  )
}
