"use client"

import { LayoutGrid, List } from "lucide-react"

interface Props {
  total: number
  sort: string
  onSortChange: (sort: string) => void
  view: "grid" | "list"
  onViewChange: (v: "grid" | "list") => void
}

export default function SortBar({ total, sort, onSortChange, view, onViewChange }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-neutral-500">{total}개의 자료를 찾았습니다</p>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
          {(["latest", "popular"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onSortChange(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sort === v
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {v === "latest" ? "최신순" : "인기순"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              view === "grid"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
            aria-label="그리드 보기"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              view === "list"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
            aria-label="리스트 보기"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
