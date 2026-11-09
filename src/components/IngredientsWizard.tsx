import { useState } from 'react'
import { INGREDIENT_GROUPS } from '../data/ingredients'
import { Header } from './Header'
import { IngredientGroupSelection } from './IngredientGroupSelection'

const STEPS = INGREDIENT_GROUPS.map(({ group, label }, index) => ({
  group, title: label, subtitle: `paso ${index + 1} · ${label.toLowerCase()}`,
}))

type Props = {
  initial: string[]
  onSubmit: (ids: string[]) => void
  onCancel?: () => void
}

export function IngredientsWizard({ initial, onSubmit, onCancel }: Props) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial))

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

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
          <IngredientGroupSelection
            group={current.group}
            label={current.title}
            selected={selected}
            onChange={setSelected}
          />

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
