import type { Ingredient, NutritionKey } from '../data/ingredients'

interface IngredientModalProps {
  ingredient: Ingredient
  onClose: () => void
}

const ROWS: { label: string; key: NutritionKey; unit: string; decimals: number }[] = [
  { label: 'Energía',      key: 'kcal',  unit: 'kcal', decimals: 0 },
  { label: 'Proteína',     key: 'prot',  unit: 'g',    decimals: 1 },
  { label: 'Grasa',        key: 'fat',   unit: 'g',    decimals: 1 },
  { label: 'Hidratos',     key: 'carb',  unit: 'g',    decimals: 1 },
  { label: 'Fibra',        key: 'fiber', unit: 'g',    decimals: 1 },
  { label: 'Calcio',       key: 'ca',    unit: 'mg',   decimals: 0 },
  { label: 'Fósforo',      key: 'phos',  unit: 'mg',   decimals: 0 },
  { label: 'Potasio',      key: 'pot',   unit: 'mg',   decimals: 0 },
  { label: 'Sodio',        key: 'na',    unit: 'mg',   decimals: 0 },
  { label: 'Hierro',       key: 'fe',    unit: 'mg',   decimals: 2 },
  { label: 'Zinc',         key: 'zn',    unit: 'mg',   decimals: 2 },
  { label: 'Vitamina A',   key: 'vitA',  unit: 'µg',   decimals: 0 },
  { label: 'Vitamina D',   key: 'vitD',  unit: 'µg',   decimals: 2 },
  { label: 'Vitamina E',   key: 'vitE',  unit: 'mg',   decimals: 2 },
  { label: 'Vitamina C',   key: 'vitC',  unit: 'mg',   decimals: 1 },
  { label: 'Tiamina (B1)', key: 'b1',    unit: 'mg',   decimals: 2 },
  { label: 'Riboflavina (B2)', key: 'b2', unit: 'mg',  decimals: 2 },
  { label: 'Niacina (B3)', key: 'b3',    unit: 'mg',   decimals: 2 },
  { label: 'Vitamina B6',  key: 'b6',    unit: 'mg',   decimals: 2 },
  { label: 'Folato (B9)',  key: 'b9',    unit: 'µg',   decimals: 0 },
  { label: 'Vitamina B12', key: 'b12',   unit: 'µg',   decimals: 2 },
]

export function IngredientModal({ ingredient, onClose }: IngredientModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl w-full max-w-sm shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b border-black/10 dark:border-white/10">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] font-mono mb-0.5">
              Valores analíticos
            </p>
            <h2 className="text-[15px] font-serif text-[#1a1a18] dark:text-[#e8e6e0]">
              {ingredient.label}
            </h2>
            <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-0.5">
              por 100 g{ingredient.isOil ? ' / ml' : ''}
            </p>
            {ingredient.portion && (
              <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-1">
                1 {ingredient.portion.singular} = {ingredient.portion.grams.toLocaleString('es-ES')} g
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors text-lg leading-none mt-0.5 cursor-pointer"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
        {ingredient.sourceUrl && (
          <div className="px-4 pt-3 text-xs text-[#6b6b67] dark:text-[#8a8a85]">
            <a href={ingredient.sourceUrl} target="_blank" rel="noreferrer" className="underline">Ficha de Edgard & Cooper</a>
            <p className="mt-2">{ingredient.nutritionNote}</p>
          </div>
        )}
        <ul className="divide-y divide-black/5 dark:divide-white/5 px-4 pb-2">
          {ROWS.map(({ label, key, unit, decimals }) => {
            const raw = ingredient[key]
            const estimated = key === 'carb' && !!ingredient.declaredNutrients && raw > 0
            const known = !ingredient.declaredNutrients || ingredient.declaredNutrients.includes(key) || estimated
            const val = known ? `${estimated ? '≈ ' : ''}${raw.toFixed(decimals)}` : 'No declarado'
            return (
              <li key={key} className="flex items-baseline justify-between py-2 text-[13px]">
                <span className="font-serif text-[#1a1a18] dark:text-[#e8e6e0]">{label}</span>
                <span className="font-mono tabular-nums">
                  {val}
                  {known && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>}
                </span>
              </li>
            )
          })}
        </ul>
        </div>
      </div>
    </div>
  )
}
