"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  total: number
  sort: string
  onSortChange: (sort: string) => void
}

export default function SortBar({ total, sort, onSortChange }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-neutral-500">{total}개의 자료를 찾았습니다</p>
      <Select value={sort} onValueChange={(v) => v && onSortChange(v)}>
        <SelectTrigger className="w-28">
          <SelectValue>
            {sort === "popular" ? "인기순" : "최신순"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="popular">인기순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
