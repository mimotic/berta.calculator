import { useState } from 'react'
import '../index.css'
import { Header } from '../components/Header'
import { Stepper } from '../components/Stepper'

type FoodId = 'chocolate_blanco' | 'chocolate_leche' | 'chocolate_negro' | 'chocolate_puro' | 'cebolla_cruda' | 'cebolla_cocinada'

type Food = {
  label: string
  group: 'Chocolate' | 'Cebolla'
  hint: string
  // Toxicity model: either theobromine (mg per gram of food) or onion (g/kg thresholds)
  kind: 'theobromine' | 'onion'
  // mg of theobromine per gram of product
  theobromineMgPerG?: number
  // Cooking reduces but does not eliminate onion toxicity. Factor applied to ingested grams.
  onionFactor?: number
}

const FOODS: Record<FoodId, Food> = {
  chocolate_blanco:  { label: 'Chocolate blanco',   group: 'Chocolate', hint: '~0.1 mg/g',  kind: 'theobromine', theobromineMgPerG: 0.1 },
  chocolate_leche:   { label: 'Chocolate con leche', group: 'Chocolate', hint: '~2 mg/g',    kind: 'theobromine', theobromineMgPerG: 2.0 },
  chocolate_negro:   { label: 'Chocolate negro',     group: 'Chocolate', hint: '~5 mg/g',    kind: 'theobromine', theobromineMgPerG: 5.0 },
  chocolate_puro:    { label: 'Cacao puro',          group: 'Chocolate', hint: '~15 mg/g',   kind: 'theobromine', theobromineMgPerG: 15.0 },
  cebolla_cruda:     { label: 'Cebolla cruda',       group: 'Cebolla',   hint: 'incl. ajo',  kind: 'onion',       onionFactor: 1.0 },
  cebolla_cocinada:  { label: 'Cebolla cocinada',    group: 'Cebolla',   hint: 'sigue tóxica', kind: 'onion',     onionFactor: 0.7 },
}

type Grade = 1 | 2 | 3 | 4 | 5

type Assessment = {
  grade: Grade
  label: string
  summary: string
  advice: string
  metricLabel: string
  metricValue: string
}

// Chocolate: theobromine mg/kg thresholds
// <9 safe · 9–20 mild · 20–40 moderate · 40–60 severe · >60 critical
function gradeChocolate(doseMgPerKg: number): Grade {
  if (doseMgPerKg < 9) return 1
  if (doseMgPerKg < 20) return 2
  if (doseMgPerKg < 40) return 3
  if (doseMgPerKg < 60) return 4
  return 5
}

// Onion: g/kg thresholds. Significant hemolytic effect begins around 0.5 g/kg.
// <0.25 safe · 0.25–0.5 leve · 0.5–5 moderado · 5–15 grave · >15 crítico
function gradeOnion(gPerKg: number): Grade {
  if (gPerKg < 0.25) return 1
  if (gPerKg < 0.5) return 2
  if (gPerKg < 5) return 3
  if (gPerKg < 15) return 4
  return 5
}

const GRADE_META: Record<Grade, { label: string; color: string; bg: string; dark: string; advice: string }> = {
  1: { label: 'Seguro',   color: '#1D9E75', bg: '#e6f4ee', dark: '#0f2a20', advice: 'Dosis no tóxica. Observación rutinaria.' },
  2: { label: 'Leve',     color: '#9E8C1D', bg: '#f5efda', dark: '#2e2810', advice: 'Vigilar al perro en las próximas 12 h.' },
  3: { label: 'Moderado', color: '#C77A1B', bg: '#faeeda', dark: '#3a2a10', advice: 'Llamar al veterinario hoy mismo.' },
  4: { label: 'Grave',    color: '#D14A2B', bg: '#f8dcd2', dark: '#3a1a10', advice: 'Acudir al veterinario urgente.' },
  5: { label: 'Crítico',  color: '#B52D2D', bg: '#f4cfcf', dark: '#3a1010', advice: 'Emergencia: urgencias veterinarias ya.' },
}

function assess(food: Food, weightKg: number, amountG: number): Assessment {
  if (food.kind === 'theobromine') {
    const totalMg = amountG * (food.theobromineMgPerG ?? 0)
    const dose = totalMg / weightKg
    const grade = gradeChocolate(dose)
    const m = GRADE_META[grade]
    return {
      grade,
      label: m.label,
      summary: `${dose.toFixed(1)} mg/kg de teobromina`,
      advice: m.advice,
      metricLabel: 'Teobromina',
      metricValue: `${dose.toFixed(1)} mg/kg`,
    }
  }
  const effectiveG = amountG * (food.onionFactor ?? 1)
  const dose = effectiveG / weightKg
  const grade = gradeOnion(dose)
  const m = GRADE_META[grade]
  return {
    grade,
    label: m.label,
    summary: `${dose.toFixed(2)} g/kg de cebolla`,
    advice: m.advice,
    metricLabel: 'Dosis',
    metricValue: `${dose.toFixed(2)} g/kg`,
  }
}

type ChipProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  hint?: string
}

function Chip({ active, onClick, children, hint }: ChipProps) {
  const base = 'text-left px-2.5 py-1.5 rounded-md text-xs border transition-colors'
  const state = active
    ? 'bg-[#1a1a18] text-white border-[#1a1a18] dark:bg-[#e8e6e0] dark:text-[#1a1a18] dark:border-[#e8e6e0]'
    : 'bg-white dark:bg-[#1a1a18] text-[#1a1a18] dark:text-[#e8e6e0] border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40'
  const hintColor = active
    ? 'text-white/60 dark:text-[#1a1a18]/60'
    : 'text-[#6b6b67] dark:text-[#8a8a85]'
  return (
    <button onClick={onClick} className={`${base} ${state}`}>
      <div className="font-serif leading-tight">{children}</div>
      {hint && <div className={`text-[10px] mt-0.5 font-mono leading-tight ${hintColor}`}>{hint}</div>}
    </button>
  )
}

type FieldProps = {
  label: string
  note?: string | null
  children: React.ReactNode
}

function Field({ label, note, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono uppercase tracking-wider">{label}</label>
        {note && <span className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] font-mono italic">{note}</span>}
      </div>
      {children}
    </div>
  )
}

export default function ToxicityCalculator() {
  const [weight, setWeight] = useState<number>(10)
  const [foodId, setFoodId] = useState<FoodId>('chocolate_negro')
  const [amount, setAmount] = useState<number>(20)

  const food = FOODS[foodId]
  const valid = weight > 0 && amount >= 0
  const result = valid ? assess(food, weight, amount) : null
  const meta = result ? GRADE_META[result.grade] : null

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Toxicidad alimentaria</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">perro · orientativo</span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">Grado de riesgo 1–5 por alimento ingerido</p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">

            <div className="p-5">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Datos</div>

              <div className="flex flex-col gap-4">

                <Field label="Peso del perro" note="0.5 – 90 kg">
                  <Stepper value={weight} onChange={setWeight} min={0.5} max={90} step={0.5} unit="kg" />
                  <input
                    type="range"
                    min={0.5}
                    max={90}
                    step={0.1}
                    value={weight}
                    onChange={e => setWeight(parseFloat(e.target.value))}
                    className="mt-2.5 w-full"
                  />
                </Field>

                <Field label="Alimento">
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(FOODS) as FoodId[]).map(id => (
                      <Chip key={id} active={foodId === id} onClick={() => setFoodId(id)} hint={FOODS[id].hint}>
                        {FOODS[id].label}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Cantidad ingerida" note="en gramos">
                  <Stepper value={amount} onChange={setAmount} min={0} max={1000} step={1} unit="g" />
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={1}
                    value={Math.min(amount, 500)}
                    onChange={e => setAmount(parseFloat(e.target.value))}
                    className="mt-2.5 w-full"
                  />
                </Field>

              </div>
            </div>

            <div className="bg-black/10 dark:bg-white/10"></div>

            <div className="p-5 bg-[#fafaf7] dark:bg-[#141412]">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Resultado</div>

              {!result || !meta ? (
                <div className="text-[13px] text-[#6b6b67] dark:text-[#8a8a85] italic font-serif py-6 text-center">
                  Introduce datos válidos para calcular
                </div>
              ) : (
                <div key={`${foodId}-${result.grade}-${amount}`} className="fade-in">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <div className="text-[44px] leading-none font-mono font-bold tabular-nums" style={{ color: meta.color }}>
                        {result.grade}
                      </div>
                      <div className="text-[13px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">/ 5 · {meta.label.toLowerCase()}</div>
                    </div>
                    <div className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-1">
                      {result.summary}
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(g => (
                      <div
                        key={g}
                        className="flex-1 h-1.5 rounded-sm transition-colors"
                        style={{
                          backgroundColor: g <= result.grade ? meta.color : undefined,
                        }}
                      >
                        <div className={`w-full h-full rounded-sm ${g > result.grade ? 'bg-black/10 dark:bg-white/10' : ''}`} />
                      </div>
                    ))}
                  </div>

                  <div
                    className="rounded-md px-3 py-2.5 text-[12px] font-serif"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <div className="font-bold mb-0.5">{meta.label}</div>
                    <div className="leading-snug">{result.advice}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-3">
                    <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                      <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">{result.metricLabel}</div>
                      <div className="font-mono font-bold text-[13px] mt-0.5 tabular-nums">{result.metricValue}</div>
                    </div>
                    <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                      <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">Alimento</div>
                      <div className="font-mono font-bold text-[13px] mt-0.5">{food.group}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                    <div className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] font-mono leading-relaxed">
                      {food.kind === 'theobromine' ? (
                        <>dosis = {amount} g × {food.theobromineMgPerG} mg/g ÷ {weight} kg</>
                      ) : (
                        <>dosis = {amount} g × {food.onionFactor} ÷ {weight} kg</>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
          Cálculo orientativo basado en umbrales de referencia. Ante cualquier ingesta sospechosa, contacta con tu veterinario o con un servicio de toxicología veterinaria.
        </p>
      </div>
    </div>
  )
}
