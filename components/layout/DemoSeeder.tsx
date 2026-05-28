'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { seedDemoData } from '@/lib/utils/demo-seed'

export function DemoSeeder() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email === 'test@loopin.kr') {
      seedDemoData()
    }
  }, [session])

  return null
}
