import { useEffect, useRef, useState } from 'react'
import { INGREDIENTS, INGREDIENT_GROUPS } from '../data/ingredients'
import { IngredientGroupSelection } from './IngredientGroupSelection'

type Group = (typeof INGREDIENT_GROUPS)[number]

type Props = {
  selectedIds: string[]
  onSave: (ids: string[]) => void
  onClose: () => void
}

export function IngredientsEditor({ selectedIds, onSave, onClose }: Props) {
  const [activeGroup, setActiveGroup] = useState<Group | null>(null)
  const [draft, setDraft] = useState<Set<string>>(() => new Set(selectedIds))
  const [savedGroup, setSavedGroup] = useState<string | null>(null)
  const selected = new Set(selectedIds)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const groupButtons = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastGroup = useRef<string | null>(null)

  useEffect(() => {
    if (activeGroup) headingRef.current?.focus({ preventScroll: true })
    else if (lastGroup.current) groupButtons.current[lastGroup.current]?.focus({ preventScroll: true })
  }, [activeGroup])

  const openGroup = (group: Group) => {
    lastGroup.current = group.group
    setDraft(new Set(selectedIds))
    setSavedGroup(null)
    setActiveGroup(group)
    window.scrollTo(0, 0)
  }

  const backToGroups = () => {
    setActiveGroup(null)
    window.scrollTo(0, 0)
  }

  const saveGroup = () => {
    if (!activeGroup) return
    onSave(Array.from(draft))
    setSavedGroup(activeGroup.label)
    backToGroups()
  }

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={activeGroup ? backToGroups : onClose}
            className="text-xs font-mono text-[#6b6b67] dark:text-[#8a8a85] hover:text-[#1a1a18] dark:hover:text-[#e8e6e0] transition-colors cursor-pointer"
          >
            {activeGroup ? '← Volver a grupos' : '← Volver a la calculadora'}
          </button>
        </div>

        <header className="mb-6">
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-normal tracking-tight leading-tight">
            {activeGroup ? `Editar ${activeGroup.label.toLowerCase()}` : 'Editar ingredientes'}
          </h1>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            {activeGroup
              ? 'elige los ingredientes y guarda para volver a los grupos'
              : 'elige el grupo de ingredientes que quieres editar'}
          </p>
        </header>

        {activeGroup ? (
          <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5">
            <IngredientGroupSelection
              group={activeGroup.group}
              label={activeGroup.label}
              selected={draft}
              onChange={setDraft}
            />
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                type="button"
                onClick={backToGroups}
                className="px-4 py-2 text-[13px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveGroup}
                className="flex-1 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Guardar y volver a grupos
              </button>
            </div>
          </div>
        ) : (
          <>
            {savedGroup && (
              <p role="status" className="text-xs py-2 px-3 rounded-md font-mono mb-4 bg-[#e1f5ee] text-[#0f6e56] dark:bg-[#0f3328] dark:text-[#7ad4b1]">
                {savedGroup}: cambios guardados
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INGREDIENT_GROUPS.map(group => {
                const items = INGREDIENTS.filter(ingredient => ingredient.group === group.group)
                const count = items.filter(ingredient => selected.has(ingredient.id)).length
                return (
                  <button
                    key={group.group}
                    ref={button => { groupButtons.current[group.group] = button }}
                    type="button"
                    onClick={() => openGroup(group)}
                    className="group flex items-center justify-between gap-4 text-left bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] transition-colors cursor-pointer"
                  >
                    <span>
                      <span className="block text-lg tracking-tight">{group.label}</span>
                      <span className="block text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] mt-1">
                        {count} de {items.length} seleccionados
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-[#5B8DEF] group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-5 px-4 py-2 text-[13px] font-mono bg-[#1a1a18] text-white dark:bg-[#e8e6e0] dark:text-[#1a1a18] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Volver a la calculadora
            </button>
          </>
        )}
      </div>
    </div>
  )
}
