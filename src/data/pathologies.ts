export type PathologyId = 'renal' | 'hepatica' | 'digestiva' | 'cardiaca'

export type PathologyLimits = {
  fatMax?: number
  phosMax?: number
  potMin?: number
  potMax?: number
  naMax?: number
  protMax?: number
  fiberMin?: number
  fiberMax?: number
}

type PathologyDef = PathologyLimits & {
  label: string
  description: string
}

export const PATHOLOGY_DEFS: Record<PathologyId, PathologyDef> = {
  renal: {
    label: 'Renal',
    description: 'Fósforo <100mg, potasio 100–200mg, grasa <5g',
    fatMax: 5,
    phosMax: 100,
    potMin: 100,
    potMax: 200,
  },
  hepatica: {
    label: 'Hepática',
    description: 'Proteína <15g, grasa <4g, sodio <80mg',
    fatMax: 4,
    protMax: 15,
    naMax: 80,
  },
  digestiva: {
    label: 'Digestiva',
    description: 'Grasa <3g, fibra 1.5–4g',
    fatMax: 3,
    fiberMin: 1.5,
    fiberMax: 4,
  },
  cardiaca: {
    label: 'Cardíaca',
    description: 'Sodio <50mg',
    naMax: 50,
  },
}

export function computeLimits(pathologies: PathologyId[]): PathologyLimits {
  if (pathologies.length === 0) return {}
  const limits: PathologyLimits = {}
  for (const id of pathologies) {
    const def = PATHOLOGY_DEFS[id]
    if (def.fatMax   !== undefined) limits.fatMax   = limits.fatMax   !== undefined ? Math.min(limits.fatMax,   def.fatMax)   : def.fatMax
    if (def.phosMax  !== undefined) limits.phosMax  = limits.phosMax  !== undefined ? Math.min(limits.phosMax,  def.phosMax)  : def.phosMax
    if (def.potMin   !== undefined) limits.potMin   = limits.potMin   !== undefined ? Math.max(limits.potMin,   def.potMin)   : def.potMin
    if (def.potMax   !== undefined) limits.potMax   = limits.potMax   !== undefined ? Math.min(limits.potMax,   def.potMax)   : def.potMax
    if (def.naMax    !== undefined) limits.naMax    = limits.naMax    !== undefined ? Math.min(limits.naMax,    def.naMax)    : def.naMax
    if (def.protMax  !== undefined) limits.protMax  = limits.protMax  !== undefined ? Math.min(limits.protMax,  def.protMax)  : def.protMax
    if (def.fiberMin !== undefined) limits.fiberMin = limits.fiberMin !== undefined ? Math.max(limits.fiberMin, def.fiberMin) : def.fiberMin
    if (def.fiberMax !== undefined) limits.fiberMax = limits.fiberMax !== undefined ? Math.min(limits.fiberMax, def.fiberMax) : def.fiberMax
  }
  return limits
}
