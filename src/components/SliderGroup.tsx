import { useState } from 'react'
import { INGREDIENTS, getIngredientMax, ingredientGrams, ingredientUnit } from '../data/ingredients'
import type { Ingredient, Values } from '../data/ingredients'
import { IngredientModal } from './IngredientModal'
import { Stepper } from './Stepper'

interface SliderGroupProps {
  label: string
  group: Ingredient['group']
  values: Values
  onChange: (id: string, val: number) => void
  ingredients?: Ingredient[]
  targetKcal?: number
}

export function SliderGroup({ label, group, values, onChange, ingredients = INGREDIENTS, targetKcal }: SliderGroupProps) {
  const [selected, setSelected] = useState<Ingredient | null>(null)
  const items = ingredients.filter(i => i.group === group)
  if (items.length === 0) return null
  return (
    <div>
      <div className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] italic mb-1.5 font-serif">{label}</div>
      {selected && <IngredientModal ingredient={selected} onClose={() => setSelected(null)} />}
      {items.map(ing => {
        const computedMax = targetKcal != null ? getIngredientMax(ing, targetKcal) : ing.max
        const g = values[ing.id] ?? 0
        const sliderMax = Math.max(computedMax, g)
        if (ing.portion) {
          return (
            <div key={ing.id} className="mb-4">
              <button type="button" onClick={() => setSelected(ing)} className="text-[13px] text-left font-serif hover:underline cursor-pointer" title="Ver valores analíticos">
                {ing.label}
              </button>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-60 max-w-full">
                  <Stepper value={g} onChange={v => onChange(ing.id, v)} min={0} max={sliderMax} step={1} unit={ingredientUnit(ing, g)} label={`Cantidad de ${ing.label}`} wholeUnits />
                </div>
                <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono whitespace-nowrap">{((ingredientGrams(ing, g) / 100) * ing.kcal).toFixed(1)} kcal</span>
              </div>
              <p className="mt-2 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">
                1 {ing.portion.singular} = {ing.portion.grams.toLocaleString('es-ES')} g
              </p>
            </div>
          )
        }
        return (
          <div key={ing.id} className="flex items-center gap-1.25 mb-2.5 md:gap-2.5">
            <button
              type="button"
              onClick={() => setSelected(ing)}
              className="text-[13px] text-[#6b6b67] dark:text-[#9a9a95] w-41.25 max-[520px]:w-32.5 shrink-0 font-serif text-left hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] hover:underline transition-colors cursor-pointer"
              title="Ver valores analíticos"
            >
              {ing.label}
            </button>
            <div className="flex-1 md:hidden">
              <Stepper
                value={g}
                onChange={v => onChange(ing.id, v)}
                min={0}
                max={sliderMax}
                step={ing.step}
                unit={ing.isOil ? 'ml' : 'g'}
                label={`Cantidad de ${ing.label}`}
              />
            </div>
            <input
              type="range"
              id={`sl_${ing.id}`}
              aria-label={`Cantidad de ${ing.label}`}
              className="flex-1 hidden md:block"
              min={0}
              max={sliderMax}
              step={ing.step}
              value={g}
              onChange={e => onChange(ing.id, parseFloat(e.target.value))}
            />
            <span className="hidden md:inline w-14 text-right text-[13px] font-bold font-mono text-[#1a1a18] dark:text-[#e8e6e0]">
              {ing.isOil ? `${g.toFixed(2)} ml` : `${g} g`}
            </span>
            <span className="w-11 text-right text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono max-[520px]:hidden">
              {((g / 100) * ing.kcal).toFixed(1)}k
            </span>
          </div>
        )
      })}
    </div>
  )
}
