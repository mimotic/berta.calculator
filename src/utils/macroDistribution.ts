import type { NutritionResult } from '../data/ingredients'

// Reparto de la energía entre macros en % de kcal (factores de Atwater 4/4/9).
// range es el intervalo orientativo para un perro adulto sano.
export function macroDistribution(r: Pick<NutritionResult, 'prot' | 'carb' | 'fat'>) {
  const macros = [
    { name: 'Proteína', color: '#5B8DEF', kcal: r.prot * 4, range: '20–30%' },
    { name: 'Hidratos', color: '#1D9E75', kcal: r.carb * 4, range: '30–50%' },
    { name: 'Grasas',   color: '#EF9F27', kcal: r.fat * 9,  range: '25–40%' },
  ]
  const total = macros.reduce((s, m) => s + m.kcal, 0)
  return macros.map(m => ({ ...m, pct: total > 0 ? (m.kcal / total) * 100 : 0 }))
}
