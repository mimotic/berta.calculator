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
  ca: number
  na: number
  fe: number
  zn: number
  vitA: number
  vitD: number
  vitE: number
  b12: number
  fiber: number
}

export const INGREDIENTS: Ingredient[] = [
  { id:'patata',    label:'Patata cocida',            group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:86,  prot:2.0,  fat:0.1,  phos:35,  pot:328, carb:20,   ca:8,   na:5,   fe:0.31, zn:0.30, vitA:0,    vitD:0,    vitE:0.01, b12:0,    fiber:1.8 },
  { id:'arroz',     label:'Arroz blanco cocido',      group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:130, prot:2.7,  fat:0.3,  phos:35,  pot:35,  carb:28.2, ca:10,  na:1,   fe:0.20, zn:0.49, vitA:0,    vitD:0,    vitE:0.04, b12:0,    fiber:0.4 },
  { id:'pasta',     label:'Pasta cocida',             group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:131, prot:5.0,  fat:1.1,  phos:56,  pot:44,  carb:25.0, ca:6,   na:1,   fe:1.28, zn:0.50, vitA:0,    vitD:0,    vitE:0.06, b12:0,    fiber:1.8 },
  { id:'calabaza',  label:'Calabaza cocida',          group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:20,  prot:0.7,  fat:0.1,  phos:30,  pot:230, carb:4.9,  ca:15,  na:1,   fe:0.57, zn:0.23, vitA:288,  vitD:0,    vitE:1.06, b12:0,    fiber:0.5 },
  { id:'calabacin', label:'Calabacín cocido',         group:'hc',   val:0,  max:150, step:1,    isOil:false, kcal:17,  prot:1.2,  fat:0.2,  phos:32,  pot:261, carb:3.1,  ca:18,  na:3,   fe:0.37, zn:0.20, vitA:51,   vitD:0,    vitE:0.13, b12:0,    fiber:1.0 },
  { id:'zanahoria', label:'Zanahoria cocida',         group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:35,  prot:0.8,  fat:0.2,  phos:30,  pot:235, carb:7.9,  ca:30,  na:58,  fe:0.34, zn:0.20, vitA:852,  vitD:0,    vitE:1.03, b12:0,    fiber:2.9 },
  { id:'manzana',   label:'Manzana',                  group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:52,  prot:0.3,  fat:0.2,  phos:11,  pot:107, carb:13.8, ca:6,   na:1,   fe:0.12, zn:0.04, vitA:3,    vitD:0,    vitE:0.18, b12:0,    fiber:2.4 },
  { id:'merluza',   label:'Merluza cocida',           group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:86,  prot:15.8, fat:1.5,  phos:140, pot:302, carb:0,    ca:40,  na:90,  fe:1.00, zn:0.50, vitA:10,   vitD:1.0,  vitE:0.60, b12:2.0,  fiber:0   },
  { id:'salmon',    label:'Salmón cocido',            group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:206, prot:20.0, fat:13.0, phos:260, pot:384, carb:0,    ca:15,  na:75,  fe:0.50, zn:0.40, vitA:17,   vitD:11.0, vitE:1.35, b12:2.8,  fiber:0   },
  { id:'pollo',     label:'Pechuga de pollo cocida',  group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:155, prot:31.0, fat:3.6,  phos:220, pot:256, carb:0,    ca:15,  na:74,  fe:1.04, zn:1.00, vitA:9,    vitD:0.1,  vitE:0.27, b12:0.34, fiber:0   },
  { id:'higado',    label:'Hígado de pollo',          group:'prot', val:0,  max:60,  step:1,    isOil:false, kcal:165, prot:25,   fat:6.5,  phos:300, pot:263, carb:0.7,  ca:11,  na:71,  fe:11.6, zn:4.30, vitA:3300, vitD:0.3,  vitE:0.70, b12:16.6, fiber:0   },
  { id:'cerdo',     label:'Magro de cerdo cocido',    group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:143, prot:26.0, fat:4.0,  phos:220, pot:370, carb:0,    ca:12,  na:62,  fe:1.10, zn:2.90, vitA:2,    vitD:0.3,  vitE:0.25, b12:0.70, fiber:0   },
  { id:'ternera',   label:'Ternera cocida',           group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:158, prot:27.0, fat:5.2,  phos:210, pot:330, carb:0,    ca:10,  na:55,  fe:2.50, zn:4.30, vitA:0,    vitD:0.1,  vitE:0.20, b12:2.10, fiber:0   },
  { id:'clara',     label:'Clara de huevo',           group:'prot', val:0,  max:100, step:1,    isOil:false, kcal:52,  prot:10.9, fat:0.2,  phos:15,  pot:163, carb:0.7,  ca:7,   na:166, fe:0.08, zn:0.03, vitA:0,    vitD:0,    vitE:0,    b12:0.09, fiber:0   },
  { id:'yema',      label:'Yema de huevo',            group:'fat',  val:0,  max:20,  step:1,    isOil:false, kcal:322, prot:15.9, fat:26.5, phos:443, pot:102, carb:3.6,  ca:129, na:48,  fe:2.73, zn:2.30, vitA:381,  vitD:5.4,  vitE:2.58, b12:2.0,  fiber:0   },
  { id:'aceite',    label:'Aceite oliva (ml)',        group:'fat',  val:0,  max:20,  step:0.25, isOil:true,  kcal:884, prot:0,    fat:100,  phos:0,   pot:1,   carb:0,    ca:1,   na:2,   fe:0.56, zn:0,    vitA:0,    vitD:0,    vitE:14.35,b12:0,    fiber:0   },
  { id:'aceite_coco', label:'Aceite de coco (ml)',    group:'fat',  val:0,  max:20,  step:0.25, isOil:true,  kcal:892, prot:0,    fat:100,  phos:0,   pot:0,   carb:0,    ca:0,   na:0,   fe:0,    zn:0,    vitA:0,    vitD:0,    vitE:0.11, b12:0,    fiber:0   },
]

// kcal ranges: upTo is exclusive upper bound (Infinity = no limit)
const KCAL_RANGES: { upTo: number; factor: number }[] = [
  { upTo:  150, factor: 0.6 },
  { upTo:  500, factor: 1.0 },
  { upTo:  750, factor: 1.4 },
  { upTo: 1000, factor: 1.8 },
  { upTo: 1250, factor: 2.2 },
  { upTo: 1500, factor: 2.6 },
  { upTo: 1750, factor: 3.0 },
  { upTo: 2000, factor: 3.4 },
  { upTo: 2250, factor: 3.8 },
  { upTo: 2500, factor: 4.2 },
  { upTo: 2750, factor: 4.6 },
  { upTo: Infinity, factor: 5.0 },
]

export function getIngredientMax(ing: Ingredient, targetKcal: number): number {
  const range = KCAL_RANGES.find(r => targetKcal < r.upTo) ?? KCAL_RANGES[KCAL_RANGES.length - 1]
  const raw = ing.max * range.factor
  return Math.max(ing.step, Math.round(raw / ing.step) * ing.step)
}

export type Values = Record<string, number>

export function calcNutrition(values: Values, ingredients: Ingredient[] = INGREDIENTS) {
  let kcal = 0, prot = 0, fat = 0, carb = 0, phos = 0, pot = 0
  let ca = 0, na = 0, fe = 0, zn = 0, vitA = 0, vitD = 0, vitE = 0, b12 = 0, fiber = 0
  for (const ing of ingredients) {
    const g = values[ing.id] ?? 0
    kcal  += (g / 100) * ing.kcal
    prot  += (g / 100) * ing.prot
    fat   += (g / 100) * ing.fat
    carb  += (g / 100) * (ing.carb || 0)
    phos  += (g / 100) * ing.phos
    pot   += (g / 100) * ing.pot
    ca    += (g / 100) * ing.ca
    na    += (g / 100) * ing.na
    fe    += (g / 100) * ing.fe
    zn    += (g / 100) * ing.zn
    vitA  += (g / 100) * ing.vitA
    vitD  += (g / 100) * ing.vitD
    vitE  += (g / 100) * ing.vitE
    b12   += (g / 100) * ing.b12
    fiber += (g / 100) * ing.fiber
  }
  return { kcal, prot, fat, carb, phos, pot, ca, na, fe, zn, vitA, vitD, vitE, b12, fiber }
}

export type NutritionResult = ReturnType<typeof calcNutrition>
