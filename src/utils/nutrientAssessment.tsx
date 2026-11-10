import { NO_DATA, describeMissing, evaluateRule, isMissing, listJoin, missingSources, STATUS_COLOR } from './nutritionAvailability'
import type { ReactElement } from 'react'
import type { NutritionResult } from '../data/ingredients'
import {
  type PathologyId,
  type NutrientKey,
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
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
 *
 * With incomplete data the known values are still shown, marked as incomplete,
 * and the alert says which ingredients lack which data; they are never "ok".
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
  const kcalIncomplete = isMissing(r, 'kcal')
  const kcalNote = kcalIncomplete ? ` · incompleto: ${describeMissing(r, ['kcal'])}` : ''
  if (kcalIncomplete && r.kcal <= 0) alerts.push(['warn', `Energía: sin datos (${listJoin(missingSources(r, 'kcal'), 3)})`])
  else if (Math.abs(diffK) <= 5) {
    alerts.push(kcalIncomplete
      ? ['warn', `Calorías en objetivo con los datos conocidos (${r.kcal.toFixed(1)} kcal)${kcalNote}`]
      : ['ok', `✓ Calorías en objetivo (${r.kcal.toFixed(1)} kcal)`])
  }
  else if (diffK < 0)         alerts.push(['warn',   `Faltan ${Math.abs(diffK).toFixed(1)} kcal para llegar a ${target}${kcalNote}`])
  else                        alerts.push(['danger', `${diffK.toFixed(1)} kcal por encima del objetivo${kcalNote}`])

  for (const key of NUTRIENT_ORDER) {
    const rule = activeRules[key]
    if (!rule) continue

    const meta = NUTRIENT_META[key]
    const cap = meta.label.charAt(0).toUpperCase() + meta.label.slice(1)
    const ev = evaluateRule(r, key, rule)
    const missingText = describeMissing(r, ev.missing)

    if (!ev.available) {
      const sources = [...new Set(ev.missing.flatMap(k => missingSources(r, k)))]
      mineralCards.push({ key, el: <StatCard value={NO_DATA} valueColor={STATUS_COLOR.unknown} label={`${meta.label} ${ev.unit}`} /> })
      alerts.push(['warn', `${cap}: sin datos${sources.length > 0 ? ` (${listJoin(sources, 3)})` : ''}`])
      continue
    }

    mineralCards.push({
      key,
      el: (
        <StatCard
          value={ev.text}
          valueColor={ev.color}
          label={`${meta.label} ${ev.unit}`}
          barPct={ev.barPct}
          barColor={ev.color}
          barLabel={ev.barLabel}
          incomplete={ev.incomplete}
        />
      ),
    })

    // Alert
    const value = `${cap} ${ev.text} ${ev.unit}`
    const incompleteNote = ev.incomplete ? ` · incompleto: ${missingText}` : ''
    if (ev.zone === 'over') {
      alerts.push(['danger', `${value} — supera el límite de ${rule.max}${ev.unit}${incompleteNote}`])
    } else if (ev.zone === 'warn') {
      alerts.push(['warn', `${value} — cerca del límite${incompleteNote}`])
    } else if (ev.incomplete) {
      alerts.push(['warn', `${value} — incompleto: ${missingText}`])
    } else if (ev.zone === 'under') {
      alerts.push(['warn', `${value} — por debajo del rango`])
    } else {
      alerts.push(['ok', `✓ ${cap} controlado (${ev.text} ${ev.unit})`])
    }
  }

  // Macro stat cards turn red only when the known data already exceed the limit
  const overLimit = (key: NutrientKey) => {
    const rule = activeRules[key]
    if (!rule) return false
    const ev = evaluateRule(r, key, rule)
    return ev.available && ev.zone === 'over'
  }
  const fatOverLimit = overLimit('fat')
  const protOverLimit = overLimit('protein')

  // Footer notes from active pathologies
  const footerNotes = pathologies.flatMap(id => PATHOLOGY_DEFS[id]?.notes ?? [])

  return { mineralCards, alerts, fatOverLimit, protOverLimit, footerNotes }
}
