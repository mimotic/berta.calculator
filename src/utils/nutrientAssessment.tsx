import { canAssess, isMissing } from './nutritionAvailability'
import type { ReactElement } from 'react'
import type { NutritionResult } from '../data/ingredients'
import {
  type PathologyId,
  type NutrientKey,
  type NutrientRule,
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
  getNormalizedValue,
  displayUnit,
} from '../data/pathologies'
import { StatCard } from '../components/StatCard'

// Fixed display order for nutrient rule cards
const NUTRIENT_ORDER: NutrientKey[] = ['phosphorus', 'potassium', 'sodium', 'protein', 'fat', 'fiber']

export type AlertType = 'ok' | 'warn' | 'danger'

export const ALERT_CLASS: Record<AlertType, string> = {
  ok:     'bg-[#e1f5ee] text-[#0f6e56] dark:bg-[#0f3328] dark:text-[#7ad4b1]',
  warn:   'bg-[#faeeda] text-[#854f0b] dark:bg-[#3a2a10] dark:text-[#e8b980]',
  danger: 'bg-[#fcebeb] text-[#a32d2d] dark:bg-[#3a1616] dark:text-[#eb8585]',
}

/** Explicit warn threshold takes precedence over the default 85%-of-max zone. */
export function isInWarnZone(normalized: number, rule: NutrientRule): boolean {
  return rule.warn !== undefined
    ? normalized >= rule.warn
    : rule.max !== undefined && normalized > rule.max * 0.85
}

/** Traffic-light color for a normalized nutrient value against a rule. */
export function ruleColor(normalized: number, rule: NutrientRule): string {
  if (rule.max !== undefined && normalized > rule.max) return '#E24B4A'
  if (isInWarnZone(normalized, rule)) return '#EF9F27'
  if (rule.min !== undefined && normalized < rule.min) return '#EF9F27'
  return '#1D9E75'
}

export interface NutrientAssessment {
  mineralCards: { key: string; el: ReactElement }[]
  alerts: [AlertType, string][]
  fatOverLimit: boolean
  protOverLimit: boolean
  footerNotes: string[]
}

/**
 * Builds the "Minerales y parámetros" cards + alerts for a nutrition result,
 * given the kcal target and the active pathologies. Shared by the calculator
 * and the saved-recipe detail view so both show the same assessment.
 */
export function buildNutrientAssessment(
  r: NutritionResult,
  target: number,
  pathologies: PathologyId[],
): NutrientAssessment {
  const activeRules = computeActiveRules(pathologies)
  const diffK = r.kcal - target

  const mineralCards: { key: string; el: ReactElement }[] = []
  const alerts: [AlertType, string][] = []

  // kcal alert is always shown
  if (isMissing(r, 'kcal')) alerts.push(['warn', 'Energía parcial: no se puede valorar el objetivo calórico.'])
  else if (Math.abs(diffK) <= 5)   alerts.push(['ok',     `✓ Calorías en objetivo (${r.kcal.toFixed(1)} kcal)`])
  else if (diffK < 0)         alerts.push(['warn',   `Faltan ${Math.abs(diffK).toFixed(1)} kcal para llegar a ${target}`])
  else                        alerts.push(['danger', `${diffK.toFixed(1)} kcal por encima del objetivo`])

  for (const key of NUTRIENT_ORDER) {
    const rule = activeRules[key]
    if (!rule) continue

    const meta       = NUTRIENT_META[key]
    if (!canAssess(r, key, rule.basis)) {
      mineralCards.push({ key, el: <StatCard value="No disponible" label={`${meta.label}: datos incompletos`} /> })
      alerts.push(['warn', `${meta.label}: no se puede valorar con los datos disponibles.`])
      continue
    }
    const normalized = getNormalizedValue(r, key, rule.basis)
    const dUnit      = displayUnit(rule.basis, meta.unit)

    const inWarnZone = isInWarnZone(normalized, rule)
    const color = ruleColor(normalized, rule)

    // Bar reference
    const barMax   = rule.max ?? ((rule.min ?? 0) * 2 || 100)
    const barPct   = Math.min(100, (normalized / barMax) * 100)
    const barLabel = rule.min !== undefined && rule.max !== undefined
      ? `${rule.min}–${rule.max}${dUnit}`
      : rule.warn !== undefined && rule.max !== undefined
      ? `${rule.warn}–${rule.max}${dUnit}`
      : rule.max !== undefined ? `límite ${rule.max}${dUnit}` : `mín ${rule.min}${dUnit}`

    // Display value — 1 decimal for g and %, 0 for mg
    const dispVal = rule.basis === 'pct_kcal' || meta.unit === 'g'
      ? normalized.toFixed(1)
      : normalized.toFixed(0)

    mineralCards.push({
      key,
      el: (
        <StatCard
          value={dispVal}
          valueColor={color}
          label={`${meta.label} ${dUnit}`}
          barPct={barPct}
          barColor={color}
          barLabel={barLabel}
        />
      ),
    })

    // Alert
    const cap = meta.label.charAt(0).toUpperCase() + meta.label.slice(1)
    if (rule.max !== undefined && normalized > rule.max) {
      alerts.push(['danger', `${cap} ${dispVal} ${dUnit} — supera el límite de ${rule.max}${dUnit}`])
    } else if (inWarnZone) {
      alerts.push(['warn', `${cap} ${dispVal} ${dUnit} — cerca del límite`])
    } else if (rule.min !== undefined && normalized < rule.min) {
      alerts.push(['warn', `${cap} ${dispVal} ${dUnit} — por debajo del rango`])
    } else {
      alerts.push(['ok', `✓ ${cap} controlado (${dispVal} ${dUnit})`])
    }
  }

  // Determine valueColor for macro stats cards
  const fatRule  = activeRules.fat
  const fatNorm  = fatRule && canAssess(r, 'fat', fatRule.basis) ? getNormalizedValue(r, 'fat', fatRule.basis) : null
  const fatOverLimit = fatRule?.max !== undefined && fatNorm !== null && fatNorm > fatRule.max

  const protRule  = activeRules.protein
  const protNorm  = protRule && canAssess(r, 'protein', protRule.basis) ? getNormalizedValue(r, 'protein', protRule.basis) : null
  const protOverLimit = protRule?.max !== undefined && protNorm !== null && protNorm > protRule.max

  // Footer notes from active pathologies
  const footerNotes = pathologies.flatMap(id => PATHOLOGY_DEFS[id]?.notes ?? [])

  return { mineralCards, alerts, fatOverLimit, protOverLimit, footerNotes }
}
