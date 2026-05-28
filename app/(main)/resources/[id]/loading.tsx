import { LoadingState } from "@/components/common/LoadingState"

export default function Loading() {
  return (
    <div className="bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <LoadingState variant="detail" />
      </div>
    </div>
  )
}
