type StepperProps = {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit?: string
  label?: string
  wholeUnits?: boolean
  disabled?: boolean
}

export function Stepper({ value, onChange, min, max, step, unit, label = 'Cantidad', wholeUnits = false, disabled = false }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const round = (v: number) => +v.toFixed(2)
  const dec = () => onChange(clamp(round(value - step)))
  const inc = () => onChange(clamp(round(value + step)))
  return (
    <div className="flex items-center border border-black/15 dark:border-white/15 rounded-md bg-white dark:bg-[#1a1a18] overflow-hidden focus-within:border-black/40 dark:focus-within:border-white/40 transition-colors">
      <button type="button" onClick={dec} disabled={disabled || value <= min} aria-label={`Reducir ${label}`} className="w-9 h-10 shrink-0 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono disabled:opacity-40 disabled:cursor-not-allowed">−</button>
      <input
        type="text"
        inputMode={wholeUnits ? 'numeric' : 'decimal'}
        aria-label={label}
        disabled={disabled}
        value={String(value)}
        onChange={e => {
          const raw = e.target.value
          if (raw === '') {
            onChange(min)
            return
          }
          const v = Number(raw.replace(',', '.'))
          if (Number.isFinite(v)) onChange(clamp(wholeUnits ? Math.round(v) : v))
        }}
        className="flex-1 text-center text-[17px] font-mono font-bold py-2 outline-none bg-transparent w-0 min-w-0"
      />
      {unit && <span className="pr-3 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">{unit}</span>}
      <button type="button" onClick={inc} disabled={disabled || value >= max} aria-label={`Aumentar ${label}`} className="w-9 h-10 shrink-0 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono border-l border-black/10 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed">+</button>
    </div>
  )
}
