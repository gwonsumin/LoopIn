import { Bookmark, PlayCircle, GitBranch, Clock } from "lucide-react"

interface Props {
  savedCount: number
  inProgressCount: number
  flowCount: number
}

const STATS = [
  {
    icon: Bookmark,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    label: "저장한 자료",
    sub: "전체 저장 자료",
    key: "saved" as const,
  },
  {
    icon: PlayCircle,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    label: "이어본 자료",
    sub: "이어서 학습 중",
    key: "inProgress" as const,
  },
  {
    icon: GitBranch,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    label: "학습 Flow",
    sub: "생성한 Flow",
    key: "flow" as const,
  },
  {
    icon: Clock,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    label: "총 학습 시간",
    sub: "이번 달 기준",
    key: "time" as const,
  },
]

const MOCK_VALUES: Record<string, string> = {
  flow: "6개",
  time: "42시간",
}

export function StatsRow({ savedCount, inProgressCount, flowCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(({ icon: Icon, iconBg, iconColor, label, sub, key }) => {
        let value: string
        if (key === "saved") value = `${savedCount}개`
        else if (key === "inProgress") value = `${inProgressCount}개`
        else if (key === "flow") value = `${flowCount}개`
        else value = MOCK_VALUES[key]

        return (
          <div key={label} className="rounded-2xl bg-white border border-neutral-100 p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-3">{value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
            <p className="text-sm font-medium text-neutral-600 mt-1">{label}</p>
          </div>
        )
      })}
    </div>
  )
}
