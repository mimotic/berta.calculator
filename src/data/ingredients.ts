export interface Ingredient {
  id: string
  label: string
  group: 'hc' | 'prot' | 'fat'
  val: number
  max: number
  step: number
  isOil: boolean
  kcal: number
  prot: number
  fat: number
  phos: number
  pot: number
  carb: number
}

export const INGREDIENTS: Ingredient[] = [
  { id:'patata',    label:'Patata cocida',       group:'hc',   val:110,  max:150, step:5,    isOil:false, kcal:77,  prot:2.0,  fat:0.1,  phos:40,  pot:328, carb:17.5 },
  { id:'arroz',     label:'Arroz blanco cocido', group:'hc',   val:0,    max:150, step:5,    isOil:false, kcal:130, prot:2.7,  fat:0.3,  phos:35,  pot:35,  carb:28.2 },
  { id:'calabacin', label:'Calabacín cocido',    group:'hc',   val:60,   max:150, step:5,    isOil:false, kcal:17,  prot:1.2,  fat:0.2,  phos:32,  pot:261, carb:3.1  },
  { id:'zanahoria', label:'Zanahoria cocida',    group:'hc',   val:20,   max:80,  step:5,    isOil:false, kcal:35,  prot:0.8,  fat:0.2,  phos:30,  pot:235, carb:7.9  },
  { id:'merluza',   label:'Merluza cocida',      group:'prot', val:70,   max:120, step:5,    isOil:false, kcal:77,  prot:15.8, fat:1.5,  phos:140, pot:302, carb:0    },
  { id:'salmon',    label:'Salmón cocido',       group:'prot', val:0,    max:120, step:5,    isOil:false, kcal:206, prot:20.0, fat:13.0, phos:260, pot:384, carb:0    },
  { id:'pollo',     label:'Pollo cocido',        group:'prot', val:0,    max:120, step:5,    isOil:false, kcal:165, prot:31.0, fat:3.6,  phos:220, pot:256, carb:0    },
  { id:'higado',    label:'Hígado de pollo',     group:'prot', val:0,    max:60,  step:5,    isOil:false, kcal:165, prot:24.5, fat:6.5,  phos:300, pot:263, carb:0.7  },
  { id:'clara',     label:'Clara de huevo',      group:'prot', val:35,   max:80,  step:1,    isOil:false, kcal:52,  prot:10.9, fat:0.2,  phos:15,  pot:163, carb:0.7  },
  { id:'yema',      label:'Yema de huevo',       group:'fat', val:5,    max:20,  step:1,    isOil:false, kcal:322, prot:15.9, fat:26.5, phos:390, pot:109, carb:3.6  },
  { id:'aceite',    label:'Aceite oliva (ml)',   group:'fat',  val:0.5,  max:5,   step:0.25, isOil:true,  kcal:884, prot:0,    fat:100,  phos:0,   pot:1,   carb:0    },
]

export type Values = Record<string, number>

export function calcNutrition(values: Values) {
  let kcal = 0, prot = 0, fat = 0, carb = 0, phos = 0, pot = 0
  for (const ing of INGREDIENTS) {
    const g = values[ing.id]
    kcal += (g / 100) * ing.kcal
    prot += (g / 100) * ing.prot
    fat  += (g / 100) * ing.fat
    carb += (g / 100) * (ing.carb || 0)
    phos += (g / 100) * ing.phos
    pot  += (g / 100) * ing.pot
  }
  return { kcal, prot, fat, carb, phos, pot }
}
