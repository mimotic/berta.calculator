export type PathologyId =
  | 'renal'
  | 'hepatica_estable'
  | 'encefalopatia_hepatica'
  | 'digestiva_low_fat'
  | 'cardiaca'

// How the limit is expressed
export type LimitBasis = 'per_100kcal' | 'pct_kcal' | 'per_serving'

export type NutrientKey = 'fat' | 'protein' | 'phosphorus' | 'potassium' | 'sodium' | 'fiber'

export type NutrientRule = {
  max?: number
  min?: number
  basis: LimitBasis
}

export type PathologyDef = {
  label: string
  description: string
  rules: Partial<Record<NutrientKey, NutrientRule>>
  notes?: string[]
}

export type NutrientMeta = {
  label: string
  unit: string
  kcalFactor?: number  // 4 for protein, 9 for fat — required for pct_kcal conversion
}

export const NUTRIENT_META: Record<NutrientKey, NutrientMeta> = {
  phosphorus: { label: 'fósforo',   unit: 'mg' },
  potassium:  { label: 'potasio',   unit: 'mg' },
  sodium:     { label: 'sodio',     unit: 'mg' },
  protein:    { label: 'proteína',  unit: 'g',  kcalFactor: 4 },
  fat:        { label: 'grasa',     unit: 'g',  kcalFactor: 9 },
  fiber:      { label: 'fibra',     unit: 'g' },
}

// All limits are expressed in a declared basis so that they scale with ration size
// and can be compared across different caloric targets.
//
// References: WSAVA/IRIS (renal), Merck VMM (cardiac), WSAVA GI (digestive)
export const PATHOLOGY_DEFS: Record<PathologyId, PathologyDef> = {
  renal: {
    label: 'Renal',
    description: 'ERC: fósforo y sodio bajos, proteína moderada de alta calidad',
    rules: {
      phosphorus: { max: 50,           basis: 'per_100kcal' },  // WSAVA: restricción en estadios 2–4
      sodium:     { max: 30,           basis: 'per_100kcal' },  // moderado; ascitis requiere más restricción
      protein:    { min: 14, max: 22,  basis: 'pct_kcal'   },  // proteína moderada; no excesiva ni deficiente
      potassium:  { min: 50, max: 100, basis: 'per_100kcal' },  // hipokalemia frecuente en ERC
    },
    notes: [
      'Fósforo y potasio calculados con reducción por hervido (~30%).',
      'Valores orientativos para ERC canina (WSAVA/IRIS). Ajustar por estadio y analítica.',
    ],
  },
  hepatica_estable: {
    label: 'Hepática estable',
    description: 'Sodio controlado si hay ascitis; sin restricción proteica de rutina',
    rules: {
      sodium: { max: 30, basis: 'per_100kcal' },
    },
    notes: [
      'En hepatopatía estable sin encefalopatía no se restringe proteína por defecto.',
      'La restricción de sodio es relevante principalmente si existe ascitis o edemas.',
    ],
  },
  encefalopatia_hepatica: {
    label: 'Encefalopatía hepática',
    description: 'Proteína moderada ≤18% ME; sodio controlado',
    rules: {
      protein: { max: 18, basis: 'pct_kcal'   },
      sodium:  { max: 30, basis: 'per_100kcal' },
    },
    notes: [
      'La restricción proteica se reserva para encefalopatía confirmada; no aplicar de forma preventiva.',
    ],
  },
  digestiva_low_fat: {
    label: 'Digestiva (baja en grasa)',
    description: 'Grasa ≤15% ME — pancreatitis, linfangiectasia, malabsorción',
    rules: {
      fat:   { max: 15,          basis: 'pct_kcal'   },
      fiber: { min: 0.5, max: 3, basis: 'per_100kcal' },
    },
    notes: [
      'Indicado en pancreatitis, linfangiectasia intestinal o malabsorción de grasas.',
      '"Digestiva" incluye múltiples condiciones; este perfil es específico para restricción grasa.',
    ],
  },
  cardiaca: {
    label: 'Cardíaca',
    description: 'Sodio <20mg/100kcal; mantener aporte calórico y masa muscular',
    rules: {
      sodium: { max: 20, basis: 'per_100kcal' },
    },
    notes: [
      'Merck VMM: en ICC leve-moderada evitar dietas altas en sal; restricción severa en casos avanzados.',
      'Priorizar densidad energética y mantenimiento de masa muscular.',
    ],
  },
}

// Merge rules from multiple pathologies taking the most restrictive value for each nutrient.
// Assumes rules for the same nutrient share the same basis across pathologies.
export function computeActiveRules(ids: PathologyId[]): Partial<Record<NutrientKey, NutrientRule>> {
  const merged: Partial<Record<NutrientKey, NutrientRule>> = {}
  for (const id of ids) {
    for (const [k, rule] of Object.entries(PATHOLOGY_DEFS[id].rules) as [NutrientKey, NutrientRule][]) {
      if (!merged[k]) {
        merged[k] = { ...rule }
      } else {
        const ex = merged[k]!
        if (rule.max !== undefined) ex.max = ex.max !== undefined ? Math.min(ex.max, rule.max) : rule.max
        if (rule.min !== undefined) ex.min = ex.min !== undefined ? Math.max(ex.min, rule.min) : rule.min
      }
    }
  }
  return merged
}

// Convert a per-serving nutrient value to the rule's declared basis.
// kcalFactor: 4 for protein, 9 for fat (only needed for pct_kcal).
export function getNormalizedValue(
  actual: number,
  kcal: number,
  basis: LimitBasis,
  kcalFactor?: number,
): number {
  if (kcal <= 0) return 0
  if (basis === 'per_100kcal') return actual / (kcal / 100)
  if (basis === 'pct_kcal')    return kcalFactor ? (actual * kcalFactor / kcal) * 100 : 0
  return actual
}

// Returns the display unit string for a nutrient given its basis.
export function displayUnit(basis: LimitBasis, rawUnit: string): string {
  if (basis === 'pct_kcal')    return '% ME'
  if (basis === 'per_100kcal') return `${rawUnit}/100kcal`
  return rawUnit
}
