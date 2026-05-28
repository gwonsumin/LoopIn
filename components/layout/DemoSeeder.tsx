'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { seedDemoData } from '@/lib/utils/demo-seed'

const DEMO_RESOURCE_IDS = ['r-001', 'r-002', 'r-003', 'r-005', 'r-006', 'r-017', 'r-018', 'r-009']

export function DemoSeeder() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email !== 'test@loopin.kr') return

    seedDemoData()

    // API 시딩 (MongoDB에 저장 — 1회만 실행)
    if (localStorage.getItem('loopin-demo-api-seeded') === 'true') return

    async function seedAPI() {
      for (const id of DEMO_RESOURCE_IDS) {
        try {
          await fetch('/api/loops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceId: id }),
          })
        } catch {}
      }
      localStorage.setItem('loopin-demo-api-seeded', 'true')
    }

    seedAPI()
  }, [session])

  return null
}
