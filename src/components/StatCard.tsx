interface StatCardProps {
  value: string
  valueColor?: string
  label: string
  barPct?: number
  barColor?: string
  barLabel?: string
}

export function StatCard({ value, valueColor, label, barPct, barColor, barLabel }: StatCardProps) {
  return (
    <div className="bg-[#f2f0ec] dark:bg-[#242220] rounded-[6px] py-3 px-[0.6rem] text-center">
      <div className="text-[20px] font-mono font-bold leading-none" style={{ color: valueColor ?? 'inherit' }}>
        {value}
      </div>
      <div className="text-[10px] text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-serif">{label}</div>
      {barPct != null && (
        <>
          <div className="h-[3px] rounded-sm bg-black/10 dark:bg-white/10 overflow-hidden mt-1.5">
            <div
              className="h-full rounded-sm transition-[width] duration-[250ms]"
              style={{ width: `${barPct}%`, background: barColor }}
            />
          </div>
          <div className="text-[9px] text-[#6b6b67] dark:text-[#8a8a85] mt-[3px] font-mono">{barLabel}</div>
        </>
      )}
    </div>
  )
}
