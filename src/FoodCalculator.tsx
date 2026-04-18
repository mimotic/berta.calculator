import { useState } from 'react'
import './index.css'

const TARGET   = 210
const FAT_MAX  = 5.0
const PHOS_MAX = 100
const POT_MIN  = 100
const POT_MAX  = 200

interface Ingredient {
  id: string
  label: string
  group: 'hc' | 'prot' | 'fat'
  val: number
  max: number
  step: number
  isOil: boolean
  kcal: number
  prot: number
  fat: number
  phos: number
  pot: number
  carb: number
}

const INGREDIENTS: Ingredient[] = [
  { id:'patata',    label:'Patata cocida',       group:'hc',   val:110,  max:150, step:5,    isOil:false, kcal:77,  prot:2.0,  fat:0.1,  phos:40,  pot:328, carb:17.5 },
  { id:'arroz',     label:'Arroz blanco cocido', group:'hc',   val:0,    max:150, step:5,    isOil:false, kcal:130, prot:2.7,  fat:0.3,  phos:35,  pot:35,  carb:28.2 },
  { id:'calabacin', label:'Calabacín cocido',    group:'hc',   val:60,   max:150, step:5,    isOil:false, kcal:17,  prot:1.2,  fat:0.2,  phos:32,  pot:261, carb:3.1  },
  { id:'zanahoria', label:'Zanahoria cocida',    group:'hc',   val:20,   max:80,  step:5,    isOil:false, kcal:35,  prot:0.8,  fat:0.2,  phos:30,  pot:235, carb:7.9  },
  { id:'merluza',   label:'Merluza cocida',      group:'prot', val:70,   max:120, step:5,    isOil:false, kcal:77,  prot:15.8, fat:1.5,  phos:140, pot:302, carb:0    },
  { id:'salmon',    label:'Salmón cocido',       group:'prot', val:0,    max:120, step:5,    isOil:false, kcal:206, prot:20.0, fat:13.0, phos:260, pot:384, carb:0    },
  { id:'pollo',     label:'Pollo cocido',        group:'prot', val:0,    max:120, step:5,    isOil:false, kcal:165, prot:31.0, fat:3.6,  phos:220, pot:256, carb:0    },
  { id:'higado',    label:'Hígado de pollo',     group:'prot', val:0,    max:60,  step:5,    isOil:false, kcal:165, prot:24.5, fat:6.5,  phos:300, pot:263, carb:0.7  },
  { id:'clara',     label:'Clara de huevo',      group:'prot', val:35,   max:80,  step:1,    isOil:false, kcal:52,  prot:10.9, fat:0.2,  phos:15,  pot:163, carb:0.7  },
  { id:'yema',      label:'Yema de huevo',       group:'prot', val:5,    max:20,  step:1,    isOil:false, kcal:322, prot:15.9, fat:26.5, phos:390, pot:109, carb:3.6  },
  { id:'aceite',    label:'Aceite oliva (ml)',   group:'fat',  val:0.5,  max:5,   step:0.25, isOil:true,  kcal:884, prot:0,    fat:100,  phos:0,   pot:1,   carb:0    },
]

type Values = Record<string, number>

function calcNutrition(values: Values) {
  let kcal = 0, prot = 0, fat = 0, carb = 0, phos = 0, pot = 0
  for (const ing of INGREDIENTS) {
    const g = values[ing.id]
    kcal += (g / 100) * ing.kcal
    prot += (g / 100) * ing.prot
    fat  += (g / 100) * ing.fat
    carb += (g / 100) * (ing.carb || 0)
    phos += (g / 100) * ing.phos
    pot  += (g / 100) * ing.pot
  }
  return { kcal, prot, fat, carb, phos, pot }
}

interface StatCardProps {
  value: string
  valueColor?: string
  label: string
  barPct?: number
  barColor?: string
  barLabel?: string
}

function StatCard({ value, valueColor, label, barPct, barColor, barLabel }: StatCardProps) {
  return (
    <div className="bg-[#f2f0ec] rounded-[6px] py-3 px-[0.6rem] text-center">
      <div className="text-[20px] font-mono font-bold leading-none" style={{ color: valueColor ?? 'inherit' }}>
        {value}
      </div>
      <div className="text-[10px] text-[#6b6b67] mt-1 font-serif">{label}</div>
      {barPct != null && (
        <>
          <div className="h-[3px] rounded-sm bg-black/10 overflow-hidden mt-1.5">
            <div
              className="h-full rounded-sm transition-[width] duration-[250ms]"
              style={{ width: `${barPct}%`, background: barColor }}
            />
          </div>
          <div className="text-[9px] text-[#6b6b67] mt-[3px] font-mono">{barLabel}</div>
        </>
      )}
    </div>
  )
}

const DONUT_C = 2 * Math.PI * 40

function DonutSeg({ len, offset, color }: { len: number; offset: number; color: string }) {
  return (
    <circle
      cx="50" cy="50" r="40"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="butt"
      strokeDasharray={`${len} ${DONUT_C - len}`}
      strokeDashoffset={offset}
      transform="rotate(-90 50 50)"
      style={{ transition: 'stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease' }}
    />
  )
}

function MacroDonut({ r }: { r: ReturnType<typeof calcNutrition> }) {
  const PROT_C = '#5B8DEF'
  const CARB_C = '#EF9F27'
  const FAT_C  = '#1D9E75'

  const protKcal = r.prot * 4
  const carbKcal = r.carb * 4
  const fatKcal  = r.fat  * 9
  const total    = protKcal + carbKcal + fatKcal
  const C        = DONUT_C

  const protPct = total > 0 ? (protKcal / total) * 100 : 0
  const carbPct = total > 0 ? (carbKcal / total) * 100 : 0
  const fatPct  = total > 0 ? (fatKcal  / total) * 100 : 0
  const protLen = (protPct / 100) * C
  const carbLen = (carbPct / 100) * C
  const fatLen  = (fatPct  / 100) * C

  const legend = [
    { color: PROT_C, name: 'Proteína', pct: protPct },
    { color: CARB_C, name: 'Hidratos', pct: carbPct },
    { color: FAT_C,  name: 'Grasas',   pct: fatPct  },
  ]

  return (
    <div className="flex items-center gap-8 mt-4 mb-1">
      <div className="shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e2dc" strokeWidth="10" />
          {total > 0 && (
            <>
              <DonutSeg len={protLen} offset={0}           color={PROT_C} />
              <DonutSeg len={carbLen} offset={C - protLen} color={CARB_C} />
              <DonutSeg len={fatLen}  offset={fatLen}      color={FAT_C}  />
            </>
          )}
          <text x="50" y="46" textAnchor="middle" fontSize="8.5" fill="#9b9b97" fontFamily="monospace">macros</text>
          <text x="50" y="57" textAnchor="middle" fontSize="8"   fill="#9b9b97" fontFamily="monospace">% kcal</text>
        </svg>
      </div>
      <div className="flex flex-col gap-2.5">
        {legend.map(({ color, name, pct }) => (
          <div key={name} className="flex items-center gap-2 w-36">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[12px] text-[#6b6b67] font-serif flex-1">{name}</span>
            <span className="text-[13px] font-mono font-bold text-[#1a1a18]">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SliderGroupProps {
  label: string
  group: 'hc' | 'prot' | 'fat'
  values: Values
  onChange: (id: string, val: number) => void
}

function SliderGroup({ label, group, values, onChange }: SliderGroupProps) {
  const items = INGREDIENTS.filter(i => i.group === group)
  return (
    <div>
      <div className="text-[11px] text-[#6b6b67] italic mb-1.5 font-serif">{label}</div>
      {items.map(ing => {
        const g = values[ing.id]
        return (
          <div key={ing.id} className="flex items-center gap-[10px] mb-[10px]">
            <label htmlFor={`sl_${ing.id}`} className="text-[13px] text-[#6b6b67] w-[165px] max-[520px]:w-[130px] shrink-0 font-serif">
              {ing.label}
            </label>
            <input
              type="range"
              id={`sl_${ing.id}`}
              className="flex-1"
              min={0}
              max={ing.max}
              step={ing.step}
              value={g}
              onChange={e => onChange(ing.id, parseFloat(e.target.value))}
            />
            <span className="w-14 text-right text-[13px] font-bold font-mono text-[#1a1a18]">
              {ing.isOil ? `${g.toFixed(2)} ml` : `${g} g`}
            </span>
            <span className="w-11 text-right text-[11px] text-[#6b6b67] font-mono">
              {((g / 100) * ing.kcal).toFixed(1)}k
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function FoodCalculator() {
  const [values, setValues] = useState<Values>(
    () => Object.fromEntries(INGREDIENTS.map(i => [i.id, i.val]))
  )

  const r = calcNutrition(values)

  const handleChange = (id: string, val: number) =>
    setValues(prev => ({ ...prev, [id]: val }))

  const diffK   = r.kcal - TARGET
  const pct     = Math.min(100, (r.kcal / TARGET) * 100)
  const kcalColor = Math.abs(diffK) <= 8 ? '#1D9E75' : diffK < 0 ? '#EF9F27' : '#E24B4A'

  const totalG = INGREDIENTS.reduce((s, i) => s + values[i.id], 0)

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
    ok:     'bg-[#e1f5ee] text-[#0f6e56]',
    warn:   'bg-[#faeeda] text-[#854f0b]',
    danger: 'bg-[#fcebeb] text-[#a32d2d]',
  }

  return (
    <div className="font-serif bg-[#f9f8f6] text-[#1a1a18] min-h-screen py-8 px-4">
      <div className="max-w-[680px] mx-auto">

        <header className="mb-8">
          <h1 className="text-[22px] font-normal tracking-tight">Calculadora dieta Berta</h1>
          <p className="text-[13px] text-[#6b6b67] mt-1 font-mono">
            objetivo: 210 kcal · fósforo &lt;100mg · potasio 100–200mg
          </p>
        </header>

        <div className="bg-white border border-black/10 rounded-[10px] px-6 py-5 mb-4">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] mb-4 font-mono">
            Ingredientes
          </div>
          <SliderGroup label="Hidratos"  group="hc"   values={values} onChange={handleChange} />
          <div className="mt-3">
            <SliderGroup label="Proteína" group="prot" values={values} onChange={handleChange} />
          </div>
          <div className="mt-3">
            <SliderGroup label="Grasa"    group="fat"  values={values} onChange={handleChange} />
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-[10px] px-6 py-5 mb-4">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] mb-4 font-mono">
            Energía y macros
          </div>
          <div className="grid grid-cols-5 max-[520px]:grid-cols-3 gap-2">
            <StatCard value={r.kcal.toFixed(1)}  valueColor={kcalColor} label="kcal"         barPct={pct}                               barColor={kcalColor} barLabel={`obj. ${TARGET}`} />
            <StatCard value={r.prot.toFixed(1)}                         label="proteína g" />
            <StatCard value={r.fat.toFixed(2)}   valueColor={r.fat > FAT_MAX ? '#E24B4A' : undefined} label="grasa g" />
            <StatCard value={r.carb.toFixed(1)}                         label="hidratos g" />
            <StatCard value={totalG.toFixed(0)}                         label="peso total g" />
          </div>

          <MacroDonut r={r} />

          <hr className="border-0 border-t border-black/10 my-5" />

          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] mb-4 font-mono">
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

          <p className="text-[11px] text-[#6b6b67] mt-3 leading-relaxed italic font-serif">
            Fósforo y potasio calculados con reducción por hervido (~30%). Referencia renal canina orientativa: fósforo &lt;100mg/día, potasio 100–200mg/día.
          </p>
        </div>

      </div>
    </div>
  )
}
