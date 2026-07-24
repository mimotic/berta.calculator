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
  vitC: number
  b1: number
  b2: number
  b3: number
  b6: number
  b9: number
  b12: number
  fiber: number
}

export const INGREDIENTS: Ingredient[] = [
  { id:'patata',    label:'Patata cocida',            group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:86,  prot:2.0,  fat:0.1,  phos:35,  pot:328, carb:20,   ca:8,   na:5,   fe:0.31, zn:0.30, vitA:0,    vitD:0,    vitE:0.01, vitC:7.4,  b1:0.098, b2:0.019, b3:1.31,  b6:0.269, b9:9,   b12:0,    fiber:1.8 },
  { id:'patata_cruda',    label:'Patata cruda',       group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:77,  prot:2.0,  fat:0.1,  phos:57,  pot:421, carb:17.5, ca:12,  na:6,   fe:0.81, zn:0.30, vitA:0,    vitD:0,    vitE:0.01, vitC:19.7, b1:0.081, b2:0.032, b3:1.06,  b6:0.298, b9:15,  b12:0,    fiber:2.1 },
  { id:'arroz',     label:'Arroz blanco cocido',      group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:130, prot:2.7,  fat:0.3,  phos:35,  pot:35,  carb:28.2, ca:10,  na:1,   fe:0.20, zn:0.49, vitA:0,    vitD:0,    vitE:0.04, vitC:0,    b1:0.02,  b2:0.013, b3:0.40,  b6:0.093, b9:3,   b12:0,    fiber:0.4 },
  { id:'arroz_crudo',     label:'Arroz blanco crudo', group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:365, prot:7.1,  fat:0.7,  phos:115, pot:115, carb:79.9, ca:28,  na:5,   fe:0.80, zn:1.09, vitA:0,    vitD:0,    vitE:0.11, vitC:0,    b1:0.07,  b2:0.049, b3:1.60,  b6:0.164, b9:8,   b12:0,    fiber:1.3 },
  { id:'harina_arroz',    label:'Harina de arroz',    group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:366, prot:6.0,  fat:1.4,  phos:98,  pot:76,  carb:80.1, ca:10,  na:0,   fe:0.35, zn:0.80, vitA:0,    vitD:0,    vitE:0.11, vitC:0,    b1:0.138, b2:0.021, b3:2.59,  b6:0.436, b9:4,   b12:0,    fiber:2.4 },
  { id:'pasta',     label:'Pasta cocida',             group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:131, prot:5.0,  fat:1.1,  phos:56,  pot:44,  carb:25.0, ca:6,   na:1,   fe:1.28, zn:0.50, vitA:0,    vitD:0,    vitE:0.06, vitC:0,    b1:0.02,  b2:0.02,  b3:0.40,  b6:0.049, b9:7,   b12:0,    fiber:1.8 },
  { id:'pasta_cruda',     label:'Pasta cruda',        group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:371, prot:13.0, fat:1.5,  phos:189, pot:223, carb:74.7, ca:21,  na:6,   fe:1.30, zn:1.41, vitA:0,    vitD:0,    vitE:0.11, vitC:0,    b1:0.09,  b2:0.06,  b3:1.70,  b6:0.142, b9:18,  b12:0,    fiber:3.2 },
  { id:'calabaza',  label:'Calabaza cocida',          group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:20,  prot:0.7,  fat:0.1,  phos:30,  pot:230, carb:4.9,  ca:15,  na:1,   fe:0.57, zn:0.23, vitA:288,  vitD:0,    vitE:1.06, vitC:4.7,  b1:0.031, b2:0.078, b3:0.41,  b6:0.044, b9:9,   b12:0,    fiber:0.5 },
  { id:'calabaza_cruda',  label:'Calabaza cruda',     group:'hc',   val:0,  max:200, step:1,    isOil:false, kcal:26,  prot:1.0,  fat:0.1,  phos:44,  pot:340, carb:6.5,  ca:21,  na:1,   fe:0.80, zn:0.32, vitA:426,  vitD:0,    vitE:1.06, vitC:9.0,  b1:0.05,  b2:0.11,  b3:0.60,  b6:0.061, b9:16,  b12:0,    fiber:0.5 },
  { id:'calabacin', label:'Calabacín cocido',         group:'hc',   val:0,  max:150, step:1,    isOil:false, kcal:17,  prot:1.2,  fat:0.2,  phos:32,  pot:261, carb:3.1,  ca:18,  na:3,   fe:0.37, zn:0.20, vitA:51,   vitD:0,    vitE:0.13, vitC:12.9, b1:0.039, b2:0.036, b3:0.46,  b6:0.093, b9:30,  b12:0,    fiber:1.0 },
  { id:'calabacin_crudo', label:'Calabacín crudo',    group:'hc',   val:0,  max:150, step:1,    isOil:false, kcal:17,  prot:1.2,  fat:0.3,  phos:38,  pot:261, carb:3.1,  ca:16,  na:8,   fe:0.37, zn:0.32, vitA:10,   vitD:0,    vitE:0.12, vitC:17.9, b1:0.045, b2:0.094, b3:0.45,  b6:0.163, b9:24,  b12:0,    fiber:1.0 },
  { id:'zanahoria', label:'Zanahoria cocida',         group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:35,  prot:0.8,  fat:0.2,  phos:30,  pot:235, carb:7.9,  ca:30,  na:58,  fe:0.34, zn:0.20, vitA:852,  vitD:0,    vitE:1.03, vitC:3.6,  b1:0.066, b2:0.044, b3:0.65,  b6:0.153, b9:14,  b12:0,    fiber:2.9 },
  { id:'zanahoria_cruda', label:'Zanahoria cruda',    group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:41,  prot:0.9,  fat:0.2,  phos:35,  pot:320, carb:9.6,  ca:33,  na:69,  fe:0.30, zn:0.24, vitA:835,  vitD:0,    vitE:0.66, vitC:5.9,  b1:0.066, b2:0.058, b3:0.98,  b6:0.138, b9:19,  b12:0,    fiber:2.8 },
  { id:'manzana',   label:'Manzana',                  group:'hc',   val:0,  max:80,  step:1,    isOil:false, kcal:52,  prot:0.3,  fat:0.2,  phos:11,  pot:107, carb:13.8, ca:6,   na:1,   fe:0.12, zn:0.04, vitA:3,    vitD:0,    vitE:0.18, vitC:4.6,  b1:0.017, b2:0.026, b3:0.09,  b6:0.041, b9:3,   b12:0,    fiber:2.4 },
  { id:'merluza',   label:'Merluza cocida',           group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:86,  prot:15.8, fat:1.5,  phos:140, pot:302, carb:0,    ca:40,  na:90,  fe:1.00, zn:0.50, vitA:10,   vitD:1.0,  vitE:0.60, vitC:0,    b1:0.07,  b2:0.07,  b3:2.50,  b6:0.28,  b9:8,   b12:2.0,  fiber:0   },
  { id:'merluza_cruda',   label:'Merluza cruda',      group:'prot', val:0,  max:150, step:1,    isOil:false, kcal:65,  prot:12.0, fat:1.9,  phos:142, pot:294, carb:0,    ca:32,  na:101, fe:1.00, zn:0.39, vitA:11,   vitD:1.4,  vitE:0.53, vitC:0,    b1:0.06,  b2:0.06,  b3:2.10,  b6:0.24,  b9:7,   b12:1.7,  fiber:0   },
  { id:'salmon',    label:'Salmón cocido',            group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:206, prot:20.0, fat:13.0, phos:260, pot:384, carb:0,    ca:15,  na:75,  fe:0.50, zn:0.40, vitA:17,   vitD:11.0, vitE:1.35, vitC:3.7,  b1:0.28,  b2:0.16,  b3:8.00,  b6:0.65,  b9:29,  b12:2.8,  fiber:0   },
  { id:'salmon_crudo',    label:'Salmón crudo',       group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:208, prot:20.4, fat:13.4, phos:240, pot:363, carb:0,    ca:9,   na:59,  fe:0.34, zn:0.36, vitA:12,   vitD:11.0, vitE:3.55, vitC:3.9,  b1:0.21,  b2:0.16,  b3:8.70,  b6:0.64,  b9:26,  b12:3.2,  fiber:0   },
  { id:'pollo',     label:'Pechuga de pollo cocida',  group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:155, prot:31.0, fat:3.6,  phos:220, pot:256, carb:0,    ca:15,  na:74,  fe:1.04, zn:1.00, vitA:9,    vitD:0.1,  vitE:0.27, vitC:0,    b1:0.07,  b2:0.11,  b3:13.70, b6:0.60,  b9:4,   b12:0.34, fiber:0   },
  { id:'pollo_crudo',     label:'Pechuga de pollo cruda', group:'prot', val:0, max:150, step:1, isOil:false, kcal:120, prot:22.5, fat:2.6,  phos:213, pot:334, carb:0,    ca:5,   na:45,  fe:0.37, zn:0.68, vitA:6,    vitD:0.1,  vitE:0.56, vitC:0,    b1:0.07,  b2:0.09,  b3:10.90, b6:0.53,  b9:4,   b12:0.21, fiber:0   },
  { id:'pavo',      label:'Pechuga de pavo cocida',   group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:135, prot:30.0, fat:1.0,  phos:210, pot:250, carb:0,    ca:12,  na:55,  fe:1.40, zn:1.70, vitA:5,    vitD:0.1,  vitE:0.10, vitC:0,    b1:0.04,  b2:0.13,  b3:11.80, b6:0.81,  b9:6,   b12:1.60, fiber:0   },
  { id:'pavo_crudo',      label:'Pechuga de pavo cruda',  group:'prot', val:0, max:150, step:1, isOil:false, kcal:114, prot:23.7, fat:1.5,  phos:201, pot:293, carb:0,    ca:11,  na:63,  fe:0.86, zn:1.31, vitA:3,    vitD:0.1,  vitE:0.06, vitC:0,    b1:0.04,  b2:0.12,  b3:9.90,  b6:0.71,  b9:7,   b12:1.29, fiber:0   },
  { id:'higado',    label:'Hígado de pollo cocido',   group:'prot', val:0,  max:60,  step:1,    isOil:false, kcal:165, prot:25,   fat:6.5,  phos:300, pot:263, carb:0.7,  ca:11,  na:71,  fe:11.6, zn:4.30, vitA:3300, vitD:0.3,  vitE:0.70, vitC:27.9, b1:0.29,  b2:1.99,  b3:11.00, b6:0.76,  b9:578, b12:16.6, fiber:0   },
  { id:'higado_crudo',    label:'Hígado de pollo crudo',  group:'prot', val:0, max:60,  step:1,  isOil:false, kcal:119, prot:16.9, fat:4.8,  phos:297, pot:230, carb:0.7,  ca:8,   na:71,  fe:8.99, zn:2.67, vitA:3296, vitD:0.2,  vitE:0.70, vitC:17.9, b1:0.30,  b2:1.78,  b3:9.70,  b6:0.85,  b9:588, b12:16.6, fiber:0   },
  { id:'cerdo',     label:'Magro de cerdo cocido',    group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:143, prot:26.0, fat:4.0,  phos:220, pot:370, carb:0,    ca:12,  na:62,  fe:1.10, zn:2.90, vitA:2,    vitD:0.3,  vitE:0.25, vitC:0,    b1:0.66,  b2:0.30,  b3:8.00,  b6:0.61,  b9:5,   b12:0.70, fiber:0   },
  { id:'cerdo_crudo',     label:'Magro de cerdo crudo',   group:'prot', val:0, max:150, step:1, isOil:false, kcal:120, prot:20.7, fat:3.5,  phos:247, pot:393, carb:0,    ca:5,   na:52,  fe:0.98, zn:1.88, vitA:0,    vitD:0.3,  vitE:0.22, vitC:0,    b1:0.90,  b2:0.24,  b3:6.70,  b6:0.72,  b9:5,   b12:0.51, fiber:0   },
  { id:'ternera',   label:'Ternera cocida',           group:'prot', val:0,  max:120, step:1,    isOil:false, kcal:158, prot:27.0, fat:5.2,  phos:210, pot:330, carb:0,    ca:10,  na:55,  fe:2.50, zn:4.30, vitA:0,    vitD:0.1,  vitE:0.20, vitC:0,    b1:0.07,  b2:0.24,  b3:5.60,  b6:0.54,  b9:9,   b12:2.10, fiber:0   },
  { id:'ternera_cruda',   label:'Ternera cruda',      group:'prot', val:0,  max:150, step:1,    isOil:false, kcal:128, prot:21.5, fat:4.5,  phos:200, pot:340, carb:0,    ca:7,   na:58,  fe:2.10, zn:3.60, vitA:0,    vitD:0.1,  vitE:0.20, vitC:0,    b1:0.06,  b2:0.18,  b3:4.80,  b6:0.60,  b9:6,   b12:2.00, fiber:0   },
  { id:'clara',     label:'Clara de huevo',           group:'prot', val:0,  max:150, step:1,    isOil:false, kcal:52,  prot:10.9, fat:0.2,  phos:15,  pot:163, carb:0.7,  ca:7,   na:166, fe:0.08, zn:0.03, vitA:0,    vitD:0,    vitE:0,    vitC:0,    b1:0.004, b2:0.439, b3:0.11,  b6:0.005, b9:4,   b12:0.09, fiber:0   },
  { id:'yema',      label:'Yema de huevo',            group:'fat',  val:0,  max:20,  step:1,    isOil:false, kcal:322, prot:15.9, fat:26.5, phos:443, pot:102, carb:3.6,  ca:129, na:48,  fe:2.73, zn:2.30, vitA:381,  vitD:5.4,  vitE:2.58, vitC:0,    b1:0.176, b2:0.528, b3:0.02,  b6:0.35,  b9:146, b12:2.0,  fiber:0   },
  { id:'aceite',    label:'Aceite oliva (ml)',        group:'fat',  val:0,  max:20,  step:0.25, isOil:true,  kcal:884, prot:0,    fat:100,  phos:0,   pot:1,   carb:0,    ca:1,   na:2,   fe:0.56, zn:0,    vitA:0,    vitD:0,    vitE:14.35,vitC:0,    b1:0,     b2:0,     b3:0,     b6:0,     b9:0,   b12:0,    fiber:0   },
  { id:'aceite_coco', label:'Aceite de coco (ml)',    group:'fat',  val:0,  max:20,  step:0.25, isOil:true,  kcal:892, prot:0,    fat:100,  phos:0,   pot:0,   carb:0,    ca:0,   na:0,   fe:0,    zn:0,    vitA:0,    vitD:0,    vitE:0.11, vitC:0,    b1:0,     b2:0,     b3:0,     b6:0,     b9:0,   b12:0,    fiber:0   },
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

// Holgura sobre el máximo teórico: sin ella el tope del slider queda demasiado
// ajustado y no permite compensar cuando el resto de ingredientes van bajos.
const MAX_HEADROOM = 1.3

export function getIngredientMax(ing: Ingredient, targetKcal: number): number {
  const range = KCAL_RANGES.find(r => targetKcal < r.upTo) ?? KCAL_RANGES[KCAL_RANGES.length - 1]
  const raw = ing.max * range.factor * MAX_HEADROOM
  return Math.max(ing.step, Math.round(raw / ing.step) * ing.step)
}

export type Values = Record<string, number>

// Fracción de fósforo y potasio retenida tras el hervido: parte se pierde por lixiviación
// al agua de cocción que se descarta (~30% de pérdida). Se aplica de forma uniforme a todos
// los ingredientes; un refinamiento futuro sería limitarlo a los realmente hervidos.
export const BOILING_RETENTION = 0.7

export function calcNutrition(values: Values, ingredients: Ingredient[] = INGREDIENTS) {
  let kcal = 0, prot = 0, fat = 0, carb = 0, phos = 0, pot = 0
  let ca = 0, na = 0, fe = 0, zn = 0, vitA = 0, vitD = 0, vitE = 0, fiber = 0
  let vitC = 0, b1 = 0, b2 = 0, b3 = 0, b6 = 0, b9 = 0, b12 = 0
  for (const ing of ingredients) {
    const g = values[ing.id] ?? 0
    kcal  += (g / 100) * ing.kcal
    prot  += (g / 100) * ing.prot
    fat   += (g / 100) * ing.fat
    carb  += (g / 100) * (ing.carb || 0)
    phos  += (g / 100) * ing.phos * BOILING_RETENTION
    pot   += (g / 100) * ing.pot  * BOILING_RETENTION
    ca    += (g / 100) * ing.ca
    na    += (g / 100) * ing.na
    fe    += (g / 100) * ing.fe
    zn    += (g / 100) * ing.zn
    vitA  += (g / 100) * ing.vitA
    vitD  += (g / 100) * ing.vitD
    vitE  += (g / 100) * ing.vitE
    vitC  += (g / 100) * (ing.vitC || 0)
    b1    += (g / 100) * (ing.b1 || 0)
    b2    += (g / 100) * (ing.b2 || 0)
    b3    += (g / 100) * (ing.b3 || 0)
    b6    += (g / 100) * (ing.b6 || 0)
    b9    += (g / 100) * (ing.b9 || 0)
    b12   += (g / 100) * ing.b12
    fiber += (g / 100) * ing.fiber
  }
  return { kcal, prot, fat, carb, phos, pot, ca, na, fe, zn, vitA, vitD, vitE, vitC, b1, b2, b3, b6, b9, b12, fiber }
}

export type NutritionResult = ReturnType<typeof calcNutrition>
