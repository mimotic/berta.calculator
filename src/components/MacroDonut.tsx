import { calcNutrition, ingredientGrams, type Ingredient } from '../data/ingredients'
import { macroDistribution } from '../utils/macroDistribution'

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

export function MacroDonut({ r }: { r: ReturnType<typeof calcNutrition> }) {
  const C = DONUT_C
  const legend = macroDistribution(r)
  const hasData = legend.some(m => m.pct > 0)

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" className="stroke-[#e5e2dc] dark:stroke-[#2a2826]" strokeWidth="10" />
        {hasData && legend.map(({ name, color, pct }, i) => {
          const precedingPct = legend.slice(0, i).reduce((sum, m) => sum + m.pct, 0)
          return <DonutSeg key={name} len={(pct / 100) * C} offset={C - (precedingPct / 100) * C} color={color} />
        })}
        <text x="50" y="46" textAnchor="middle" fontSize="8.5" className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">macros</text>
        <text x="50" y="57" textAnchor="middle" fontSize="8"   className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">% kcal</text>
      </svg>
      <div className="flex flex-col gap-2.5 w-full">
        {legend.map(({ color, name, pct }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-serif flex-1">{name}</span>
            <span className="text-[13px] font-mono font-bold text-[#1a1a18] dark:text-[#e8e6e0]">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="w-full mt-1 rounded-lg bg-[#f5f3ef] dark:bg-[#1e1c1a] p-3">
        <p className="text-[11px] text-[#9b9b97] dark:text-[#6b6b67] font-serif mb-2">Orientativo perro adulto sano</p>
        <div className="flex flex-col gap-1">
          {legend.map(({ color, name, range }) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[11px] text-[#9b9b97] dark:text-[#6b6b67] font-serif flex-1">{name}</span>
              <span className="text-[11px] font-mono text-[#9b9b97] dark:text-[#6b6b67]">{range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const WEIGHT_GROUPS: { group: Ingredient['group']; name: string; color: string }[] = [
  { group: 'prot',    name: 'Proteína', color: '#5B8DEF' },
  { group: 'hc',      name: 'Hidratos', color: '#1D9E75' },
  { group: 'verdura', name: 'Verduras', color: '#7CB342' },
  { group: 'fruta',   name: 'Frutas',   color: '#C2559C' },
  { group: 'fat',     name: 'Grasas',   color: '#EF9F27' },
  { group: 'pienso',  name: 'Pienso',   color: '#A5703F' },
  { group: 'treats',  name: 'Treats',   color: '#9270B8' },
]

export function WeightDonut({ ingredients, values }: { ingredients: Ingredient[]; values: Record<string, number> }) {
  const sumGroup = (group: Ingredient['group']) =>
    ingredients.filter(i => i.group === group).reduce((s, i) => s + ingredientGrams(i, values[i.id] ?? 0), 0)

  const grams = WEIGHT_GROUPS.map(g => sumGroup(g.group))
  const total = grams.reduce((s, g) => s + g, 0)
  const C     = DONUT_C

  const legend = WEIGHT_GROUPS.map((g, i) => {
    const pct = total > 0 ? (grams[i] / total) * 100 : 0
    const len = (pct / 100) * C
    const precedingGrams = grams.slice(0, i).reduce((sum, weight) => sum + weight, 0)
    const offset = C - (total > 0 ? precedingGrams / total * C : 0)
    return { ...g, g: grams[i], pct, len, offset }
  })

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" className="stroke-[#e5e2dc] dark:stroke-[#2a2826]" strokeWidth="10" />
        {total > 0 && legend.map(({ group, len, offset, color }) => (
          len > 0 && <DonutSeg key={group} len={len} offset={offset} color={color} />
        ))}
        <text x="50" y="46" textAnchor="middle" fontSize="8.5" className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">peso</text>
        <text x="50" y="57" textAnchor="middle" fontSize="8"   className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">% g</text>
      </svg>
      <div className="flex flex-col gap-2.5 w-full">
        {legend.map(({ color, name, pct, g }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-xs text-[#6b6b67] dark:text-[#8a8a85] font-serif flex-1">{name}</span>
            <span className="text-[11px] font-mono text-[#9b9b97] dark:text-[#6b6b67]">{g.toFixed(0)} g</span>
            <span className="text-[13px] font-mono font-bold text-[#1a1a18] dark:text-[#e8e6e0] w-13 text-right">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
