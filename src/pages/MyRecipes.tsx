import { useState } from 'react'
import { Link } from 'react-router'
import '../index.css'
import { loadRecipes, deleteRecipe, type SavedRecipe } from '../data/recipes'
import { PATHOLOGY_DEFS } from '../data/pathologies'
import { Header } from '../components/Header'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>(() => loadRecipes())
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setRecipes(deleteRecipe(id))
    setConfirmingId(null)
  }

  return (
    <div className="font-serif bg-[#f9f8f6] dark:bg-[#0f0f0e] text-[#1a1a18] dark:text-[#e8e6e0] flex-1 py-8 px-4 transition-colors">
      <div className="max-w-220 mx-auto">

        <Header />

        <header className="mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-normal tracking-tight leading-tight">Mis recetas</h1>
            <span className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono shrink-0">
              {recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'}
            </span>
          </div>
          <p className="text-xs text-[#6b6b67] dark:text-[#8a8a85] mt-1 font-mono">
            recetas guardadas desde la calculadora de dieta
          </p>
        </header>

        {recipes.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center">
            <p className="text-sm text-[#6b6b67] dark:text-[#8a8a85] mb-4">
              Todavía no has guardado ninguna receta.
            </p>
            <Link
              to="/calculadora"
              className="text-[13px] font-mono text-[#5B8DEF] underline hover:opacity-80 transition-opacity"
            >
              ir a la calculadora de dieta →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.map(recipe => {
              const nIngredients = Object.keys(recipe.values).length
              const pathologyLabels = recipe.pathologies.map(id => PATHOLOGY_DEFS[id]?.label.toLowerCase()).filter(Boolean)
              return (
                <div
                  key={recipe.id}
                  className="group bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-[#5B8DEF] dark:hover:border-[#5B8DEF] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link to={`/recetas/${recipe.id}`} className="flex-1 min-w-0">
                      <h2 className="text-lg font-normal tracking-tight truncate">{recipe.title}</h2>
                      <p className="text-[11px] text-[#6b6b67] dark:text-[#8a8a85] font-mono mt-1">
                        {formatDate(recipe.createdAt)} · {recipe.kcalTarget} kcal · {nIngredients} {nIngredients === 1 ? 'ingrediente' : 'ingredientes'}
                        {pathologyLabels.length > 0 && ` · ${pathologyLabels.join(' · ')}`}
                      </p>
                    </Link>
                    <div className="shrink-0 flex items-center gap-2">
                      {confirmingId === recipe.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(recipe.id)}
                            className="px-3 py-1.5 text-[11px] font-mono text-white bg-[#E24B4A] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="px-3 py-1.5 text-[11px] font-mono border border-black/15 dark:border-white/15 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setConfirmingId(recipe.id)}
                            className="px-3 py-1.5 text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] border border-black/15 dark:border-white/15 rounded-md hover:text-[#E24B4A] hover:border-[#E24B4A] dark:hover:text-[#eb8585] dark:hover:border-[#eb8585] transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                          <Link
                            to={`/calculadora?receta=${recipe.id}`}
                            className="px-3 py-1.5 text-[11px] font-mono text-[#6b6b67] dark:text-[#8a8a85] border border-black/15 dark:border-white/15 rounded-md hover:text-[#1a1a18] hover:border-black/40 dark:hover:text-[#e8e6e0] dark:hover:border-white/40 transition-colors"
                          >
                            ✎ Editar
                          </Link>
                          <Link
                            to={`/recetas/${recipe.id}`}
                            className="px-3 py-1.5 text-[11px] font-mono text-[#5B8DEF] border border-black/15 dark:border-white/15 rounded-md hover:border-[#5B8DEF] transition-colors"
                          >
                            Ver →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
