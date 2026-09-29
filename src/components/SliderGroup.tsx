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
  onUnitWeightChange?: (id: string, grams: number) => void
}

function UnitWeightControl({ ingredient, onChange }: { ingredient: Ingredient; onChange: (grams: number) => void }) {
  const grams = ingredient.portion?.grams
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(grams?.toString() ?? '')
  const parsed = Number(draft.replace(',', '.'))
  const valid = Number.isFinite(parsed) && parsed > 0

  if (grams && !editing) {
    return (
      <p className="mt-2 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">
        1 {ingredient.portion?.singular} = {grams.toLocaleString('es-ES')} g ·{' '}
        <button type="button" onClick={() => { setDraft(String(grams)); setEditing(true) }} className="underline cursor-pointer" aria-label={`Editar peso por unidad de ${ingredient.label}`}>editar peso</button>
      </p>
    )
  }

  return (
    <form className="mt-2 flex flex-wrap items-center gap-2 text-xs" onSubmit={e => {
      e.preventDefault()
      if (valid) { onChange(parsed); setEditing(false) }
    }}>
      <label htmlFor={`weight_${ingredient.id}`} className="text-[#6b6b67] dark:text-[#8a8a85]">Peso de 1 {ingredient.portion?.singular}</label>
      <input id={`weight_${ingredient.id}`} aria-label={`Gramos por ${ingredient.portion?.singular}`} type="text" inputMode="decimal" value={draft} onChange={e => setDraft(e.target.value)} className="w-16 rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-2 font-mono" />
      <span>g</span>
      <button type="submit" disabled={!valid} className="px-3 py-2 border border-black/15 dark:border-white/15 rounded-md font-mono disabled:opacity-40 disabled:cursor-not-allowed">Guardar peso</button>
      {editing && <button type="button" onClick={() => setEditing(false)} className="underline">Cancelar</button>}
    </form>
  )
}

export function SliderGroup({ label, group, values, onChange, ingredients = INGREDIENTS, targetKcal, onUnitWeightChange }: SliderGroupProps) {
  const [selected, setSelected] = useState<Ingredient | null>(null)
  const items = ingredients.filter(i => i.group === group)
  if (items.length === 0) return null
  return (
    <div>
      <div className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] italic mb-1.5 font-serif">{label}</div>
      {group === 'treats' && items.some(ing => !ing.portion?.grams) && (
        <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mb-3">
          Guarda el peso de una pieza para contar por unidades. Puedes pesar varias juntas y dividir el peso entre el número de piezas.
        </p>
      )}
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
                  <Stepper value={g} onChange={v => onChange(ing.id, v)} min={0} max={sliderMax} step={1} unit={ingredientUnit(ing, g)} label={`Cantidad de ${ing.label}`} wholeUnits disabled={!ing.portion.grams} />
                </div>
                {ing.portion.grams && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono whitespace-nowrap">{((ingredientGrams(ing, g) / 100) * ing.kcal).toFixed(1)} kcal</span>}
              </div>
              {onUnitWeightChange && <UnitWeightControl ingredient={ing} onChange={grams => onUnitWeightChange(ing.id, grams)} />}
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
