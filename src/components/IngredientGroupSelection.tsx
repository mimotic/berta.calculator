import { INGREDIENTS, nutritionBasisLabel, isNutrientKnown, SUPPLEMENT_NOTE, type Ingredient } from '../data/ingredients'

type Props = {
  group: Ingredient['group']
  label: string
  selected: ReadonlySet<string>
  onChange: (selected: Set<string>) => void
}

// Shared by first-time setup and the per-group editor.
export function IngredientGroupSelection({ group, label, selected, onChange }: Props) {
  const items = INGREDIENTS.filter(ingredient => ingredient.group === group)

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  const setAll = (checked: boolean) => {
    const next = new Set(selected)
    for (const ingredient of items) {
      if (checked) next.add(ingredient.id)
      else next.delete(ingredient.id)
    }
    onChange(next)
  }

  return (
    <fieldset>
      <legend className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] font-mono">
        {label}
      </legend>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] mt-3 mb-4">
        <button
          type="button"
          onClick={() => setAll(true)}
          className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
        >
          marcar todo
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => setAll(false)}
          className="underline hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
        >
          desmarcar todo
        </button>
      </div>

      {group === 'suplementos' && <p className="text-xs leading-relaxed text-[#6b6b67] dark:text-[#8a8a85] mb-4">{SUPPLEMENT_NOTE}</p>}
      <div className="flex flex-col gap-2">
        {items.map(ingredient => (
          <label
            key={ingredient.id}
            className="flex items-center gap-3 py-2 px-3 border border-black/10 dark:border-white/10 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.has(ingredient.id)}
              onChange={() => toggle(ingredient.id)}
              className="accent-black dark:accent-white w-4 h-4 shrink-0"
            />
            <span className="flex-1 min-w-0 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-[13px] font-serif">{ingredient.label}</span>
              <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono tabular-nums shrink-0">
                {isNutrientKnown(ingredient, 'kcal') ? `${ingredient.kcal} kcal ${nutritionBasisLabel(ingredient)}` : 'Energía no declarada'}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
