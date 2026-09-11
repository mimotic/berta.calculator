import { Link, useSearchParams } from 'react-router'
import '../index.css'
import { INGREDIENTS, calcNutrition, type NutritionResult } from '../data/ingredients'
import { loadRecipes, type SavedRecipe } from '../data/recipes'
import {
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
  getNormalizedValue,
  displayUnit,
  type NutrientKey,
  type PathologyId,
} from '../data/pathologies'
import { Header } from '../components/Header'
import { MacroDonut } from '../components/MacroDonut'
import { ALERT_CLASS, buildNutrientAssessment, ruleColor } from '../utils/nutrientAssessment'

const GROUP_LABELS: { group: 'hc' | 'verdura' | 'fruta' | 'prot' | 'fat'; label: string }[] = [
  { group: 'hc', label: 'Hidratos' },
  { group: 'verdura', label: 'Verduras' },
  { group: 'fruta', label: 'Frutas' },
  { group: 'prot', label: 'Proteína' },
  { group: 'fat', label: 'Grasa' },
]

const NUTRIENT_ORDER: NutrientKey[] = ['phosphorus', 'potassium', 'sodium', 'protein', 'fat', 'fiber']

const MICROS: { key: keyof NutritionResult; label: string; unit: string; decimals: number }[] = [
  { key: 'ca',    label: 'Calcio',           unit: 'mg', decimals: 1 },
  { key: 'phos',  label: 'Fósforo',          unit: 'mg', decimals: 1 },
  { key: 'na',    label: 'Sodio',            unit: 'mg', decimals: 1 },
  { key: 'pot',   label: 'Potasio',          unit: 'mg', decimals: 1 },
  { key: 'fe',    label: 'Hierro',           unit: 'mg', decimals: 2 },
  { key: 'zn',    label: 'Zinc',             unit: 'mg', decimals: 2 },
  { key: 'vitA',  label: 'Vitamina A',       unit: 'µg', decimals: 0 },
  { key: 'vitD',  label: 'Vitamina D',       unit: 'µg', decimals: 2 },
  { key: 'vitE',  label: 'Vitamina E',       unit: 'mg', decimals: 2 },
  { key: 'vitC',  label: 'Vitamina C',       unit: 'mg', decimals: 1 },
  { key: 'b1',    label: 'Tiamina (B1)',     unit: 'mg', decimals: 2 },
  { key: 'b2',    label: 'Riboflavina (B2)', unit: 'mg', decimals: 2 },
  { key: 'b3',    label: 'Niacina (B3)',     unit: 'mg', decimals: 1 },
  { key: 'b6',    label: 'Vitamina B6',      unit: 'mg', decimals: 2 },
  { key: 'b9',    label: 'Folato (B9)',      unit: 'µg', decimals: 0 },
  { key: 'b12',   label: 'Vitamina B12',     unit: 'µg', decimals: 2 },
  { key: 'fiber', label: 'Fibra',            unit: 'g',  decimals: 1 },
]

const A_COLOR = '#5B8DEF'
const B_COLOR = '#EF9F27'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDelta(a: number, b: number, decimals: number): { text: string; sign: -1 | 0 | 1 } {
  const d = b - a
  const eps = Math.pow(10, -decimals) / 2
  if (Math.abs(d) < eps) return { text: '=', sign: 0 }
  return { text: `${d > 0 ? '+' : '−'}${Math.abs(d).toFixed(decimals)}`, sign: d > 0 ? 1 : -1 }
}

function DeltaCell({ a, b, decimals }: { a: number; b: number; decimals: number }) {
  const { text, sign } = formatDelta(a, b, decimals)
  return (
    <span
      className={`font-mono tabular-nums text-[11px] ${sign === 0 ? 'text-[#9a9a95] dark:text-[#6b6b67]' : 'text-[#6b6b67] dark:text-[#8a8a85]'}`}
    >
      {text}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-3 font-mono">
      {children}
    </div>
  )
}

function ColumnHeads({ a, b, showDelta = true }: { a: SavedRecipe; b: SavedRecipe; showDelta?: boolean }) {
  return (
    <div className={`grid ${showDelta ? 'grid-cols-[1fr_auto_auto_auto]' : 'grid-cols-[1fr_auto_auto]'} gap-x-4 pb-2 mb-1 border-b border-black/10 dark:border-white/10 text-[10px] font-mono uppercase tracking-wider`}>
      <span />
      <span className="text-right truncate max-w-28" style={{ color: A_COLOR }} title={a.title}>A</span>
      <span className="text-right truncate max-w-28" style={{ color: B_COLOR }} title={b.title}>B</span>
      {showDelta && <span className="text-right text-[#9a9a95] dark:text-[#6b6b67]">Δ B−A</span>}
    </div>
  )
}

function RecipeSelect({
  slot,
  color,
  value,
  recipes,
  onChange,
}: {
  slot: 'A' | 'B'
  color: string
  value: string
  recipes: SavedRecipe[]
  onChange: (id: string) => void
}) {
  const selected = recipes.find(r => r.id === value)
  return (
    <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-4" style={{ borderTopColor: color, borderTopWidth: 3 }}>
      <label className="block text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color }}>
        Receta {slot}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#f2f0ec] dark:bg-[#242220] border border-black/10 dark:border-white/10 rounded-md px-3 py-2 text-[13px] font-serif text-[#1a1a18] dark:text-[#e8e6e0] cursor-pointer focus:outline-none focus:border-[#5B8DEF]"
      >
        <option value="">— elige una receta —</option>
        {recipes.map(r => (
          <option key={r.id} value={r.id}>{r.title}</option>
        ))}
      </select>
      {selected ? (
        <div className="flex items-center justify-between gap-3 mt-2">
          <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono truncate">
            {formatDate(selected.createdAt)} · {selected.kcalTarget} kcal
            {selected.pathologies.length > 0 && ` · ${selected.pathologies.map(id => PATHOLOGY_DEFS[id]?.label.toLowerCase()).filter(Boolean).join(' · ')}`}
          </p>
          <Link
            to={`/recetas/${selected.id}`}
            className="shrink-0 text-[11px] font-mono text-[#5B8DEF] hover:opacity-80 transition-opacity"
          >
            Ver →
          </Link>
        </div>
      ) : (
        <p className="text-[11px] text-[#9a9a95] dark:text-[#6b6b67] font-mono mt-2">sin seleccionar</p>
      )}
    </div>
  )
}

export default function CompareRecipes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const recipes = loadRecipes()

  const idA = searchParams.get('a') ?? ''
  const idB = searchParams.get('b') ?? ''
  const recipeA = recipes.find(r => r.id === idA) ?? null
  const recipeB = recipes.find(r => r.id === idB) ?? null

  const setSlot = (slot: 'a' | 'b', id: string) => {
    const next = new URLSearchParams(searchParams)
    if (id) next.set(slot, id)
    else next.delete(slot)
    setSearchParams(next, { replace: true })
  }

  const swap = () => {
    const next = new URLSearchParams(searchParams)
    if (idB) next.set('a', idB); else next.delete('a')
    if (idA) next.set('b', idA); else next.delete('b')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Comparar recetas</h1>
            <Link
              to="/recetas"
              className="text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors shrink-0"
            >
              Mis recetas →
            </Link>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            elige dos recetas guardadas para ver sus diferencias lado a lado
          </p>
        </header>

        {recipes.length < 2 ? (
          <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center">
            <p className="text-sm text-[#6b6b67] dark:text-[#8a8a85] mb-4">
              {recipes.length === 0
                ? 'Todavía no has guardado ninguna receta.'
                : 'Necesitas al menos dos recetas guardadas para compararlas.'}
            </p>
            <Link
              to="/calculadora"
              className="text-[13px] font-mono text-[#5B8DEF] underline hover:opacity-80 transition-opacity"
            >
              ir a la calculadora de dieta →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch mb-6">
              <RecipeSelect slot="A" color={A_COLOR} value={idA} recipes={recipes} onChange={id => setSlot('a', id)} />
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={swap}
                  disabled={!idA && !idB}
                  title="Intercambiar A y B"
                  className="px-3 py-1.5 text-[11px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                >
                  ⇄
                </button>
              </div>
              <RecipeSelect slot="B" color={B_COLOR} value={idB} recipes={recipes} onChange={id => setSlot('b', id)} />
            </div>

            {recipeA && recipeB ? (
              recipeA.id === recipeB.id ? (
                <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center">
                  <p className="text-sm text-[#6b6b67] dark:text-[#8a8a85]">
                    Has elegido la misma receta en los dos lados. Selecciona otra distinta para compararlas.
                  </p>
                </div>
              ) : (
                <Comparison a={recipeA} b={recipeB} />
              )
            ) : (
              <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center">
                <p className="text-sm text-[#6b6b67] dark:text-[#8a8a85]">
                  Selecciona una receta en cada lado para ver la comparación.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

function Comparison({ a, b }: { a: SavedRecipe; b: SavedRecipe }) {
  const usedA = INGREDIENTS.filter(i => (a.values[i.id] ?? 0) > 0)
  const usedB = INGREDIENTS.filter(i => (b.values[i.id] ?? 0) > 0)
  const usedIds = new Set([...usedA, ...usedB].map(i => i.id))
  const union = INGREDIENTS.filter(i => usedIds.has(i.id))

  const rA = calcNutrition(a.values, usedA)
  const rB = calcNutrition(b.values, usedB)
  const totalA = usedA.reduce((s, i) => s + (a.values[i.id] ?? 0), 0)
  const totalB = usedB.reduce((s, i) => s + (b.values[i.id] ?? 0), 0)

  const assessA = buildNutrientAssessment(rA, a.kcalTarget, a.pathologies)
  const assessB = buildNutrientAssessment(rB, b.kcalTarget, b.pathologies)

  // Rules to compare against: union of both recipes' pathologies (strictest limit wins)
  const unionPathologies = Array.from(new Set<PathologyId>([...a.pathologies, ...b.pathologies]))
  const rules = computeActiveRules(unionPathologies)
  const samePathologies =
    a.pathologies.length === b.pathologies.length &&
    a.pathologies.every(p => b.pathologies.includes(p))

  const kcalColor = (r: NutritionResult, target: number) => {
    const diff = r.kcal - target
    return Math.abs(diff) <= 8 ? '#1D9E75' : diff < 0 ? '#EF9F27' : '#E24B4A'
  }

  const macroRows: { label: string; a: number; b: number; decimals: number; unit: string; colorA?: string; colorB?: string }[] = [
    { label: 'Objetivo', a: a.kcalTarget, b: b.kcalTarget, decimals: 0, unit: 'kcal' },
    { label: 'Energía', a: rA.kcal, b: rB.kcal, decimals: 1, unit: 'kcal', colorA: kcalColor(rA, a.kcalTarget), colorB: kcalColor(rB, b.kcalTarget) },
    { label: 'Proteína', a: rA.prot, b: rB.prot, decimals: 1, unit: 'g', colorA: assessA.protOverLimit ? '#E24B4A' : undefined, colorB: assessB.protOverLimit ? '#E24B4A' : undefined },
    { label: 'Grasa', a: rA.fat, b: rB.fat, decimals: 2, unit: 'g', colorA: assessA.fatOverLimit ? '#E24B4A' : undefined, colorB: assessB.fatOverLimit ? '#E24B4A' : undefined },
    { label: 'Hidratos', a: rA.carb, b: rB.carb, decimals: 1, unit: 'g' },
    { label: 'Peso total', a: totalA, b: totalB, decimals: 0, unit: 'g' },
  ]

  const ruleRows = NUTRIENT_ORDER.map(key => {
    const meta = NUTRIENT_META[key]
    const rule = rules[key]
    const basis = rule?.basis ?? 'per_100kcal'
    const normA = getNormalizedValue(
      key === 'protein' ? rA.prot : key === 'fat' ? rA.fat : key === 'phosphorus' ? rA.phos : key === 'potassium' ? rA.pot : key === 'sodium' ? rA.na : rA.fiber,
      rA.kcal, basis, meta.kcalFactor,
    )
    const normB = getNormalizedValue(
      key === 'protein' ? rB.prot : key === 'fat' ? rB.fat : key === 'phosphorus' ? rB.phos : key === 'potassium' ? rB.pot : key === 'sodium' ? rB.na : rB.fiber,
      rB.kcal, basis, meta.kcalFactor,
    )
    const unit = displayUnit(basis, meta.unit)
    const decimals = basis === 'pct_kcal' || meta.unit === 'g' ? 1 : 0
    const limit = rule
      ? rule.min !== undefined && rule.max !== undefined
        ? `${rule.min}–${rule.max}`
        : rule.max !== undefined ? `máx ${rule.max}` : `mín ${rule.min}`
      : null
    return {
      key, label: meta.label, unit, decimals, limit,
      a: normA, b: normB,
      colorA: rule ? ruleColor(normA, rule) : undefined,
      colorB: rule ? ruleColor(normB, rule) : undefined,
    }
  })

  const ingredientCols = 'grid-cols-[1fr_auto_auto_auto]'

  return (
    <div className="flex flex-col gap-4">

      {/* Ingredients */}
      <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
        <SectionTitle>Ingredientes</SectionTitle>
        <ColumnHeads a={a} b={b} />
        {union.length === 0 && (
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-mono">ninguna de las dos recetas tiene ingredientes</p>
        )}
        {GROUP_LABELS.map(({ group, label }) => {
          const items = union.filter(i => i.group === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-4 last:mb-0">
              <div className="text-[10px] font-mono text-[#9a9a95] dark:text-[#6b6b67] uppercase tracking-wider mt-3 mb-1.5">
                {label}
              </div>
              <ul className="divide-y divide-black/5 dark:divide-white/5">
                {items.map(ing => {
                  const gA = a.values[ing.id] ?? 0
                  const gB = b.values[ing.id] ?? 0
                  const unit = ing.isOil ? 'ml' : 'g'
                  const onlyA = gA > 0 && gB === 0
                  const onlyB = gB > 0 && gA === 0
                  return (
                    <li key={ing.id} className={`grid ${ingredientCols} gap-x-4 items-baseline py-1.5 text-[13px]`}>
                      <span className="font-serif truncate">
                        {ing.label}
                        {onlyA && <span className="ml-2 text-[10px] font-mono" style={{ color: A_COLOR }}>solo A</span>}
                        {onlyB && <span className="ml-2 text-[10px] font-mono" style={{ color: B_COLOR }}>solo B</span>}
                      </span>
                      <span className={`font-mono tabular-nums text-right whitespace-nowrap ${gA === 0 ? 'text-[#c0beb8] dark:text-[#4a4a46]' : ''}`}>
                        {gA}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>
                      </span>
                      <span className={`font-mono tabular-nums text-right whitespace-nowrap ${gB === 0 ? 'text-[#c0beb8] dark:text-[#4a4a46]' : ''}`}>
                        {gB}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>
                      </span>
                      <span className="text-right"><DeltaCell a={gA} b={gB} decimals={0} /></span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Energy & macros */}
      <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
          <div className="p-5">
            <SectionTitle>Energía y macros</SectionTitle>
            <ColumnHeads a={a} b={b} />
            <ul className="divide-y divide-black/5 dark:divide-white/5">
              {macroRows.map(row => (
                <li key={row.label} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-baseline py-2 text-[13px]">
                  <span className="font-serif">{row.label}</span>
                  <span className="font-mono tabular-nums text-right whitespace-nowrap" style={{ color: row.colorA ?? 'inherit' }}>
                    {row.a.toFixed(row.decimals)}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{row.unit}</span>
                  </span>
                  <span className="font-mono tabular-nums text-right whitespace-nowrap" style={{ color: row.colorB ?? 'inherit' }}>
                    {row.b.toFixed(row.decimals)}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{row.unit}</span>
                  </span>
                  <span className="text-right"><DeltaCell a={row.a} b={row.b} decimals={row.decimals} /></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 bg-[#fafaf7] dark:bg-[#141412] border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10">
            <SectionTitle>Distribución macros</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: A_COLOR }}>A</div>
                <MacroDonut r={rA} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: B_COLOR }}>B</div>
                <MacroDonut r={rB} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rule-based nutrients */}
      <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
        <SectionTitle>Minerales y parámetros</SectionTitle>
        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mb-3">
          {unionPathologies.length === 0
            ? 'valores normalizados por 100 kcal · sin patologías activas'
            : samePathologies
              ? `límites según ${unionPathologies.map(id => PATHOLOGY_DEFS[id]?.label.toLowerCase()).join(' · ')}`
              : `las recetas tienen patologías distintas · se aplica el límite más estricto de ${unionPathologies.map(id => PATHOLOGY_DEFS[id]?.label.toLowerCase()).join(' · ')}`}
        </p>
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 pb-2 mb-1 border-b border-black/10 dark:border-white/10 text-[10px] font-mono uppercase tracking-wider">
          <span />
          <span className="text-right" style={{ color: A_COLOR }}>A</span>
          <span className="text-right" style={{ color: B_COLOR }}>B</span>
          <span className="text-right text-[#9a9a95] dark:text-[#6b6b67]">Δ B−A</span>
          <span className="text-right text-[#9a9a95] dark:text-[#6b6b67]">límite</span>
        </div>
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          {ruleRows.map(row => (
            <li key={row.key} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-baseline py-2 text-[13px]">
              <span className="font-serif">
                {row.label.charAt(0).toUpperCase() + row.label.slice(1)}
                <span className="text-[10px] font-mono text-[#9a9a95] dark:text-[#6b6b67] ml-1.5">{row.unit}</span>
              </span>
              <span className="font-mono tabular-nums text-right" style={{ color: row.colorA ?? 'inherit' }}>{row.a.toFixed(row.decimals)}</span>
              <span className="font-mono tabular-nums text-right" style={{ color: row.colorB ?? 'inherit' }}>{row.b.toFixed(row.decimals)}</span>
              <span className="text-right"><DeltaCell a={row.a} b={row.b} decimals={row.decimals} /></span>
              <span className="font-mono tabular-nums text-right text-[11px] text-[#6b6b67] dark:text-[#8a8a85] whitespace-nowrap">{row.limit ?? '—'}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Alerts per recipe (each under its own pathologies) */}
      <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
        <SectionTitle>Alertas</SectionTitle>
        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mb-3">
          cada receta evaluada con sus propias patologías
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ slot: 'A', color: A_COLOR, recipe: a, assess: assessA }, { slot: 'B', color: B_COLOR, recipe: b, assess: assessB }].map(({ slot, color, recipe, assess }) => (
            <div key={slot}>
              <div className="text-[10px] font-mono uppercase tracking-wider mb-2 truncate" style={{ color }}>
                {slot} · {recipe.title}
              </div>
              <div className="flex flex-col gap-1.25">
                {assess.alerts.map(([type, msg], i) => (
                  <div key={i} className={`text-xs py-1.5 px-3 rounded-md font-serif ${ALERT_CLASS[type]}`}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Micronutrients */}
      <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
        <SectionTitle>Micronutrientes</SectionTitle>
        <ColumnHeads a={a} b={b} />
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          <li className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-baseline py-2 text-[13px]">
            <span className="font-serif">Ratio Ca:P</span>
            <span className="font-mono tabular-nums text-right">{rA.phos > 0 ? `${(rA.ca / rA.phos).toFixed(2)}:1` : '—'}</span>
            <span className="font-mono tabular-nums text-right">{rB.phos > 0 ? `${(rB.ca / rB.phos).toFixed(2)}:1` : '—'}</span>
            <span className="text-right">
              {rA.phos > 0 && rB.phos > 0
                ? <DeltaCell a={rA.ca / rA.phos} b={rB.ca / rB.phos} decimals={2} />
                : <span className="font-mono text-[11px] text-[#9a9a95] dark:text-[#6b6b67]">—</span>}
            </span>
          </li>
          {MICROS.map(({ key, label, unit, decimals }) => (
            <li key={key} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-baseline py-2 text-[13px]">
              <span className="font-serif">{label}</span>
              <span className="font-mono tabular-nums text-right whitespace-nowrap">
                {rA[key].toFixed(decimals)}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>
              </span>
              <span className="font-mono tabular-nums text-right whitespace-nowrap">
                {rB[key].toFixed(decimals)}<span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>
              </span>
              <span className="text-right"><DeltaCell a={rA[key]} b={rB[key]} decimals={decimals} /></span>
            </li>
          ))}
        </ul>
      </div>

      {(assessA.footerNotes.length > 0 || assessB.footerNotes.length > 0) && (
        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] leading-relaxed italic font-serif px-1">
          {Array.from(new Set([...assessA.footerNotes, ...assessB.footerNotes])).join(' ')}
        </p>
      )}

    </div>
  )
}
