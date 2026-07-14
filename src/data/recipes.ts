import type { Values } from './ingredients'
import type { PathologyId } from './pathologies'

export interface SavedRecipe {
  id: string
  title: string
  createdAt: string
  kcalTarget: number
  pathologies: PathologyId[]
  values: Values
}

const RECIPES_STORAGE_KEY = 'foodCalculator.recipes'

export function loadRecipes(): SavedRecipe[] {
  try {
    const raw = localStorage.getItem(RECIPES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is SavedRecipe =>
        typeof r === 'object' && r !== null &&
        typeof r.id === 'string' &&
        typeof r.title === 'string' &&
        typeof r.createdAt === 'string' &&
        typeof r.kcalTarget === 'number' &&
        Array.isArray(r.pathologies) &&
        typeof r.values === 'object' && r.values !== null
    )
  } catch {
    return []
  }
}

export function getRecipe(id: string): SavedRecipe | null {
  return loadRecipes().find(r => r.id === id) ?? null
}

export function saveRecipe(recipe: Omit<SavedRecipe, 'id' | 'createdAt'>): SavedRecipe {
  const full: SavedRecipe = {
    ...recipe,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  }
  const next = [full, ...loadRecipes()]
  try { localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  return full
}

export function deleteRecipe(id: string): SavedRecipe[] {
  const next = loadRecipes().filter(r => r.id !== id)
  try { localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  return next
}
