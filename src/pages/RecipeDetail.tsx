import { Link, useParams } from 'react-router'
import '../index.css'
import { INGREDIENTS, calcNutrition } from '../data/ingredients'
import { getRecipe } from '../data/recipes'
import { PATHOLOGY_DEFS } from '../data/pathologies'
import { StatCard } from '../components/StatCard'
import { MacroDonut } from '../components/MacroDonut'

const GROUP_LABELS: { group: 'hc' | 'prot' | 'fat'; label: string }[] = [
  { group: 'hc', label: 'Hidratos' },
  { group: 'prot', label: 'Proteína' },
  { group: 'fat', label: 'Grasa' },
]

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
  const totalG = usedIngredients.reduce((s, i) => s + (recipe.values[i.id] ?? 0), 0)

  const diffK = r.kcal - recipe.kcalTarget
  const pct = Math.min(100, (r.kcal / recipe.kcalTarget) * 100)
  const kcalColor = Math.abs(diffK) <= 8 ? '#1D9E75' : diffK < 0 ? '#EF9F27' : '#E24B4A'

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
              {GROUP_LABELS.map(({ group, label }) => {
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
                            {recipe.values[ing.id]}
                            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">
                              {ing.isOil ? 'ml' : 'g'}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="bg-black/10 dark:bg-white/10 max-[720px]:hidden"></div>

            <div className="p-5 bg-[#fafaf7] dark:bg-[#141412] flex flex-col gap-5 max-[720px]:order-2">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                  Energía y macros
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <StatCard value={r.kcal.toFixed(1)} valueColor={kcalColor} label="kcal" barPct={pct} barColor={kcalColor} barLabel={`obj. ${recipe.kcalTarget}`} />
                  </div>
                  <StatCard value={r.prot.toFixed(1)} label="proteína g" />
                  <StatCard value={r.fat.toFixed(2)} label="grasa g" />
                  <StatCard value={r.carb.toFixed(1)} label="hidratos g" />
                  <StatCard value={totalG.toFixed(0)} label="peso total g" />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
                  Distribución macros
                </div>
                <MacroDonut r={r} />
              </div>
            </div>

          </div>

          <div className="p-5 border-t border-black/10 dark:border-white/10">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-3 font-mono">
              Minerales y micronutrientes
            </div>
            <ul className="divide-y divide-black/5 dark:divide-white/5">
              {[
                { label: 'Calcio',       value: r.ca.toFixed(1),    unit: 'mg' },
                { label: 'Fósforo',      value: r.phos.toFixed(1),  unit: 'mg' },
                { label: 'Ratio Ca:P',   value: r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—', unit: '' },
                { label: 'Sodio',        value: r.na.toFixed(1),    unit: 'mg' },
                { label: 'Potasio',      value: r.pot.toFixed(1),   unit: 'mg' },
                { label: 'Hierro',       value: r.fe.toFixed(2),    unit: 'mg' },
                { label: 'Zinc',         value: r.zn.toFixed(2),    unit: 'mg' },
                { label: 'Vitamina A',   value: r.vitA.toFixed(0),  unit: 'µg' },
                { label: 'Vitamina D',   value: r.vitD.toFixed(2),  unit: 'µg' },
                { label: 'Vitamina E',   value: r.vitE.toFixed(2),  unit: 'mg' },
                { label: 'Vitamina B12', value: r.b12.toFixed(2),   unit: 'µg' },
                { label: 'Fibra',        value: r.fiber.toFixed(1), unit: 'g' },
              ].map(({ label, value, unit }) => (
                <li key={label} className="flex items-baseline justify-between py-2 text-[13px] gap-3">
                  <span className="font-serif">{label}</span>
                  <span className="font-mono tabular-nums whitespace-nowrap">
                    {value}
                    {unit && <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] ml-1">{unit}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
