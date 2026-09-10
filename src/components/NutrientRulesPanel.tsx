import { ALERT_CLASS, type NutrientAssessment } from '../utils/nutrientAssessment'

/** "Minerales y parámetros" section: rule cards grid + alert list. */
export function NutrientRulesPanel({ mineralCards, alerts, className = '' }: {
  mineralCards: NutrientAssessment['mineralCards']
  alerts: NutrientAssessment['alerts']
  className?: string
}) {
  return (
    <div className={`p-5 ${className}`}>
      {mineralCards.length > 0 && (
        <>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] dark:text-[#8a8a85] mb-4 font-mono">
            Minerales y parámetros
          </div>
          <div className="grid grid-cols-3 max-[520px]:grid-cols-2 gap-2">
            {mineralCards.map(({ key, el }) => (
              <div key={key}>{el}</div>
            ))}
          </div>
        </>
      )}
      <div className={`flex flex-col gap-1.25 ${mineralCards.length > 0 ? 'mt-3' : ''}`}>
        {alerts.map(([type, msg], i) => (
          <div key={i} className={`text-xs py-1.5 px-3 rounded-md font-serif ${ALERT_CLASS[type]}`}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}
