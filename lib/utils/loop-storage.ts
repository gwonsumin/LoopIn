const STORAGE_KEY = "loopin_saved"

function getSaved(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function setSaved(ids: string[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function isSaved(resourceId: string): boolean {
  return getSaved().includes(resourceId)
}

export function toggleSaved(resourceId: string): boolean {
  const saved = getSaved()
  const exists = saved.includes(resourceId)
  if (exists) {
    setSaved(saved.filter((id) => id !== resourceId))
    return false
  } else {
    setSaved([...saved, resourceId])
    return true
  }
}

export function getAllSaved(): string[] {
  return getSaved()
}
