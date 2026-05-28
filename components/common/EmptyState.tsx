import Link from "next/link"
import type { ReactNode } from "react"

interface StateAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: "primary" | "secondary"
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  actions?: StateAction[]
  children?: ReactNode
  className?: string
}

function DefaultIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function actionClass(variant: StateAction["variant"] = "primary") {
  if (variant === "secondary") {
    return "inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
  }
  return "inline-flex min-h-11 items-center justify-center px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
}

export function EmptyState({ title, description, icon, actions, children, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 py-16 ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 mb-5">
        {icon ?? <DefaultIcon />}
      </div>
      <p className="text-neutral-800 font-semibold mb-1">{title}</p>
      {description && (
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actions && actions.length > 0 && (
        <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {actions.map((action) => (
            action.href ? (
              <Link key={action.label} href={action.href} className={actionClass(action.variant)}>
                {action.label}
              </Link>
            ) : (
              <button key={action.label} type="button" onClick={action.onClick} className={actionClass(action.variant)}>
                {action.label}
              </button>
            )
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
