import { EmptyState } from "@/components/common/EmptyState"

export default function ResourceNotFound() {
  return (
    <div className="min-h-[60vh] bg-neutral-50">
      <EmptyState
        title="자료를 찾을 수 없어요"
        description="삭제되었거나 주소가 변경된 자료일 수 있어요. 다른 학습 자료를 탐색해보세요."
        actions={[
          { label: "검색으로 돌아가기", href: "/search" },
          { label: "홈으로 이동", href: "/", variant: "secondary" },
        ]}
      />
    </div>
  )
}
