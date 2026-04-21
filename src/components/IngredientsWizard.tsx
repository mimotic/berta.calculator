import { useState } from 'react'
import { INGREDIENTS } from '../data/ingredients'
import { Header } from './Header'

type Group = 'hc' | 'prot' | 'fat'

const STEPS: Array<{ group: Group; title: string; subtitle: string }> = [
  { group: 'hc',   title: 'Hidratos',  subtitle: 'paso 1 · hidratos' },
  { group: 'prot', title: 'Proteína',  subtitle: 'paso 2 · proteína' },
  { group: 'fat',  title: 'Grasa',     subtitle: 'paso 3 · grasa' },
]

type Props = {
  initial: string[]
  onSubmit: (ids: string[]) => void
  onCancel?: () => void
}

export function IngredientsWizard({ initial, onSubmit, onCancel }: Props) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial))

  const current = STEPS[step]
  const items = INGREDIENTS.filter(i => i.group === current.group)
  const isLast = step === STEPS.length - 1

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] min-h-screen py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Editar ingredientes</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">{current.subtitle}</span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            elige qué ingredientes aparecerán en la calculadora
          </p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
            {current.title}
          </div>

          <div className="flex flex-col gap-2">
            {items.map(ing => {
              const checked = selected.has(ing.id)
              return (
                <label
                  key={ing.id}
                  className="flex items-center gap-3 py-2 px-3 border border-black/10 dark:border-white/10 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(ing.id)}
                    className="accent-black dark:accent-white w-4 h-4 shrink-0"
                  />
                  <span className="text-[13px] font-serif flex-1">{ing.label}</span>
                  <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono tabular-nums">
                    {ing.kcal} kcal/100{ing.isOil ? 'ml' : 'g'}
                  </span>
                </label>
              )
            })}
          </div>

          <div className="flex gap-2 mt-5">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                ← Atrás
              </button>
            ) : onCancel ? (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
            ) : null}
            <button
              onClick={() => {
                if (isLast) onSubmit(Array.from(selected))
                else setStep(step + 1)
              }}
              className="flex-1 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md hover:opacity-90 transition-opacity"
            >
              {isLast ? 'Guardar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
