import { INGREDIENTS } from '../data/ingredients'
import type { Values } from '../data/ingredients'

interface SliderGroupProps {
  label: string
  group: 'hc' | 'prot' | 'fat'
  values: Values
  onChange: (id: string, val: number) => void
}

export function SliderGroup({ label, group, values, onChange }: SliderGroupProps) {
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
