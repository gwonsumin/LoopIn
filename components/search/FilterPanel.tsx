"use client"

const CATEGORIES = [
  { label: "전체",      value: "" },
  { label: "UX·UI",    value: "ux-ui" },
  { label: "프론트엔드", value: "frontend" },
  { label: "AI·데이터", value: "ai-data" },
  { label: "생산성",    value: "productivity" },
  { label: "디자인 툴", value: "design-tool" },
]

const LEVELS = [
  { label: "전체",    value: "" },
  { label: "입문",    value: "beginner" },
  { label: "중급",    value: "intermediate" },
  { label: "고급",    value: "advanced" },
  { label: "실무 활용", value: "practical" },
]

const TYPES = [
  { label: "강의",   value: "lecture" },
  { label: "아티클", value: "article" },
  { label: "문서",   value: "docs" },
  { label: "실습",   value: "practice" },
  { label: "영상",   value: "video" },
]

export interface FilterSelected {
  category: string
  level: string
  types: string[]
}

interface Props {
  selected: FilterSelected
  onChange: (key: string, value: string | string[]) => void
  onReset: () => void
}

export default function FilterPanel({ selected, onChange, onReset }: Props) {
  const activeCount =
    (selected.category ? 1 : 0) +
    (selected.level ? 1 : 0) +
    selected.types.length

  function toggleType(type: string) {
    const next = selected.types.includes(type)
      ? selected.types.filter((t) => t !== type)
      : [...selected.types, type]
    onChange("types", next)
  }

  return (
    <div>
      {/* 헤더 + 초기화 */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-neutral-800">필터</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-11 items-center gap-1.5 text-xs text-neutral-400 hover:text-primary transition-colors"
          >
            필터 초기화
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              {activeCount}
            </span>
          </button>
        )}
      </div>

      {/* 카테고리 */}
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-5">
        카테고리
      </p>
      <div className="space-y-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange("category", cat.value)}
            className={`text-sm min-h-11 py-1.5 px-3 rounded-lg w-full text-left transition-colors ${
              selected.category === cat.value
                ? "bg-primary/10 text-primary font-medium"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 난이도 */}
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-5">
        난이도
      </p>
      <div className="space-y-0.5">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.value}
            type="button"
            onClick={() => onChange("level", lvl.value)}
            className={`text-sm min-h-11 py-1.5 px-3 rounded-lg w-full text-left transition-colors ${
              selected.level === lvl.value
                ? "bg-primary/10 text-primary font-medium"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* 자료 유형 */}
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-5">
        자료 유형
      </p>
      <div className="space-y-0.5">
        {TYPES.map((typ) => {
          const checked = selected.types.includes(typ.value)
          return (
            <button
              key={typ.value}
              type="button"
              onClick={() => toggleType(typ.value)}
              className={`text-sm min-h-11 py-1.5 px-3 rounded-lg w-full text-left transition-colors flex items-center gap-2 ${
                checked
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  checked ? "bg-primary border-primary" : "border-neutral-300"
                }`}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {typ.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
