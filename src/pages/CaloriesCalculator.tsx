import { useState } from 'react'
import '../index.css'
import { Header } from '../components/Header'
import { Stepper } from '../components/Stepper'

type ActivityLevel = 'inactivo' | 'baja' | 'moderada' | 'alta'
type LifeStage = 'cachorro_temprano' | 'cachorro_tardio' | 'adulto' | 'senior'
type Goal = 'mantenimiento' | 'perdida' | 'ganancia'

const ACTIVITY: Record<ActivityLevel, { label: string; hint: string }> = {
  inactivo: { label: 'Inactivo', hint: 'sedentario' },
  baja:     { label: 'Baja',     hint: '30–60 min' },
  moderada: { label: 'Moderada', hint: '1–2 h' },
  alta:     { label: 'Alta',     hint: 'deportivo' },
}

const LIFE_STAGE: Record<LifeStage, { label: string; hint: string }> = {
  cachorro_temprano: { label: 'Cachorro', hint: '< 4 meses' },
  cachorro_tardio:   { label: 'Junior',   hint: '4–12 meses' },
  adulto:            { label: 'Adulto',   hint: '1–7 años' },
  senior:            { label: 'Senior',   hint: '> 7 años' },
}

const GOAL: Record<Goal, { label: string; hint: string }> = {
  mantenimiento: { label: 'Mantener', hint: 'peso estable' },
  perdida:       { label: 'Perder',   hint: '1.0 × RER' },
  ganancia:      { label: 'Ganar',    hint: '+20 %' },
}

function getMERFactor(activity: ActivityLevel, neutered: boolean): number {
  if (activity === 'inactivo') return neutered ? 1.2 : 1.4
  if (activity === 'baja')     return neutered ? 1.4 : 1.6
  if (activity === 'moderada') return neutered ? 1.6 : 1.8
  return 2.0
}

function calcCalories(
  weightKg: number,
  activity: ActivityLevel,
  neutered: boolean,
  lifeStage: LifeStage,
  goal: Goal,
) {
  const rer = 70 * Math.pow(weightKg, 0.75)

  if (goal === 'perdida') {
    return { rer, mer: rer * 1.0, factor: 1.0 }
  }

  let factor: number
  if (lifeStage === 'cachorro_temprano') {
    factor = 3.0
  } else if (lifeStage === 'cachorro_tardio') {
    factor = 2.0
  } else {
    factor = getMERFactor(activity, neutered)
    if (lifeStage === 'senior') factor *= 0.9
  }

  if (goal === 'ganancia') factor *= 1.2

  return { rer, mer: rer * factor, factor }
}

type ChipProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  hint?: string
  disabled?: boolean
}

function Chip({ active, onClick, children, hint, disabled }: ChipProps) {
  const base = 'group relative text-left px-2.5 py-1.5 rounded-md text-xs border transition-colors'
  const state = disabled
    ? 'bg-black/5 dark:bg-white/5 text-[#bbb] dark:text-[#555] border-transparent cursor-not-allowed'
    : active
    ? 'bg-[#1a1a18] text-white border-[#1a1a18] dark:bg-[#e8e6e0] dark:text-[#1a1a18] dark:border-[#e8e6e0]'
    : 'bg-white dark:bg-[#1a1a18] text-[#1a1a18] dark:text-[#e8e6e0] border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40'
  const hintColor = disabled
    ? 'text-[#bbb] dark:text-[#555]'
    : active
    ? 'text-white/60 dark:text-[#1a1a18]/60'
    : 'text-[#6b6b67] dark:text-[#8a8a85]'
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${state}`}>
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

export default function CaloriesCalculator() {
  const [weight, setWeight] = useState<number>(2.6)
  const [neutered, setNeutered] = useState<boolean>(true)
  const [activity, setActivity] = useState<ActivityLevel>('moderada')
  const [lifeStage, setLifeStage] = useState<LifeStage>('adulto')
  const [goal, setGoal] = useState<Goal>('mantenimiento')

  const isPuppy = lifeStage === 'cachorro_temprano' || lifeStage === 'cachorro_tardio'
  const isWeightLoss = goal === 'perdida'
  const activityDisabled = isPuppy || isWeightLoss

  const valid = weight > 0
  const result = valid ? calcCalories(weight, activity, neutered, lifeStage, goal) : null
  const accent = '#1D9E75'

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Calorías diarias</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">perro · WSAVA</span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">RER × factor de actividad</p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">

          <div className="p-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Datos</div>

            <div className="flex flex-col gap-4">

              <Field label="Peso" note="0.5 – 60 kg">
                <Stepper value={weight} onChange={setWeight} min={0.5} max={60} step={0.1} unit="kg" />
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

              <Field label="Etapa vital">
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(LIFE_STAGE) as LifeStage[]).map(s => (
                    <Chip key={s} active={lifeStage === s} onClick={() => setLifeStage(s)} hint={LIFE_STAGE[s].hint}>
                      {LIFE_STAGE[s].label}
                    </Chip>
                  ))}
                </div>
              </Field>

              <div className={`flex items-center justify-between transition-opacity ${activityDisabled ? 'opacity-40' : ''}`}>
                <label className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono uppercase tracking-wider">Castrado/a</label>
                <div className="flex border border-black/15 dark:border-white/15 rounded-md overflow-hidden bg-white dark:bg-[#1a1a18]">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => !activityDisabled && setNeutered(val)}
                      disabled={activityDisabled}
                      className={`px-4 py-1.5 text-xs font-mono transition-colors ${
                        neutered === val && !activityDisabled
                          ? 'bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18]'
                          : activityDisabled
                          ? 'text-[#bbb] dark:text-[#555] cursor-not-allowed'
                          : 'text-[#1a1a18] dark:text-[#e8e6e0] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Objetivo">
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(GOAL) as Goal[]).map(g => (
                    <Chip key={g} active={goal === g} onClick={() => setGoal(g)} hint={GOAL[g].hint}>
                      {GOAL[g].label}
                    </Chip>
                  ))}
                </div>
              </Field>

              <div className={`transition-opacity ${activityDisabled ? 'opacity-40' : ''}`}>
                <Field
                  label="Actividad"
                  note={isPuppy ? 'N/A — factor fijo por etapa' : isWeightLoss ? 'N/A — pérdida usa 1.0 × RER' : null}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(Object.keys(ACTIVITY) as ActivityLevel[]).map(l => (
                      <Chip
                        key={l}
                        active={activity === l}
                        onClick={() => setActivity(l)}
                        hint={ACTIVITY[l].hint}
                        disabled={activityDisabled}
                      >
                        {ACTIVITY[l].label}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

            </div>
          </div>

          <div className="bg-black/10 dark:bg-white/10"></div>

          <div className="p-5 bg-[#fafaf7] dark:bg-[#141412]">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">Resultado</div>

            {!result ? (
              <div className="text-[13px] text-[#6b6b67] dark:text-[#8a8a85] italic font-serif py-6 text-center">
                Introduce un peso válido para calcular
              </div>
            ) : (
              <div key={result.mer.toFixed(0)} className="fade-in">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <div className="text-[44px] leading-none font-mono font-bold tabular-nums" style={{ color: accent }}>
                      {result.mer.toFixed(0)}
                    </div>
                    <div className="text-[13px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">kcal/día</div>
                  </div>
                  <div className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-1">
                    ≈ {(result.mer / 3).toFixed(0)} kcal/comida <span className="text-[#bbb] dark:text-[#555]">(3 tomas)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                    <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">RER reposo</div>
                    <div className="font-mono font-bold text-[13px] mt-0.5 tabular-nums">
                      {result.rer.toFixed(0)} <span className="font-normal text-[#6b6b67] dark:text-[#8a8a85]">kcal</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-md px-2.5 py-2">
                    <div className="text-[#6b6b67] dark:text-[#8a8a85] font-mono">Factor</div>
                    <div className="font-mono font-bold text-[13px] mt-0.5 tabular-nums">× {result.factor.toFixed(1)}</div>
                  </div>
                </div>

                {isWeightLoss && (
                  <div className="mt-3 text-[11px] text-[#854f0b] bg-[#faeeda] dark:bg-[#3a2a10] dark:text-[#e8b980] rounded-md px-2.5 py-2 font-serif italic">
                    Pérdida de peso: 1.0 × RER (ignora actividad y etapa).
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                  <div className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] font-mono leading-relaxed">
                    MER = 70 × peso<sup>0.75</sup> × factor
                    <br />
                    = 70 × {weight.toFixed(1)}<sup>0.75</sup> × {result.factor.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
          Los factores son orientativos; consulta con tu veterinario para ajustar la dieta individual.
        </p>
      </div>
    </div>
  )
}
