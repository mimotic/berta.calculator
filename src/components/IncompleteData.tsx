import { PARTIAL_NUTRITION_NOTE, type Ingredient, type Values } from '../data/ingredients'
import { incompleteIngredients } from '../utils/nutritionAvailability'

const WARN_TEXT = 'text-[#854f0b] dark:text-[#e8b980]'

/** Marks a value that only adds up the ingredients with data. */
export function IncompleteTag({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[10px] font-mono font-normal ${WARN_TEXT} ${className}`} title="Solo suma los ingredientes con datos de este nutriente">
      incompleto
    </span>
  )
}

/** Warning listing which used ingredients lack which data. Renders nothing when all data are known. */
export function IncompleteDataNote({ ingredients, values, className = '' }: { ingredients: Ingredient[]; values: Values; className?: string }) {
  const gaps = incompleteIngredients(ingredients, values)
  if (gaps.length === 0) return null
  return (
    <div role="note" className={`text-xs leading-relaxed py-2 px-3 rounded-md font-serif bg-[#faeeda] dark:bg-[#3a2a10] ${WARN_TEXT} ${className}`}>
      <p>{PARTIAL_NUTRITION_NOTE}</p>
      <ul className="mt-1.5 flex flex-col gap-0.5">
        {gaps.map(({ label, gaps }) => (
          <li key={label}>
            <span className="font-bold">{label}</span>: faltan {gaps}.
          </li>
        ))}
      </ul>
    </div>
  )
}
