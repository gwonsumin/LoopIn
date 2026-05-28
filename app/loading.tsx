import { LoadingState } from "@/components/common/LoadingState"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoadingState rows={6} />
    </div>
  )
}
