'use client'

import { ErrorState } from "@/components/common/ErrorState"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh]">
      <ErrorState
        title="앗, 문제가 생겼어요"
        description="일시적인 오류예요. 다시 시도하면 대부분 해결돼요."
        onRetry={reset}
      />
    </div>
  )
}
