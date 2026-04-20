import { calcNutrition } from '../data/ingredients'

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
  const PROT_C = '#5B8DEF'
  const CARB_C = '#EF9F27'
  const FAT_C  = '#1D9E75'

  const protKcal = r.prot * 4
  const carbKcal = r.carb * 4
  const fatKcal  = r.fat  * 9
  const total    = protKcal + carbKcal + fatKcal
  const C        = DONUT_C

  const protPct = total > 0 ? (protKcal / total) * 100 : 0
  const carbPct = total > 0 ? (carbKcal / total) * 100 : 0
  const fatPct  = total > 0 ? (fatKcal  / total) * 100 : 0
  const protLen = (protPct / 100) * C
  const carbLen = (carbPct / 100) * C
  const fatLen  = (fatPct  / 100) * C

  const legend = [
    { color: PROT_C, name: 'Proteína', pct: protPct },
    { color: CARB_C, name: 'Hidratos', pct: carbPct },
    { color: FAT_C,  name: 'Grasas',   pct: fatPct  },
  ]

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" className="stroke-[#e5e2dc] dark:stroke-[#2a2826]" strokeWidth="10" />
        {total > 0 && (
          <>
            <DonutSeg len={protLen} offset={0}           color={PROT_C} />
            <DonutSeg len={carbLen} offset={C - protLen} color={CARB_C} />
            <DonutSeg len={fatLen}  offset={fatLen}      color={FAT_C}  />
          </>
        )}
        <text x="50" y="46" textAnchor="middle" fontSize="8.5" className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">macros</text>
        <text x="50" y="57" textAnchor="middle" fontSize="8"   className="fill-[#9b9b97] dark:fill-[#6b6b67]" fontFamily="monospace">% kcal</text>
      </svg>
      <div className="flex flex-col gap-2.5 w-full">
        {legend.map(({ color, name, pct }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[12px] text-[#6b6b67] dark:text-[#8a8a85] font-serif flex-1">{name}</span>
            <span className="text-[13px] font-mono font-bold text-[#1a1a18] dark:text-[#e8e6e0]">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
