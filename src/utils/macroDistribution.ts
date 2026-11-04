import { macroEnergyPct, type NutritionResult } from '../data/ingredients'

// Reparto de la energía entre macros en % de kcal: el mismo que usan los límites
// «% ME» de las patologías (macroEnergyPct).
// range es el intervalo orientativo para un perro adulto sano.
export function macroDistribution(r: Pick<NutritionResult, 'kcalProt' | 'kcalCarb' | 'kcalFat'>) {
  const pct = macroEnergyPct(r)
  return [
    { name: 'Proteína', color: '#5B8DEF', pct: pct.prot, range: '20–30%' },
    { name: 'Hidratos', color: '#1D9E75', pct: pct.carb, range: '30–50%' },
    { name: 'Grasas',   color: '#EF9F27', pct: pct.fat,  range: '25–40%' },
  ]
}
