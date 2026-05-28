import { EmptyState } from "@/components/common/EmptyState"

export default function NotFound() {
  return (
    <div className="min-h-[60vh]">
      <EmptyState
        title="이 페이지는 없는 것 같아요"
        description="주소가 바뀌었거나 삭제된 페이지일 수 있어요."
        actions={[
          { label: "홈으로 이동", href: "/" },
          { label: "자료 탐색하기", href: "/search", variant: "secondary" },
        ]}
      />
    </div>
  )
}
