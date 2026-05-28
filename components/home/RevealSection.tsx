'use client'

import type { ReactNode } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"

interface Props {
  children: ReactNode
  delay?: number
}

export default function RevealSection({ children, delay = 0 }: Props) {
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  )
}
