import { useState } from 'react'
import { Header } from './Header'
import { type PathologyId, PATHOLOGY_DEFS } from '../data/pathologies'

const OPTION_IDS: PathologyId[] = ['renal', 'hepatica_estable', 'encefalopatia_hepatica', 'digestiva_low_fat', 'cardiaca']

type Props = {
  initial: PathologyId[]
  onSubmit: (ids: PathologyId[]) => void
  onCancel?: () => void
}

export function PathologyWizard({ initial, onSubmit, onCancel }: Props) {
  const [selected, setSelected] = useState<Set<PathologyId>>(() => new Set(initial))

  const toggle = (id: PathologyId) => {
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
            <h1 className="text-[24px] font-normal tracking-tight leading-tight">Patologías</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">paso 2 · patologías</span>
          </div>
          <p className="text-[12px] text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            selecciona las patologías que aplican — pueden ser varias
          </p>
        </header>

        <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
            Patologías
          </div>

          <div className="grid grid-cols-1 gap-2 mb-5">
            {OPTION_IDS.map(id => {
              const def = PATHOLOGY_DEFS[id]
              const active = selected.has(id)
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                    active
                      ? 'border-[#1a1a18] dark:border-[#e8e6e0] bg-[#1a1a18] dark:bg-[#e8e6e0] text-white dark:text-[#1a1a18]'
                      : 'border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30'
                  }`}
                >
                  <div className="text-[14px] font-serif">{def.label}</div>
                  <div className={`text-[11px] font-mono mt-0.5 ${active ? 'opacity-70' : 'text-[#6b6b67] dark:text-[#8a8a85]'}`}>
                    {def.description}
                  </div>
                </button>
              )
            })}
          </div>

          {selected.size === 0 && (
            <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mb-4">
              Sin patologías seleccionadas — solo se controlará el objetivo calórico.
            </p>
          )}

          <div className="flex gap-2">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => onSubmit(Array.from(selected))}
              className="flex-1 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md hover:opacity-90 transition-opacity"
            >
              Continuar →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
