import { Fragment, useState } from 'react'
import { INGREDIENTS, getIngredientMax, ingredientNutritionFactor, ingredientUnit, isNutrientKnown, SUPPLEMENT_NOTE } from '../data/ingredients'
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
      {group === 'suplementos' && <p className="text-[11px] leading-relaxed text-[#6b6b67] dark:text-[#8a8a85] mb-3">{SUPPLEMENT_NOTE}</p>}
      {selected && <IngredientModal ingredient={selected} onClose={() => setSelected(null)} />}
      {items.map(ing => {
        const computedMax = targetKcal != null ? getIngredientMax(ing, targetKcal) : ing.max
        const g = values[ing.id] ?? 0
        const sliderMax = Math.max(computedMax, g)
        const kcal = ingredientNutritionFactor(ing, g) * ing.kcal
        const energyLabel = isNutrientKnown(ing, 'kcal') ? `${kcal.toFixed(1)} kcal` : 'kcal n/d'
        // La columna de la fila de escritorio es estrecha: formato corto para que no se parta.
        const energyShort = isNutrientKnown(ing, 'kcal') ? `${kcal.toFixed(1)}k` : 'n/d'
        const stacked = !!ing.portion || !!ing.measure || group === 'suplementos'
        const supplement = group === 'suplementos'
        const unit = ing.measure ?? ing.portion
        const portionNote = unit && (unit.grams !== undefined ? `1 ${unit.singular} = ${unit.grams.toLocaleString('es-ES')} g` : 'Peso por unidad no publicado')
        return (
          <Fragment key={ing.id}>
            {/* Los ingredientes por unidades usan en móvil un bloque apilado; en desktop, la misma fila con slider que el resto. */}
            {stacked && (
              <div className={supplement ? 'mb-4' : 'mb-4 md:hidden'}>
                <button type="button" onClick={() => setSelected(ing)} className="text-[13px] text-left font-serif hover:underline cursor-pointer" title="Ver valores analíticos">
                  {ing.label}
                </button>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-60 max-w-full">
                    <Stepper value={g} onChange={v => onChange(ing.id, v)} min={0} max={sliderMax} step={ing.step} unit={ingredientUnit(ing, g)} label={`Cantidad de ${ing.label}`} wholeUnits={ing.step === 1} />
                  </div>
                  <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono whitespace-nowrap">{energyLabel}</span>
                </div>
                {portionNote && <p className="mt-2 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">{portionNote}</p>}
              </div>
            )}
            <div className={`${supplement ? 'hidden' : stacked ? 'hidden md:flex' : 'flex'} items-center gap-1.25 mb-2.5 md:gap-2.5`}>
              <div className="w-41.25 max-[520px]:w-32.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelected(ing)}
                  className="block w-full text-[13px] text-[#6b6b67] dark:text-[#9a9a95] font-serif text-left hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] hover:underline transition-colors cursor-pointer"
                  title="Ver valores analíticos"
                >
                  {ing.label}
                </button>
                {portionNote && (
                  <p className="mt-0.5 text-[10px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">{portionNote}</p>
                )}
              </div>
              {!ing.portion && (
                <div className="flex-1 md:hidden">
                  <Stepper
                    value={g}
                    onChange={v => onChange(ing.id, v)}
                    min={0}
                    max={sliderMax}
                    step={ing.step}
                    unit={ingredientUnit(ing, g)}
                    label={`Cantidad de ${ing.label}`}
                  />
                </div>
              )}
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
                {ing.portion ? (
                  <>
                    {g}
                    <span className="block text-[10px] font-normal text-[#6b6b67] dark:text-[#8a8a85]">{ingredientUnit(ing, g)}</span>
                  </>
                ) : ing.isOil ? `${g.toFixed(2)} ml` : `${g} g`}
              </span>
              <span className="w-11 text-right text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono whitespace-nowrap max-[520px]:hidden" title={energyLabel}>
                {energyShort}
              </span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
