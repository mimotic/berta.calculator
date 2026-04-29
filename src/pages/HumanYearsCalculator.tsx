import { useState } from 'react'
import '../index.css'
import { Header } from '../components/Header'

type SizeCategory = 'pequeno' | 'mediano' | 'grande' | 'gigante'

const SIZE: Record<SizeCategory, { label: string; hint: string }> = {
  pequeno: { label: 'Pequeño', hint: '< 10 kg' },
  mediano: { label: 'Mediano', hint: '10–25 kg' },
  grande:  { label: 'Grande',  hint: '25–45 kg' },
  gigante: { label: 'Gigante', hint: '> 45 kg' },
}

// Index 0 = dog age 1 year. Source: AKC size-adjusted conversion table.
const HUMAN_YEARS: Record<SizeCategory, number[]> = {
  pequeno: [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
  mediano: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 91, 95, 99, 103],
  grande:  [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99, 104, 109, 114, 119],
  gigante: [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121, 128, 135, 142, 149],
}

function getHumanAge(dogAge: number, size: SizeCategory): number {
  const table = HUMAN_YEARS[size]
  if (dogAge <= 1) return Math.round(table[0] * dogAge)
  const idx = dogAge - 1
  const floor = Math.floor(idx)
  const frac = idx - floor
  if (floor >= table.length - 1) return table[table.length - 1]
  return Math.round(table[floor] + (table[floor + 1] - table[floor]) * frac)
}

type LifeStageInfo = { label: string; desc: string }

function getLifeStage(humanAge: number): LifeStageInfo {
  if (humanAge < 13) return { label: 'Infancia', desc: 'Fase de aprendizaje y exploración constante' }
  if (humanAge < 20) return { label: 'Adolescencia', desc: 'Energía desbordante, aún en formación' }
  if (humanAge < 30) return { label: 'Adulto joven', desc: 'En plena forma y vitalidad' }
  if (humanAge < 45) return { label: 'Adulto', desc: 'Maduro y en su mejor momento' }
  if (humanAge < 60) return { label: 'Mediana edad', desc: 'Experimentado y equilibrado' }
  if (humanAge < 75) return { label: 'Mayor', desc: 'Merece cuidados especiales y mucho mimo' }
  return { label: 'Gran veterano', desc: 'Un superviviente con mucha historia' }
}

type StepperProps = {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}

function Stepper({ value, onChange, min = 0.5, max = 20, step = 0.5 }: StepperProps) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(1)))
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(1)))
  return (
    <div className="flex items-center border border-black/15 dark:border-white/15 rounded-md bg-white dark:bg-[#1a1a18] overflow-hidden focus-within:border-black/40 dark:focus-within:border-white/40 transition-colors">
      <button onClick={dec} className="w-9 h-10 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono">−</button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)))
        }}
        className="flex-1 text-center text-[17px] font-mono font-bold py-2 outline-none bg-transparent w-0 min-w-0"
      />
      <span className="pr-3 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">años</span>
      <button onClick={inc} className="w-9 h-10 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono border-l border-black/10 dark:border-white/10">+</button>
    </div>
  )
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
  const hintColor = active ? 'text-white/60 dark:text-[#1a1a18]/60' : 'text-[#6b6b67] dark:text-[#8a8a85]'
  return (
    <button onClick={onClick} className={`${base} ${state}`}>
      <div className="font-serif leading-tight">{children}</div>
      {hint && <div className={`text-[10px] mt-0.5 font-mono leading-tight ${hintColor}`}>{hint}</div>}
    </button>
  )
}

type FieldProps = { label: string; children: React.ReactNode }

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function HumanYearsCalculator() {
  const [dogAge, setDogAge] = useState<number>(3)
  const [size, setSize] = useState<SizeCategory>('mediano')

  const humanAge = getHumanAge(dogAge, size)
  const stage = getLifeStage(humanAge)
  const oldRule = Math.round(dogAge * 7)
  const accent = '#5B8DEF'

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Años en humano</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">perro · AKC</span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">Equivalencia según edad y tamaño</p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">

            <div className="p-5">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Datos</div>

              <div className="flex flex-col gap-4">

                <Field label="Edad del perro">
                  <Stepper value={dogAge} onChange={setDogAge} />
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={dogAge}
                    onChange={e => setDogAge(parseFloat(e.target.value))}
                    className="mt-2.5 w-full"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#9a9a95] dark:text-[#6b6b67] mt-0.5">
                    <span>6 m</span><span>10 años</span><span>20 años</span>
                  </div>
                </Field>

                <Field label="Tamaño">
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(SIZE) as SizeCategory[]).map(s => (
                      <Chip key={s} active={size === s} onClick={() => setSize(s)} hint={SIZE[s].hint}>
                        {SIZE[s].label}
                      </Chip>
                    ))}
                  </div>
                </Field>

              </div>
            </div>

            <div className="bg-black/10 dark:bg-white/10"></div>

            <div className="p-5 bg-[#fafaf7] dark:bg-[#141412]">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Resultado</div>

              <div key={`${humanAge}-${size}`} className="fade-in">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <div className="text-[44px] leading-none font-mono font-bold tabular-nums" style={{ color: accent }}>
                      {humanAge}
                    </div>
                    <div className="text-[13px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">años humanos</div>
                  </div>
                  <div className="text-[13px] font-serif mt-1.5">{stage.label}</div>
                  <div className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-0.5">{stage.desc}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                    <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">Regla × 7</div>
                    <div className="font-mono font-bold text-[13px] mt-0.5 tabular-nums">
                      {oldRule} <span className="font-normal text-[#6b6b67] dark:text-[#8a8a85]">años</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                    <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">Diferencia</div>
                    <div className="font-mono font-bold text-[13px] mt-0.5 tabular-nums">
                      {humanAge > oldRule ? '+' : ''}{humanAge - oldRule} <span className="font-normal text-[#6b6b67] dark:text-[#8a8a85]">años</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                  <div className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] font-mono leading-relaxed">
                    {dogAge} año{dogAge !== 1 ? 's' : ''} · {SIZE[size].label.toLowerCase()} ({SIZE[size].hint})
                    <br />
                    La madurez varía mucho según el tamaño de raza.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
          La regla del ×7 es una simplificación. Los perros maduran más rápido en su primer año y los de mayor tamaño envejecen antes que los pequeños.
        </p>
      </div>
    </div>
  )
}
