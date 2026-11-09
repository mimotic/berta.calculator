import type { NutritionResult } from '../data/ingredients'
import type { LimitBasis, NutrientKey } from '../data/pathologies'

export type AmountKey = 'kcal' | 'prot' | 'fat' | 'carb' | 'fiber' | 'phos' | 'pot' | 'ca' | 'na' | 'fe' | 'zn' | 'vitA' | 'vitD' | 'vitE' | 'vitC' | 'b1' | 'b2' | 'b3' | 'b6' | 'b9' | 'b12'

export function isMissing(r: NutritionResult, key: AmountKey): boolean {
  return r.missingNutrients.includes(key)
}

/** A partial zero is not evidence of absence. Positive known sums are lower bounds. */
export function nutritionText(r: NutritionResult, key: AmountKey, decimals = 1): string {
  const value = r[key]
  return isMissing(r, key)
    ? value > 0 ? `${value.toFixed(decimals)} (parcial)` : 'No disponible'
    : value.toFixed(decimals)
}

export function weightText(r: NutritionResult, grams: number): string {
  return r.unknownWeight ? grams > 0 ? `${grams.toFixed(0)} (parcial)` : 'No disponible' : grams.toFixed(0)
}

export function hasMacroDistribution(r: NutritionResult): boolean {
  return !(['kcal', 'prot', 'fat', 'carb'] as const).some(key => isMissing(r, key))
}

export function hasCalciumRatio(r: NutritionResult): boolean {
  return !isMissing(r, 'ca') && !isMissing(r, 'phos') && r.phos > 0
}

export function calciumRatioText(r: NutritionResult): string {
  if (isMissing(r, 'ca') || isMissing(r, 'phos')) return 'No disponible'
  return r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—'
}

export function canAssess(r: NutritionResult, key: NutrientKey, basis: LimitBasis): boolean {
  const fields = { phosphorus: 'phos', potassium: 'pot', sodium: 'na', protein: 'prot', fat: 'fat', fiber: 'fiber' } as const
  if (isMissing(r, fields[key])) return false
  if (basis === 'per_serving') return true
  if (isMissing(r, 'kcal') || r.kcal <= 0) return false
  return basis !== 'pct_kcal' || hasMacroDistribution(r)
}
