import { useState } from 'react'
import '../index.css'

type ActivityLevel = 'inactivo' | 'baja' | 'moderada' | 'alta'

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  inactivo: 'Inactivo',
  baja: 'Actividad baja',
  moderada: 'Actividad moderada',
  alta: 'Actividad alta',
}

// MER factor = RER × factor (WSAVA/NRC guidelines)
function getMERFactor(activity: ActivityLevel, neutered: boolean): number {
  if (activity === 'inactivo') return neutered ? 1.2 : 1.4
  if (activity === 'baja')     return neutered ? 1.4 : 1.6
  if (activity === 'moderada') return neutered ? 1.6 : 1.8
  return 2.0
}

function calcCalories(weightKg: number, activity: ActivityLevel, neutered: boolean) {
  const rer = 70 * Math.pow(weightKg, 0.75)
  const factor = getMERFactor(activity, neutered)
  return { rer, mer: rer * factor, factor }
}

export default function CaloriesCalculator() {
  const [weight, setWeight] = useState<string>('')
  const [neutered, setNeutered] = useState<boolean>(true)
  const [activity, setActivity] = useState<ActivityLevel>('moderada')

  const weightNum = parseFloat(weight)
  const valid = !isNaN(weightNum) && weightNum > 0

  const result = valid ? calcCalories(weightNum, activity, neutered) : null

  return (
    <div className="font-serif bg-[#f9f8f6] text-[#1a1a18] min-h-screen py-8 px-4">
      <div className="max-w-120 mx-auto">

        <header className="mb-8">
          <h1 className="text-[22px] font-normal tracking-tight">Calorías diarias — perro</h1>
          <p className="text-[13px] text-[#6b6b67] mt-1 font-mono">
            basado en RER × factor de actividad (WSAVA)
          </p>
        </header>

        <div className="bg-white border border-black/10 rounded-[10px] px-6 py-5 mb-4">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] mb-4 font-mono">
            Datos del perro
          </div>

          <div className="flex flex-col gap-5">

            {/* Peso */}
            <div>
              <label className="text-[12px] text-[#6b6b67] font-mono block mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="ej. 8.5"
                className="w-full border border-black/15 rounded-md px-3 py-2 text-[15px] font-serif bg-white outline-none focus:border-black/40 placeholder:text-[#bbb]"
              />
            </div>

            {/* Castrado */}
            <div>
              <label className="text-[12px] text-[#6b6b67] font-mono block mb-1">
                Castrado/a
              </label>
              <div className="flex gap-2">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setNeutered(val)}
                    className={`flex-1 py-2 rounded-md text-[13px] font-mono border transition-colors ${
                      neutered === val
                        ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
                        : 'bg-white text-[#1a1a18] border-black/15 hover:border-black/40'
                    }`}
                  >
                    {val ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Nivel de actividad */}
            <div>
              <label className="text-[12px] text-[#6b6b67] font-mono block mb-1">
                Nivel de actividad
              </label>
              <div className="flex flex-col gap-1.5">
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setActivity(level)}
                    className={`text-left px-3 py-2 rounded-md text-[13px] font-serif border transition-colors ${
                      activity === level
                        ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
                        : 'bg-white text-[#1a1a18] border-black/15 hover:border-black/40'
                    }`}
                  >
                    {ACTIVITY_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white border border-black/10 rounded-[10px] px-6 py-5 mb-4">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#6b6b67] mb-4 font-mono">
              Resultado
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#6b6b67] font-mono">RER (reposo)</span>
                <span className="text-[15px] font-mono">{result.rer.toFixed(1)} kcal/día</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#6b6b67] font-mono">Factor aplicado</span>
                <span className="text-[15px] font-mono">× {result.factor.toFixed(1)}</span>
              </div>
              <hr className="border-0 border-t border-black/10" />
              <div className="flex justify-between items-baseline">
                <span className="text-[14px] font-mono font-bold">Calorías diarias</span>
                <span className="text-[22px] font-mono text-[#1D9E75]">{result.mer.toFixed(0)} kcal</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6b6b67] mt-4 leading-relaxed italic font-serif">
              RER = 70 × peso<sup>0.75</sup>. Los factores son orientativos; consulta siempre con tu veterinario para ajustar la dieta individual del perro.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
