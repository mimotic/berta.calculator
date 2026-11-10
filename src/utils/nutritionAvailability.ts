import { NUTRITION_KEYS, unknownNutrients, type Ingredient, type NutritionKey, type NutritionResult, type Values } from '../data/ingredients.ts'
import { AMOUNT_FIELD, NUTRIENT_META, displayUnit, getNormalizedValue, type LimitBasis, type NutrientKey, type NutrientRule } from '../data/pathologies.ts'

// Datos incompletos: si algún ingrediente de la ración no declara un nutriente, se muestra
// igualmente la suma de los que sí lo declaran, marcada como incompleta y con el aviso de
// qué falta. Un nutriente no declarado nunca cuenta como cero, y una valoración hecha con
// datos incompletos nunca se presenta como correcta.

export type AmountKey = NutritionKey

/** Ningún ingrediente de la ración aporta un dato conocido. */
export const NO_DATA = 'Sin datos'

export const STATUS_COLOR = { ok: '#1D9E75', warn: '#EF9F27', danger: '#E24B4A', unknown: '#9b9b97' } as const

const NUTRIENT_NAMES: Record<NutritionKey, string> = {
  kcal: 'energía', prot: 'proteína', fat: 'grasa', carb: 'hidratos', fiber: 'fibra',
  phos: 'fósforo', pot: 'potasio', ca: 'calcio', na: 'sodio', fe: 'hierro', zn: 'zinc',
  vitA: 'vitamina A', vitD: 'vitamina D', vitE: 'vitamina E', vitC: 'vitamina C',
  b1: 'tiamina (B1)', b2: 'riboflavina (B2)', b3: 'niacina (B3)', b6: 'vitamina B6', b9: 'folato (B9)', b12: 'vitamina B12',
}

const VITAMINS: NutritionKey[] = ['vitA', 'vitD', 'vitE', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12']

/** «a, b y c»; con más de `max` elementos, «a, b, c y 2 más». Usa «e» ante sonido /i/ (e hidratos). */
export function listJoin(items: string[], max = Infinity): string {
  const shown = items.length > max ? [...items.slice(0, max), `${items.length - max} más`] : items
  if (shown.length <= 1) return shown.join('')
  const last = shown[shown.length - 1]
  const and = /^h?i(?![aeiouáéíóú])/i.test(last) ? 'e' : 'y'
  return `${shown.slice(0, -1).join(', ')} ${and} ${last}`
}

export function isMissing(r: NutritionResult, key: NutritionKey): boolean {
  return r.missingNutrients.includes(key)
}

/** Ingredientes de la ración sin dato completo de ese nutriente. */
export function missingSources(r: NutritionResult, key: NutritionKey): string[] {
  return r.missingBy?.[key] ?? []
}

/** «faltan datos de energía de V-Integra Renal; proteína y grasa de Nutratop Gastro Plus» */
export function describeMissing(r: NutritionResult, keys: NutritionKey[]): string {
  if (keys.length === 0) return ''
  // Agrupa los nutrientes a los que les faltan datos de los mismos ingredientes.
  const groups = new Map<string, { names: string[]; sources: string[] }>()
  for (const key of keys) {
    const sources = missingSources(r, key)
    const id = sources.join('\n')
    const group = groups.get(id) ?? { names: [], sources }
    group.names.push(NUTRIENT_NAMES[key])
    groups.set(id, group)
  }
  const parts = [...groups.values()].map(({ names, sources }) =>
    sources.length > 0 ? `${listJoin(names)} de ${listJoin(sources, 3)}` : listJoin(names))
  return `faltan datos de ${parts.join('; ')}`
}

/** Suma conocida de un nutriente; «Sin datos» si ningún ingrediente aporta un dato conocido. */
export function nutritionText(r: NutritionResult, key: NutritionKey, decimals = 1): string {
  return isMissing(r, key) && r[key] <= 0 ? NO_DATA : r[key].toFixed(decimals)
}

/** El valor mostrado es solo la parte conocida: el total real puede ser mayor. */
export function isIncomplete(r: NutritionResult, key: NutritionKey): boolean {
  return isMissing(r, key) && r[key] > 0
}

/** Texto y marca de incompleto de un total, para las filas de las tablas. */
export function amountCell(r: NutritionResult, key: NutritionKey, decimals = 1) {
  return { value: nutritionText(r, key, decimals), incomplete: isIncomplete(r, key) }
}

export function weightText(r: NutritionResult, grams: number): string {
  return r.unknownWeight && grams <= 0 ? NO_DATA : grams.toFixed(0)
}

export function isWeightIncomplete(r: NutritionResult, grams: number): boolean {
  return r.unknownWeight && grams > 0
}

// El reparto de energía entre macros solo depende de kcal, proteína y grasa: los hidratos
// no declarados reciben la energía que no explican las otras dos (ver macroKcal).
const MACRO_SPLIT_KEYS: NutritionKey[] = ['kcal', 'prot', 'fat']

/** Datos que faltan para el reparto de macros (% ME); vacío si el reparto es completo. */
export function macroSplitMissing(r: NutritionResult): NutritionKey[] {
  return MACRO_SPLIT_KEYS.filter(key => isMissing(r, key))
}

export function calciumRatioText(r: NutritionResult): string {
  if ((isMissing(r, 'ca') && r.ca <= 0) || (isMissing(r, 'phos') && r.phos <= 0)) return NO_DATA
  return r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—'
}

export function isCalciumRatioIncomplete(r: NutritionResult): boolean {
  return (isMissing(r, 'ca') || isMissing(r, 'phos')) && r.ca > 0 && r.phos > 0
}

/** Ratio comparable entre recetas: solo con calcio y fósforo completos. */
export function hasCalciumRatio(r: NutritionResult): boolean {
  return !isMissing(r, 'ca') && !isMissing(r, 'phos') && r.phos > 0
}

/** Color de las kcal frente al objetivo. Con energía incompleta solo se mantiene el exceso. */
export function kcalColor(r: NutritionResult, target: number): string {
  const diff = r.kcal - target
  if (diff > 8) return STATUS_COLOR.danger
  if (isMissing(r, 'kcal')) return STATUS_COLOR.unknown
  return Math.abs(diff) <= 8 ? STATUS_COLOR.ok : STATUS_COLOR.warn
}

/** Explicit warn threshold takes precedence over the default 85%-of-max zone. */
export function isInWarnZone(normalized: number, rule: NutrientRule): boolean {
  return rule.warn !== undefined
    ? normalized >= rule.warn
    : rule.max !== undefined && normalized > rule.max * 0.85
}

export type RuleZone = 'over' | 'warn' | 'under' | 'ok'

export interface RuleEvaluation {
  /** false: ningún dato conocido del nutriente, o sin energía para normalizarlo. */
  available: boolean
  /** El valor sale de datos incompletos (ver missing). */
  incomplete: boolean
  missing: NutritionKey[]
  normalized: number
  text: string
  unit: string
  zone: RuleZone | null
  color: string
  barPct: number
  barLabel: string
}

// Datos de los que depende una valoración: el nutriente y, según la base, la energía
// total o el reparto de macros.
function ruleInputs(key: NutrientKey, basis: LimitBasis): NutritionKey[] {
  if (basis === 'pct_kcal') return MACRO_SPLIT_KEYS
  return basis === 'per_100kcal' ? [AMOUNT_FIELD[key], 'kcal'] : [AMOUNT_FIELD[key]]
}

/**
 * Valora un nutriente frente a una regla de patología. Con datos incompletos se muestra
 * el valor conocido: se mantienen el rojo y el ámbar que ese valor ya justifica (los
 * aportes que faltan solo pueden subirlo), pero nunca el verde.
 */
export function evaluateRule(r: NutritionResult, key: NutrientKey, rule: NutrientRule): RuleEvaluation {
  const meta = NUTRIENT_META[key]
  const unit = displayUnit(rule.basis, meta.unit)
  const missing = ruleInputs(key, rule.basis).filter(k => isMissing(r, k))
  const incomplete = missing.length > 0
  const field = AMOUNT_FIELD[key]
  const barLabel = rule.min !== undefined && rule.max !== undefined
    ? `${rule.min}–${rule.max}${unit}`
    : rule.warn !== undefined && rule.max !== undefined
    ? `${rule.warn}–${rule.max}${unit}`
    : rule.max !== undefined ? `límite ${rule.max}${unit}` : rule.min !== undefined ? `mín ${rule.min}${unit}` : unit

  const available = !(isMissing(r, field) && r[field] <= 0) && (rule.basis === 'per_serving' || r.kcal > 0)
  if (!available) {
    return { available, incomplete, missing, normalized: 0, text: NO_DATA, unit, zone: null, color: STATUS_COLOR.unknown, barPct: 0, barLabel }
  }

  const normalized = getNormalizedValue(r, key, rule.basis)
  const zone: RuleZone = rule.max !== undefined && normalized > rule.max ? 'over'
    : isInWarnZone(normalized, rule) ? 'warn'
    : rule.min !== undefined && normalized < rule.min ? 'under'
    : 'ok'
  const color = zone === 'over' ? STATUS_COLOR.danger
    : zone === 'warn' ? STATUS_COLOR.warn
    : incomplete ? STATUS_COLOR.unknown
    : zone === 'under' ? STATUS_COLOR.warn
    : STATUS_COLOR.ok
  // 1 decimal para g y %, 0 para mg
  const text = rule.basis === 'pct_kcal' || meta.unit === 'g' ? normalized.toFixed(1) : normalized.toFixed(0)
  const barMax = rule.max ?? ((rule.min ?? 0) * 2 || 100)
  const barPct = Math.min(100, (normalized / barMax) * 100)
  return { available, incomplete, missing, normalized, text, unit, zone, color, barPct, barLabel }
}

function describeGaps(keys: NutritionKey[]): string {
  if (keys.length === NUTRITION_KEYS.length) return 'todos los datos nutricionales'
  const allVitamins = VITAMINS.every(key => keys.includes(key))
  const names = keys.filter(key => !(allVitamins && VITAMINS.includes(key))).map(key => NUTRIENT_NAMES[key])
  if (allVitamins) names.push('vitaminas')
  return listJoin(names)
}

/** Ingredientes usados en la ración a los que les falta algún dato, con lo que falta. */
export function incompleteIngredients(ingredients: Ingredient[], values: Values): { label: string; gaps: string }[] {
  return ingredients
    .filter(ing => (values[ing.id] ?? 0) > 0)
    .map(ing => ({ label: ing.label, keys: unknownNutrients(ing) }))
    .filter(({ keys }) => keys.length > 0)
    .map(({ label, keys }) => ({ label, gaps: describeGaps(keys) }))
}
