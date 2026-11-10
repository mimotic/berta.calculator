import { NO_DATA, amountCell, nutritionText, isIncomplete, weightText, isWeightIncomplete, calciumRatioText, isCalciumRatioIncomplete, kcalColor as kcalStatusColor } from '../utils/nutritionAvailability'
import { Link, useParams } from 'react-router'
import '../index.css'
import { INGREDIENTS, INGREDIENT_GROUPS, calcNutrition, ingredientGrams, ingredientUnit } from '../data/ingredients'
import { getRecipe } from '../data/recipes'
import { PATHOLOGY_DEFS } from '../data/pathologies'
import { StatCard } from '../components/StatCard'
import { IncompleteDataNote, IncompleteTag } from '../components/IncompleteData'
import { MacroDonut } from '../components/MacroDonut'
import { NutrientRulesPanel } from '../components/NutrientRulesPanel'
import { buildNutrientAssessment } from '../utils/nutrientAssessment'


function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function RecipeDetail() {
  const { id } = useParams()
  const recipe = id ? getRecipe(id) : null

  if (!recipe) {
    return (
      <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
        <div className="max-w-220 mx-auto">
          <div className="mb-6">
            <Link
              to="/recetas"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors"
            >
              ← Mis recetas
            </Link>
          </div>
          <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center">
            <p className="text-sm text-[#6b6b67] dark:text-[#8a8a85]">
              No se ha encontrado esta receta.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const usedIngredients = INGREDIENTS.filter(i => (recipe.values[i.id] ?? 0) > 0)
  const r = calcNutrition(recipe.values, usedIngredients)
  const totalG = usedIngredients.reduce((s, i) => s + ingredientGrams(i, recipe.values[i.id] ?? 0), 0)

  const pct = Math.min(100, (r.kcal / recipe.kcalTarget) * 100)
  const kcalColor = kcalStatusColor(r, recipe.kcalTarget)

  const { mineralCards, alerts, fatOverLimit, protOverLimit, footerNotes } =
    buildNutrientAssessment(r, recipe.kcalTarget, recipe.pathologies)

  const pathologyChip = recipe.pathologies.length > 0
    ? recipe.pathologies.map(id => PATHOLOGY_DEFS[id]?.label.toLowerCase()).filter(Boolean).join(' · ') + ' · canina'
    : 'canina'

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <div className="mb-6">
          <Link
            to="/recetas"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors"
          >
            ← Mis recetas
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex flex-col items-baseline justify-between gap-2 md:gap-4 md:flex-row">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">{recipe.title}</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">{pathologyChip}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1">
            <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-mono">
              guardada el {formatDate(recipe.createdAt)} · objetivo: {recipe.kcalTarget} kcal
            </p>
            <Link
              to={`/calculadora?receta=${recipe.id}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              ✎ Editar
            </Link>
          </div>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1px_1fr] max-[720px]:grid-cols-1">

            <div className="p-5 max-[720px]:order-1">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                Ingredientes
              </div>
              {usedIngredients.length === 0 && (
                <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-mono">
                  esta receta no tiene ingredientes
                </p>
              )}
              <IncompleteDataNote ingredients={usedIngredients} values={recipe.values} className="mb-4" />
              {INGREDIENT_GROUPS.map(({ group, label }) => {
                const items = usedIngredients.filter(i => i.group === group)
                if (items.length === 0) return null
                return (
                  <div key={group} className="mb-4 last:mb-0">
                    <div className="text-[10px] font-mono text-[#9a9a95] dark:text-[#6b6b67] uppercase tracking-wider mb-1.5">
                      {label}
                    </div>
                    <ul className="divide-y divide-black/5 dark:divide-white/5">
                      {items.map(ing => (
                        <li key={ing.id} className="flex items-baseline justify-between py-1.5 text-[13px] gap-3">
                          <span className="font-serif">{ing.label}</span>
                          <span className="font-mono tabular-nums whitespace-nowrap">
                            {recipe.values[ing.id].toLocaleString('es-ES', { maximumFractionDigits: 2 })}{' '}
                            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85]">
                              {ingredientUnit(ing, recipe.values[ing.id])}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="bg-black/10 dark:bg-white/10 max-[720px]:hidden min-[721px]:row-span-2"></div>

            <div className="p-5 bg-[#fafaf7] dark:bg-[#141412] flex flex-col gap-5 max-[720px]:order-2 min-[721px]:row-span-2">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                  Energía y macros
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <StatCard value={nutritionText(r, 'kcal', 1)} valueColor={kcalColor} label="kcal" barPct={pct} barColor={kcalColor} barLabel={`obj. ${recipe.kcalTarget}`} incomplete={isIncomplete(r, 'kcal')} />
                  </div>
                  <StatCard value={nutritionText(r, 'prot', 1)} valueColor={protOverLimit ? '#E24B4A' : undefined} label="proteína g" incomplete={isIncomplete(r, 'prot')} />
                  <StatCard value={nutritionText(r, 'fat', 2)} valueColor={fatOverLimit ? '#E24B4A' : undefined} label="grasa g" incomplete={isIncomplete(r, 'fat')} />
                  <StatCard value={nutritionText(r, 'carb', 1)} label="hidratos g" incomplete={isIncomplete(r, 'carb')} />
                  <StatCard value={weightText(r, totalG)} label="peso total g" incomplete={isWeightIncomplete(r, totalG)} />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                  Distribución macros
                </div>
                <MacroDonut r={r} />
              </div>
            </div>

            <NutrientRulesPanel
              mineralCards={mineralCards}
              alerts={alerts}
              className="max-[720px]:order-3 min-[721px]:border-t min-[721px]:border-black/10 dark:min-[721px]:border-white/10"
            />

          </div>

          <div className="p-5 border-t border-black/10 dark:border-white/10">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-3 font-mono">
              Micronutrientes
            </div>
            <ul className="divide-y divide-black/5 dark:divide-white/5">
              {[
                { label: 'Calcio',       ...amountCell(r, 'ca', 1),    unit: 'mg' },
                { label: 'Fósforo',      ...amountCell(r, 'phos', 1),  unit: 'mg' },
                { label: 'Ratio Ca:P',   value: calciumRatioText(r), incomplete: isCalciumRatioIncomplete(r), unit: '' },
                { label: 'Sodio',        ...amountCell(r, 'na', 1),    unit: 'mg' },
                { label: 'Potasio',      ...amountCell(r, 'pot', 1),   unit: 'mg' },
                { label: 'Hierro',       ...amountCell(r, 'fe', 2),    unit: 'mg' },
                { label: 'Zinc',         ...amountCell(r, 'zn', 2),    unit: 'mg' },
                { label: 'Vitamina A',   ...amountCell(r, 'vitA', 0),  unit: 'µg' },
                { label: 'Vitamina D',   ...amountCell(r, 'vitD', 2),  unit: 'µg' },
                { label: 'Vitamina E',   ...amountCell(r, 'vitE', 2),  unit: 'mg' },
                { label: 'Vitamina C',   ...amountCell(r, 'vitC', 1),  unit: 'mg' },
                { label: 'Tiamina (B1)', ...amountCell(r, 'b1', 2),    unit: 'mg' },
                { label: 'Riboflavina (B2)', ...amountCell(r, 'b2', 2), unit: 'mg' },
                { label: 'Niacina (B3)', ...amountCell(r, 'b3', 1),    unit: 'mg' },
                { label: 'Vitamina B6',  ...amountCell(r, 'b6', 2),    unit: 'mg' },
                { label: 'Folato (B9)',  ...amountCell(r, 'b9', 0),    unit: 'µg' },
                { label: 'Vitamina B12', ...amountCell(r, 'b12', 2),   unit: 'µg' },
                { label: 'Fibra',        ...amountCell(r, 'fiber', 1), unit: 'g' },
              ].map(({ label, value, incomplete, unit }) => (
                <li key={label} className="flex items-baseline justify-between py-2 text-[13px] gap-3">
                  <span className="font-serif">{label}</span>
                  <span className="font-mono tabular-nums whitespace-nowrap text-right">
                    {value}
                    {unit && value !== NO_DATA && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>}
                    {incomplete && <IncompleteTag className="block" />}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {footerNotes.length > 0 && (
          <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] mt-3 leading-relaxed italic font-serif px-1">
            {footerNotes.join(' ')}
          </p>
        )}

      </div>
    </div>
  )
}
