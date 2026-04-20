import { useState } from 'react'
import { Link } from 'react-router'
import '../index.css'
import { INGREDIENTS, calcNutrition } from '../data/ingredients'
import type { Values } from '../data/ingredients'
import { StatCard } from '../components/StatCard'
import { MacroDonut } from '../components/MacroDonut'
import { SliderGroup } from '../components/SliderGroup'
import { Header } from '../components/Header'
import { IngredientsWizard } from '../components/IngredientsWizard'

const FAT_MAX  = 5.0
const PHOS_MAX = 100
const POT_MIN  = 100
const POT_MAX  = 200

const STORAGE_KEY = 'foodCalculator.kcalTarget'
const INGREDIENTS_STORAGE_KEY = 'foodCalculator.selectedIngredients'
const DEFAULT_TARGET = 210

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

type GoalStepProps = {
  initial: number
  onSubmit: (t: number) => void
  onCancel?: () => void
}

function GoalStep({ initial, onSubmit, onCancel }: GoalStepProps) {
  const [value, setValue] = useState<number>(initial)
  const valid = Number.isFinite(value) && value > 0

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] min-h-screen py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[24px] font-normal tracking-tight leading-tight">Calculadora dieta</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">paso 1 · objetivo</span>
          </div>
          <p className="text-[12px] text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
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
              className="flex-1 text-center text-[24px] font-mono font-bold py-3 outline-none bg-transparent w-0 min-w-0 tabular-nums"
            />
            <span className="pr-4 text-[12px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">kcal/día</span>
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

export default function FoodCalculator() {
  const [target, setTarget] = useState<number | null>(() => readStoredTarget())
  const [editingGoal, setEditingGoal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => readStoredIngredients() ?? INGREDIENTS.map(i => i.id)
  )
  const [editingIngredients, setEditingIngredients] = useState(false)
  const [values, setValues] = useState<Values>(
    () => Object.fromEntries(INGREDIENTS.map(i => [i.id, i.val]))
  )
  const [microOpen, setMicroOpen] = useState(false)

  const commitTarget = (t: number) => {
    try { localStorage.setItem(STORAGE_KEY, String(t)) } catch { /* storage unavailable */ }
    setTarget(t)
    setEditingGoal(false)
  }

  const commitIngredients = (ids: string[]) => {
    try { localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(ids)) } catch { /* storage unavailable */ }
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

  const activeIngredients = INGREDIENTS.filter(i => selectedIds.includes(i.id))

  const r = calcNutrition(values, activeIngredients)

  const handleChange = (id: string, val: number) =>
    setValues(prev => ({ ...prev, [id]: val }))

  const diffK   = r.kcal - TARGET
  const pct     = Math.min(100, (r.kcal / TARGET) * 100)
  const kcalColor = Math.abs(diffK) <= 8 ? '#1D9E75' : diffK < 0 ? '#EF9F27' : '#E24B4A'

  const totalG = activeIngredients.reduce((s, i) => s + (values[i.id] ?? 0), 0)

  const phosColor = r.phos > PHOS_MAX ? '#E24B4A' : r.phos > PHOS_MAX * 0.85 ? '#EF9F27' : '#1D9E75'
  const potColor  = r.pot >= POT_MIN && r.pot <= POT_MAX ? '#1D9E75' : '#EF9F27'

  type AlertType = 'ok' | 'warn' | 'danger'
  const alerts: [AlertType, string][] = []

  if (Math.abs(diffK) <= 5)        alerts.push(['ok',     `✓ Calorías en objetivo (${r.kcal.toFixed(1)} kcal)`])
  else if (diffK < 0)              alerts.push(['warn',   `Faltan ${Math.abs(diffK).toFixed(1)} kcal para llegar a ${TARGET}`])
  else                             alerts.push(['danger', `${diffK.toFixed(1)} kcal por encima del objetivo`])

  if (r.fat > FAT_MAX)             alerts.push(['danger', `Grasa ${r.fat.toFixed(2)}g — supera el límite de ${FAT_MAX}g`])
  else                             alerts.push(['ok',     `✓ Grasa dentro del límite (${r.fat.toFixed(2)}g)`])

  if (r.phos > PHOS_MAX)           alerts.push(['danger', `Fósforo ${r.phos.toFixed(1)}mg — supera el límite renal`])
  else if (r.phos > PHOS_MAX*0.85) alerts.push(['warn',   `Fósforo ${r.phos.toFixed(1)}mg — cerca del límite`])
  else                             alerts.push(['ok',     `✓ Fósforo controlado (${r.phos.toFixed(1)}mg)`])

  if (r.pot < POT_MIN)             alerts.push(['warn',   `Potasio ${r.pot.toFixed(1)}mg — por debajo del rango`])
  else if (r.pot > POT_MAX)        alerts.push(['warn',   `Potasio ${r.pot.toFixed(1)}mg — por encima del rango`])
  else                             alerts.push(['ok',     `✓ Potasio en rango (${r.pot.toFixed(1)}mg)`])

  const alertClass: Record<AlertType, string> = {
    ok:     'bg-[#e1f5ee] text-[#0f6e56] dark:bg-[#0f3328] dark:text-[#7ad4b1]',
    warn:   'bg-[#faeeda] text-[#854f0b] dark:bg-[#3a2a10] dark:text-[#e8b980]',
    danger: 'bg-[#fcebeb] text-[#a32d2d] dark:bg-[#3a1616] dark:text-[#eb8585]',
  }

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] min-h-screen py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[24px] font-normal tracking-tight leading-tight">Calculadora dieta</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">renal · canina</span>
          </div>
          <p className="text-[12px] text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            objetivo: {TARGET} kcal{' '}
            <button
              onClick={() => setEditingGoal(true)}
              className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
            >
              editar
            </button>
            {' · '}fósforo &lt;100mg · potasio 100–200mg
          </p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1px_1fr] max-[720px]:grid-cols-1">

          <div className="p-5 max-[720px]:order-1">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
              Ingredientes
            </div>
            <SliderGroup label="Hidratos"  group="hc"   values={values} onChange={handleChange} ingredients={activeIngredients} />
            <div className="mt-3">
              <SliderGroup label="Proteína" group="prot" values={values} onChange={handleChange} ingredients={activeIngredients} />
            </div>
            <div className="mt-3">
              <SliderGroup label="Grasa"    group="fat"  values={values} onChange={handleChange} ingredients={activeIngredients} />
            </div>
            <button
              onClick={() => setEditingIngredients(true)}
              className="mt-4 text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
            >
              editar ingredientes ({selectedIds.length})
            </button>
          </div>

          <div className="bg-black/10 dark:bg-white/10 max-[720px]:hidden min-[721px]:row-span-2"></div>

          <div className="p-5 bg-[#fafaf7] dark:bg-[#141412] flex flex-col gap-5 max-[720px]:order-2 min-[721px]:row-span-2">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Energía y macros
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <StatCard value={r.kcal.toFixed(1)}  valueColor={kcalColor} label="kcal"         barPct={pct}                               barColor={kcalColor} barLabel={`obj. ${TARGET}`} />
                </div>
                <StatCard value={r.prot.toFixed(1)}                         label="proteína g" />
                <StatCard value={r.fat.toFixed(2)}   valueColor={r.fat > FAT_MAX ? '#E24B4A' : undefined} label="grasa g" />
                <StatCard value={r.carb.toFixed(1)}                         label="hidratos g" />
                <StatCard value={totalG.toFixed(0)}                         label="peso total g" />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Distribución macros
              </div>
              <MacroDonut r={r} />
            </div>
          </div>

          <div className="p-5 max-[720px]:order-3 min-[721px]:border-t min-[721px]:border-black/10 dark:min-[721px]:border-white/10">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
              Minerales renales
            </div>
            <div className="grid grid-cols-3 max-[520px]:grid-cols-2 gap-2">
              <StatCard
                value={r.phos.toFixed(1)} valueColor={phosColor} label="fósforo mg"
                barPct={Math.min(100, (r.phos / PHOS_MAX) * 100)} barColor={phosColor} barLabel="límite ~100mg"
              />
              <StatCard
                value={r.pot.toFixed(1)} valueColor={potColor} label="potasio mg"
                barPct={Math.min(100, (r.pot / POT_MAX) * 100)} barColor={potColor} barLabel="rango 100–200"
              />
              <StatCard
                value={r.phos > 0 ? (r.prot / r.phos * 1000).toFixed(0) : '—'}
                label="ratio prot:P ×10"
              />
            </div>

            <div className="flex flex-col gap-[5px] mt-3">
              {alerts.map(([type, msg], i) => (
                <div key={i} className={`text-xs py-1.5 px-3 rounded-md font-serif ${alertClass[type]}`}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
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
              <span className={`text-[#6b6b67] dark:text-[#8a8a85] text-[12px] font-mono transition-transform ${microOpen ? 'rotate-90' : ''}`}>
                ›
              </span>
            </button>
            {microOpen && (
              <ul className="divide-y divide-black/5 dark:divide-white/5 mt-3">
                {[
                  { label: 'Calcio',        value: r.ca.toFixed(1),   unit: 'mg' },
                  { label: 'Fósforo',       value: r.phos.toFixed(1), unit: 'mg' },
                  { label: 'Ratio Ca:P',    value: r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—', unit: '' },
                  { label: 'Sodio',         value: r.na.toFixed(1),   unit: 'mg' },
                  { label: 'Potasio',       value: r.pot.toFixed(1),  unit: 'mg' },
                  { label: 'Hierro',        value: r.fe.toFixed(2),   unit: 'mg' },
                  { label: 'Zinc',          value: r.zn.toFixed(2),   unit: 'mg' },
                  { label: 'Vitamina A',    value: r.vitA.toFixed(0), unit: 'µg' },
                  { label: 'Vitamina D',    value: r.vitD.toFixed(2), unit: 'µg' },
                  { label: 'Vitamina E',    value: r.vitE.toFixed(2), unit: 'mg' },
                  { label: 'Vitamina B12',  value: r.b12.toFixed(2),  unit: 'µg' },
                  { label: 'Fibra',         value: r.fiber.toFixed(1), unit: 'g' },
                ].map(({ label, value, unit }) => (
                  <li key={label} className="flex items-baseline justify-between py-2 text-[13px]">
                    <span className="font-serif text-[#1a1a18] dark:text-[#e8e6e0]">{label}</span>
                    <span className="font-mono tabular-nums">
                      {value}
                      {unit && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
          Fósforo y potasio calculados con reducción por hervido (~30%). Referencia renal canina orientativa: fósforo &lt;100mg/día, potasio 100–200mg/día.
        </p>

      </div>
    </div>
  )
}
