type StepperProps = {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit?: string
}

export function Stepper({ value, onChange, min, max, step, unit }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  const round = (v: number) => +v.toFixed(2)
  const dec = () => onChange(clamp(round(value - step)))
  const inc = () => onChange(clamp(round(value + step)))
  return (
    <div className="flex items-center border border-black/15 dark:border-white/15 rounded-md bg-white dark:bg-[#1a1a18] overflow-hidden focus-within:border-black/40 dark:focus-within:border-white/40 transition-colors">
      <button onClick={dec} className="w-9 h-10 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono">−</button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v)) onChange(clamp(v))
        }}
        className="flex-1 text-center text-[17px] font-mono font-bold py-2 outline-none bg-transparent w-0 min-w-0"
      />
      {unit && <span className="pr-3 text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono">{unit}</span>}
      <button onClick={inc} className="w-9 h-10 text-lg text-[#6b6b67] dark:text-[#9a9a95] hover:bg-black/5 dark:hover:bg-white/5 font-mono border-l border-black/10 dark:border-white/10">+</button>
    </div>
  )
}
