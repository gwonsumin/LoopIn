'use client'

import { useState, useEffect } from 'react'
import { getAllSaved } from '@/lib/utils/loop-storage'

export function ProfileStats() {
  const [saved, setSaved] = useState(0)
  const [inProgress, setInProgress] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [flowCount, setFlowCount] = useState(0)

  useEffect(() => {
    setSaved(getAllSaved().length)

    let prog = 0, done = 0
    Object.keys(localStorage)
      .filter(k => k.startsWith('loopin-progress-'))
      .forEach(k => {
        try {
          const d = JSON.parse(localStorage.getItem(k) ?? '')
          if (d.status === 'completed') done++
          else if (d.percent > 0) prog++
        } catch {}
      })
    setInProgress(prog)
    setCompleted(done)

    try {
      const flows = JSON.parse(localStorage.getItem('loopin-my-flows') ?? '[]')
      setFlowCount(flows.length)
    } catch {}
  }, [])

  const stats = [
    { label: '저장한 자료', value: `${saved}개`, sub: '전체 저장' },
    { label: '진행 중', value: `${inProgress}개`, sub: '학습 중인 자료' },
    { label: '완료한 자료', value: `${completed}개`, sub: '학습 완료' },
    { label: '내 Flow', value: `${flowCount}개`, sub: '만든 학습 흐름' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {stats.map(({ label, value, sub }) => (
        <div key={label} className="rounded-2xl border border-neutral-100 bg-white px-5 py-4">
          <p className="text-xs text-neutral-400 mb-1">{sub}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm font-medium text-neutral-600 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
