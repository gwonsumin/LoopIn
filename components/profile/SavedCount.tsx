'use client'

import { useState, useEffect } from 'react'
import { getAllSaved } from '@/lib/utils/loop-storage'

export function SavedCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getAllSaved().length)
    function onUpdate() { setCount(getAllSaved().length) }
    window.addEventListener('loopin-loop-updated', onUpdate)
    return () => window.removeEventListener('loopin-loop-updated', onUpdate)
  }, [])

  return <span>{count}</span>
}
