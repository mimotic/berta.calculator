import { useEffect, useState, type ReactElement } from 'react'
import { Link, useSearchParams } from 'react-router'
import '../index.css'
import { INGREDIENTS, calcNutrition } from '../data/ingredients'
import type { Values } from '../data/ingredients'
import { getRecipe, saveRecipe, updateRecipe, type SavedRecipe } from '../data/recipes'
import {
  type PathologyId,
  type NutrientKey,
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
  getNormalizedValue,
  displayUnit,
} from '../data/pathologies'
import { generateDietPDF } from '../utils/generateDietPDF'
import { StatCard } from '../components/StatCard'
import { MacroDonut, WeightDonut } from '../components/MacroDonut'
import { SliderGroup } from '../components/SliderGroup'
import { Header } from '../components/Header'
import { IngredientsWizard } from '../components/IngredientsWizard'
import { PathologyWizard } from '../components/PathologyWizard'

const STORAGE_KEY = 'foodCalculator.kcalTarget'
const INGREDIENTS_STORAGE_KEY = 'foodCalculator.selectedIngredients'
const PATHOLOGIES_STORAGE_KEY = 'foodCalculator.pathologies'
const VALUES_STORAGE_KEY = 'foodCalculator.values'
const DEFAULT_TARGET = 210

// Fixed display order for nutrient rule cards
const NUTRIENT_ORDER: NutrientKey[] = ['phosphorus', 'potassium', 'sodium', 'protein', 'fat', 'fiber']

function readStoredTarget(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const n = parseFloat(raw)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

function readStoredIngredients(): string[] | null {
  try {
    const raw = localStorage.getItem(INGREDIENTS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return null
  }
}

function readStoredValues(): Values | null {
  try {
    const raw = localStorage.getItem(VALUES_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    return parsed as Values
  } catch {
    return null
  }
}

function readStoredPathologies(): PathologyId[] | null {
  try {
    const raw = localStorage.getItem(PATHOLOGIES_STORAGE_KEY)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const valid: PathologyId[] = ['renal', 'hepatica_estable', 'encefalopatia_hepatica', 'digestiva_low_fat', 'cardiaca']
    return parsed.filter((x): x is PathologyId => valid.includes(x))
  } catch {
    return null
  }
}

type GoalStepProps = {
  initial: number
  onSubmit: (t: number) => void
  onCancel?: () => void
}

function GoalStep({ initial, onSubmit, onCancel }: GoalStepProps) {
  const [value, setValue] = useState<number>(initial)
  const valid = Number.isFinite(value) && value > 0

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Calculadora dieta</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">paso 1 · objetivo</span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            define el objetivo de kcal/día
          </p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
            Objetivo calórico
          </div>

          <div className="flex items-center border border-black/15 dark:border-white/15 rounded-md bg-white dark:bg-[#0f0f0e] overflow-hidden focus-within:border-black/40 dark:focus-within:border-white/40 transition-colors mb-3">
            <input
              type="number"
              min={1}
              step={1}
              value={Number.isFinite(value) ? value : ''}
              onChange={e => {
                const v = parseFloat(e.target.value)
                setValue(Number.isFinite(v) ? v : 0)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && valid) onSubmit(value)
              }}
              autoFocus
              className="flex-1 text-center text-2xl font-mono font-bold py-3 outline-none bg-transparent w-0 min-w-0 tabular-nums"
            />
            <span className="pr-4 text-xs text-[#6b6b67] dark:text-[#8a8a85] font-mono">kcal/día</span>
          </div>

          <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono leading-relaxed">
            ¿No sabes cuánto?{' '}
            <Link to="/calorias" className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors">
              calcula las calorías diarias
            </Link>{' '}
            según peso y actividad.
          </p>

          <div className="flex gap-2 mt-5">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => valid && onSubmit(value)}
              disabled={!valid}
              className="flex-1 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Continuar →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type SaveRecipeModalProps = {
  initialTitle?: string
  onSave: (title: string) => void
  onCancel: () => void
}

function SaveRecipeModal({ initialTitle, onSave, onCancel }: SaveRecipeModalProps) {
  const [title, setTitle] = useState(initialTitle ?? '')
  const valid = title.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
          Guardar receta
        </div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && valid) onSave(title.trim())
            if (e.key === 'Escape') onCancel()
          }}
          placeholder="Título de la receta"
          autoFocus
          maxLength={60}
          className="w-full text-[15px] font-serif py-2.5 px-3 border border-black/15 dark:border-white/15 rounded-md bg-white dark:bg-[#0f0f0e] outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors placeholder:text-[#9a9a95] dark:placeholder:text-[#6b6b67]"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => valid && onSave(title.trim())}
            disabled={!valid}
            className="flex-1 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FoodCalculator() {
  const [searchParams] = useSearchParams()
  const [editingRecipe, setEditingRecipe] = useState<SavedRecipe | null>(() => {
    const id = searchParams.get('receta')
    return id ? getRecipe(id) : null
  })
  const [target, setTarget] = useState<number | null>(() => editingRecipe?.kcalTarget ?? readStoredTarget())
  const [editingGoal, setEditingGoal] = useState(false)
  const [pathologies, setPathologies] = useState<PathologyId[] | null>(() => editingRecipe?.pathologies ?? readStoredPathologies())
  const [editingPathology, setEditingPathology] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    editingRecipe
      ? Object.keys(editingRecipe.values)
      : readStoredIngredients() ?? INGREDIENTS.map(i => i.id)
  )
  const [editingIngredients, setEditingIngredients] = useState(false)
  const [values, setValues] = useState<Values>(() => {
    const defaults = Object.fromEntries(INGREDIENTS.map(i => [i.id, i.val]))
    if (editingRecipe) return { ...defaults, ...editingRecipe.values }
    const stored = readStoredValues()
    return stored ? { ...defaults, ...stored } : defaults
  })
  const [microOpen, setMicroOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!justSaved) return
    const t = setTimeout(() => setJustSaved(false), 6000)
    return () => clearTimeout(t)
  }, [justSaved])

  // En modo edición de receta no se escribe en las claves de la calculadora,
  // para no pisar la dieta en curso del usuario.
  const commitTarget = (t: number) => {
    if (!editingRecipe) {
      try { localStorage.setItem(STORAGE_KEY, String(t)) } catch { /* storage unavailable */ }
    }
    setTarget(t)
    setEditingGoal(false)
  }

  const commitPathologies = (ids: PathologyId[]) => {
    if (!editingRecipe) {
      try { localStorage.setItem(PATHOLOGIES_STORAGE_KEY, JSON.stringify(ids)) } catch { /* storage unavailable */ }
    }
    setPathologies(ids)
    setEditingPathology(false)
  }

  const commitIngredients = (ids: string[]) => {
    if (!editingRecipe) {
      try { localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(ids)) } catch { /* storage unavailable */ }
    }
    setSelectedIds(ids)
    setEditingIngredients(false)
  }

  if (target === null || editingGoal) {
    return (
      <GoalStep
        initial={target ?? DEFAULT_TARGET}
        onSubmit={commitTarget}
        onCancel={target !== null ? () => setEditingGoal(false) : undefined}
      />
    )
  }

  if (pathologies === null || editingPathology) {
    return (
      <PathologyWizard
        initial={pathologies ?? []}
        onSubmit={commitPathologies}
        onCancel={editingPathology ? () => setEditingPathology(false) : undefined}
      />
    )
  }

  if (editingIngredients) {
    return (
      <IngredientsWizard
        initial={selectedIds}
        onSubmit={commitIngredients}
        onCancel={() => setEditingIngredients(false)}
      />
    )
  }

  const TARGET = target
  const activeRules = computeActiveRules(pathologies)

  const activeIngredients = INGREDIENTS.filter(i => selectedIds.includes(i.id))
  const r = calcNutrition(values, activeIngredients)

  const handleChange = (id: string, val: number) =>
    setValues(prev => {
      const next = { ...prev, [id]: val }
      if (!editingRecipe) {
        try { localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
      }
      return next
    })

  const handleResetValues = () => {
    const next = Object.fromEntries(INGREDIENTS.map(i => [i.id, 0]))
    if (!editingRecipe) {
      try { localStorage.setItem(VALUES_STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    }
    setValues(next)
  }

  const handleSaveRecipe = (title: string) => {
    const recipeValues: Values = {}
    for (const ing of activeIngredients) {
      const g = values[ing.id] ?? 0
      if (g > 0) recipeValues[ing.id] = g
    }
    if (editingRecipe) {
      const updated = updateRecipe(editingRecipe.id, { title, kcalTarget: TARGET, pathologies, values: recipeValues })
      if (updated) setEditingRecipe(updated)
    } else {
      saveRecipe({ title, kcalTarget: TARGET, pathologies, values: recipeValues })
    }
    setSaveOpen(false)
    setJustSaved(true)
  }

  const diffK     = r.kcal - TARGET
  const pct       = Math.min(100, (r.kcal / TARGET) * 100)
  const kcalColor = Math.abs(diffK) <= 8 ? '#1D9E75' : diffK < 0 ? '#EF9F27' : '#E24B4A'
  const totalG    = activeIngredients.reduce((s, i) => s + (values[i.id] ?? 0), 0)

  const pathologyChip = pathologies.length > 0
    ? pathologies.map(id => PATHOLOGY_DEFS[id].label.toLowerCase()).join(' · ') + ' · canina'
    : 'canina'

  // Map NutrientKey to computed per-serving values from calcNutrition
  const actualValues: Record<NutrientKey, number> = {
    fat: r.fat, protein: r.prot, phosphorus: r.phos, potassium: r.pot, sodium: r.na, fiber: r.fiber,
  }

  // Build mineral cards + alerts from active rules
  type AlertType = 'ok' | 'warn' | 'danger'
  const mineralCards: { key: string; el: ReactElement }[] = []
  const alerts: [AlertType, string][] = []

  // kcal alert is always shown
  if (Math.abs(diffK) <= 5)   alerts.push(['ok',     `✓ Calorías en objetivo (${r.kcal.toFixed(1)} kcal)`])
  else if (diffK < 0)         alerts.push(['warn',   `Faltan ${Math.abs(diffK).toFixed(1)} kcal para llegar a ${TARGET}`])
  else                        alerts.push(['danger', `${diffK.toFixed(1)} kcal por encima del objetivo`])

  for (const key of NUTRIENT_ORDER) {
    const rule = activeRules[key]
    if (!rule) continue

    const meta       = NUTRIENT_META[key]
    const actual     = actualValues[key]
    const normalized = getNormalizedValue(actual, r.kcal, rule.basis, meta.kcalFactor)
    const dUnit      = displayUnit(rule.basis, meta.unit)

    // Color
    let color = '#1D9E75'
    if      (rule.max !== undefined && normalized > rule.max)             color = '#E24B4A'
    else if (rule.max !== undefined && normalized > rule.max * 0.85)      color = '#EF9F27'
    else if (rule.min !== undefined && normalized < rule.min)             color = '#EF9F27'

    // Bar reference
    const barMax   = rule.max ?? ((rule.min ?? 0) * 2 || 100)
    const barPct   = Math.min(100, (normalized / barMax) * 100)
    const barLabel = rule.min !== undefined && rule.max !== undefined
      ? `${rule.min}–${rule.max}${dUnit}`
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
    } else if (rule.max !== undefined && normalized > rule.max * 0.85) {
      alerts.push(['warn', `${cap} ${dispVal} ${dUnit} — cerca del límite`])
    } else if (rule.min !== undefined && normalized < rule.min) {
      alerts.push(['warn', `${cap} ${dispVal} ${dUnit} — por debajo del rango`])
    } else {
      alerts.push(['ok', `✓ ${cap} controlado (${dispVal} ${dUnit})`])
    }
  }

  // Determine valueColor for macro stats cards
  const fatRule  = activeRules.fat
  const fatNorm  = fatRule ? getNormalizedValue(r.fat, r.kcal, fatRule.basis, NUTRIENT_META.fat.kcalFactor) : null
  const fatOverLimit = fatRule?.max !== undefined && fatNorm !== null && fatNorm > fatRule.max

  const protRule  = activeRules.protein
  const protNorm  = protRule ? getNormalizedValue(r.prot, r.kcal, protRule.basis, NUTRIENT_META.protein.kcalFactor) : null
  const protOverLimit = protRule?.max !== undefined && protNorm !== null && protNorm > protRule.max

  const alertClass: Record<AlertType, string> = {
    ok:     'bg-[#e1f5ee] text-[#0f6e56] dark:bg-[#0f3328] dark:text-[#7ad4b1]',
    warn:   'bg-[#faeeda] text-[#854f0b] dark:bg-[#3a2a10] dark:text-[#e8b980]',
    danger: 'bg-[#fcebeb] text-[#a32d2d] dark:bg-[#3a1616] dark:text-[#eb8585]',
  }

  // Footer notes from active pathologies
  const footerNotes = pathologies.flatMap(id => PATHOLOGY_DEFS[id].notes ?? [])

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        {editingRecipe && (
          <div className="text-xs py-2 px-3 rounded-md font-serif mb-4 bg-[#eaf1fd] text-[#2d5cb8] dark:bg-[#16233a] dark:text-[#8fb3f5] flex items-center justify-between gap-3">
            <span>✎ Editando receta «{editingRecipe.title}»</span>
            <Link to="/recetas" className="underline font-mono text-[11px] shrink-0 hover:opacity-80 transition-opacity">
              salir sin guardar
            </Link>
          </div>
        )}

        <header className="mb-6">
          <div className="flex flex-col items-baseline justify-between gap-2 md:gap-4 md:flex-row">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Calculadora dieta</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">{pathologyChip}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1">
            <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-mono">
              objetivo: {TARGET} kcal{' '}
              <button
                onClick={() => setEditingGoal(true)}
                className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
              >
                editar
              </button>
              {' · '}
              <button
                onClick={() => setEditingPathology(true)}
                className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
              >
                {pathologies.length > 0 ? 'editar patología' : 'añadir patología'}
              </button>
            </p>
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setSaveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {editingRecipe ? '✓ Guardar cambios' : '☆ Guardar receta'}
              </button>
              <button
                onClick={() => { void generateDietPDF(TARGET, pathologies, activeIngredients, values, r) }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                ↓ Descargar PDF
              </button>
            </div>
          </div>
          {justSaved && (
            <div className="text-xs py-1.5 px-3 rounded-md font-serif mt-3 bg-[#e1f5ee] text-[#0f6e56] dark:bg-[#0f3328] dark:text-[#7ad4b1]">
              ✓ {editingRecipe ? 'Cambios guardados' : 'Receta guardada'} ·{' '}
              <Link to="/recetas" className="underline hover:opacity-80 transition-opacity">
                ver mis recetas
              </Link>
            </div>
          )}
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1px_1fr] max-[720px]:grid-cols-1">

          <div className="p-5 max-[720px]:order-1">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
              Ingredientes
            </div>
            <SliderGroup label="Hidratos"  group="hc"      values={values} onChange={handleChange} ingredients={activeIngredients} targetKcal={TARGET} />
            <div className="mt-3">
              <SliderGroup label="Verduras" group="verdura" values={values} onChange={handleChange} ingredients={activeIngredients} targetKcal={TARGET} />
            </div>
            <div className="mt-3">
              <SliderGroup label="Frutas"   group="fruta"   values={values} onChange={handleChange} ingredients={activeIngredients} targetKcal={TARGET} />
            </div>
            <div className="mt-3">
              <SliderGroup label="Proteína" group="prot"    values={values} onChange={handleChange} ingredients={activeIngredients} targetKcal={TARGET} />
            </div>
            <div className="mt-3">
              <SliderGroup label="Grasa"    group="fat"     values={values} onChange={handleChange} ingredients={activeIngredients} targetKcal={TARGET} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setEditingIngredients(true)}
                className="text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
              >
                editar ingredientes ({selectedIds.length})
              </button>
              <span className="text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85]">·</span>
              <button
                onClick={handleResetValues}
                className="text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] underline hover:text-[#E24B4A] dark:hover:text-[#eb8585] transition-colors cursor-pointer"
              >
                poner todo a 0
              </button>
            </div>
          </div>

          <div className="bg-black/10 dark:bg-white/10 max-[720px]:hidden min-[721px]:row-span-2"></div>

          <div className="p-5 bg-[#fafaf7] dark:bg-[#141412] flex flex-col gap-5 max-[720px]:order-2 min-[721px]:row-span-2">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Energía y macros
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <StatCard value={r.kcal.toFixed(1)} valueColor={kcalColor} label="kcal" barPct={pct} barColor={kcalColor} barLabel={`obj. ${TARGET}`} />
                </div>
                <StatCard value={r.prot.toFixed(1)} valueColor={protOverLimit ? '#E24B4A' : undefined} label="proteína g" />
                <StatCard value={r.fat.toFixed(2)} valueColor={fatOverLimit ? '#E24B4A' : undefined} label="grasa g" />
                <StatCard value={r.carb.toFixed(1)} label="hidratos g" />
                <StatCard value={totalG.toFixed(0)} label="peso total g" />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Distribución macros
              </div>
              <MacroDonut r={r} />
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Distribución por peso
              </div>
              <WeightDonut ingredients={activeIngredients} values={values} />
            </div>
          </div>

          {mineralCards.length > 0 && (
            <div className="p-5 max-[720px]:order-3 min-[721px]:border-t min-[721px]:border-black/10 dark:min-[721px]:border-white/10">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Minerales y parámetros
              </div>
              <div className="grid grid-cols-3 max-[520px]:grid-cols-2 gap-2">
                {mineralCards.map(({ key, el }) => (
                  <div key={key}>{el}</div>
                ))}
              </div>
              <div className="flex flex-col gap-1.25 mt-3">
                {alerts.map(([type, msg], i) => (
                  <div key={i} className={`text-xs py-1.5 px-3 rounded-md font-serif ${alertClass[type]}`}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mineralCards.length === 0 && (
            <div className="p-5 max-[720px]:order-3 min-[721px]:border-t min-[721px]:border-black/10 dark:min-[721px]:border-white/10">
              <div className="flex flex-col gap-1.25">
                {alerts.map(([type, msg], i) => (
                  <div key={i} className={`text-xs py-1.5 px-3 rounded-md font-serif ${alertClass[type]}`}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          </div>

          <div className="p-5 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => setMicroOpen(o => !o)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
              aria-expanded={microOpen}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] font-mono group-hover:text-[#1a1a18] dark:group-hover:text-[#e8e6e0] transition-colors">
                Micronutrientes
              </span>
              <span className={`text-[#6b6b67] dark:text-[#8a8a85] text-xs font-mono transition-transform ${microOpen ? 'rotate-90' : ''}`}>
                ›
              </span>
            </button>
            {microOpen && (() => {
              const k = TARGET / 1000
              const fmt = (n: number, d = 0) => n >= 100 ? Math.round(n).toString() : n.toFixed(d)
              // Rango de referencia por 1000 kcal: mínimo NRC 2006 (RA) → mínimo FEDIAF 2024, escalado por k.
              // Conversiones para vitaminas expresadas en IU por las fuentes: 1 IU vit A = 0.3 µg retinol,
              // 1 IU vit D = 0.025 µg; vit E en mg (base NRC).
              const range = (a: number, b: number, d = 0) => {
                const lo = fmt(a * k, d), hi = fmt(b * k, d)
                return lo === hi ? lo : `${lo}–${hi}`
              }
              return (
                <>
                  <ul className="divide-y divide-black/5 dark:divide-white/5 mt-3">
                    {[
                      { label: 'Calcio',       value: r.ca.toFixed(1),    unit: 'mg', ref: range(1000, 1250) },
                      { label: 'Fósforo',      value: r.phos.toFixed(1),  unit: 'mg', ref: range(750, 1000) },
                      { label: 'Ratio Ca:P',   value: r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—', unit: '', ref: '1:1 – 2:1' },
                      { label: 'Sodio',        value: r.na.toFixed(1),    unit: 'mg', ref: range(200, 250) },
                      { label: 'Potasio',      value: r.pot.toFixed(1),   unit: 'mg', ref: range(1000, 1250) },
                      { label: 'Hierro',       value: r.fe.toFixed(2),    unit: 'mg', ref: range(7.5, 9, 1) },
                      { label: 'Zinc',         value: r.zn.toFixed(2),    unit: 'mg', ref: range(15, 18, 1) },
                      { label: 'Vitamina A',   value: r.vitA.toFixed(0),  unit: 'µg', ref: range(455, 525) },
                      { label: 'Vitamina D',   value: r.vitD.toFixed(2),  unit: 'µg', ref: range(3.4, 4.0, 1) },
                      { label: 'Vitamina E',   value: r.vitE.toFixed(2),  unit: 'mg', ref: range(7.5, 9, 1) },
                      { label: 'Vitamina C',   value: r.vitC.toFixed(1),  unit: 'mg', ref: '—' },
                      { label: 'Tiamina (B1)', value: r.b1.toFixed(2),    unit: 'mg', ref: range(0.54, 0.56, 2) },
                      { label: 'Riboflavina (B2)', value: r.b2.toFixed(2), unit: 'mg', ref: range(1.3, 1.5, 1) },
                      { label: 'Niacina (B3)', value: r.b3.toFixed(1),    unit: 'mg', ref: range(4.25, 4.25, 1) },
                      { label: 'Vitamina B6',  value: r.b6.toFixed(2),    unit: 'mg', ref: range(0.375, 0.375, 2) },
                      { label: 'Folato (B9)',  value: r.b9.toFixed(0),    unit: 'µg', ref: range(67.5, 67.5) },
                      { label: 'Vitamina B12', value: r.b12.toFixed(2),   unit: 'µg', ref: range(8.4, 8.8, 1) },
                      { label: 'Fibra',        value: r.fiber.toFixed(1), unit: 'g',  ref: '2–4,5 % MS' },
                    ].map(({ label, value, unit, ref }) => (
                      <li key={label} className="flex items-baseline justify-between py-2 text-[13px] gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif text-[#1a1a18] dark:text-[#e8e6e0]">{label}</span>
                          <span className="font-mono text-[10px] text-[#6b6b67] dark:text-[#8a8a85]">
                            ref {ref}{unit && ref !== '—' && ` ${unit}`}
                          </span>
                        </div>
                        <span className="font-mono tabular-nums whitespace-nowrap">
                          {value}
                          {unit && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif">
                    Valores orientativos: rango de referencia NRC 2006 (RA) – FEDIAF 2024 (mínimo) para perro adulto en mantenimiento, escalado a {TARGET} kcal/día. Pueden variar según etapa vital, condición o patologías. La vitamina C no tiene requerimiento establecido: el perro la sintetiza de forma endógena.
                  </p>
                </>
              )
            })()}
          </div>
        </div>

        {footerNotes.length > 0 && (
          <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
            {footerNotes.join(' ')}
          </p>
        )}

      </div>

      {saveOpen && (
        <SaveRecipeModal
          initialTitle={editingRecipe?.title}
          onSave={handleSaveRecipe}
          onCancel={() => setSaveOpen(false)}
        />
      )}
    </div>
  )
}
