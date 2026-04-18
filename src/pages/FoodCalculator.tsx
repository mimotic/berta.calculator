import { useState } from 'react'
import '../index.css'
import { INGREDIENTS, calcNutrition } from '../data/ingredients'
import type { Values } from '../data/ingredients'
import { StatCard } from '../components/StatCard'
import { MacroDonut } from '../components/MacroDonut'
import { SliderGroup } from '../components/SliderGroup'
import { Header } from '../components/Header'

const TARGET   = 210
const FAT_MAX  = 5.0
const PHOS_MAX = 100
const POT_MIN  = 100
const POT_MAX  = 200

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

        <Header />

        <header className="mb-8">
          <h1 className="text-[22px] font-normal tracking-tight">Calculadora dieta</h1>
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
