import type { Ingredient } from './ingredients.ts'

// Verificación de fuentes: 09/11/2026. Valores por 100 g salvo measure explícita.
// 0 en un campo no declarado es solo un valor interno: nunca significa ausencia.
// No se transforman sales minerales en minerales elementales, ni activos en macros.
const UNKNOWN = {
  kcal: 0, prot: 0, fat: 0, carb: 0, fiber: 0,
  phos: 0, pot: 0, ca: 0, na: 0, fe: 0, zn: 0,
  vitA: 0, vitD: 0, vitE: 0, vitC: 0, b1: 0, b2: 0, b3: 0, b6: 0, b9: 0, b12: 0,
}
const BASE = { ...UNKNOWN, group: 'suplementos' as const, val: 0, max: 20, step: 0.1, isOil: false }

export const SUPPLEMENTS: Ingredient[] = [
  {
    ...BASE, id: 'v_integra_renal', label: 'V-Integra Renal',
    prot: 6.9, fat: 2.6, fiber: 0, ca: 15100, phos: 0, na: 1400, pot: 7500,
    vitA: 7500, vitD: 62.5, vitC: 125, b1: 12, b2: 25, b3: 50, b6: 5, b9: 980, b12: 150, fe: 255, zn: 450,
    declaredNutrients: ['prot', 'fat', 'fiber', 'ca', 'phos', 'na', 'pot', 'vitA', 'vitD', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12', 'fe', 'zn'],
    partialNutrients: ['fe', 'zn', 'vitA', 'vitD', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12'],
    sourceUrl: 'https://shop.vetekipp.it/es/p/v-integra-renal/',
    additionalSources: [{ label: 'Contraste de composición (Vetropía)', url: 'https://vetropia.com/producto/v-integra-renal-perros-y-gatos/' }],
    nutritionNote: 'Fórmula estándar en polvo; cantidades en gramos. Valores analíticos por 100 g: cenizas 62,5 g (etiqueta del envase; la web publica otra cifra), humedad 2,3 g y magnesio 1,1 g. Fósforo 0 % expresamente declarado por el fabricante. Energía e hidratos no publicados: no se estiman. No se confunde el extracto de tocoferoles con vitamina E cuantificada. La etiqueta declara vitamina K3 MSB 10 mg/kg y cenizas insolubles en HCl 4,2 %; K3 no es un campo de esta calculadora. Vitaminas y oligoelementos: aportación declarada de aditivos por kg convertida a 100 g; A en µg de retinol (1 UI = 0,3 µg), D3 en µg (1 UI = 0,025 µg). No corresponde a otras variantes V-Integra.',
  },
  {
    ...BASE, id: 'dialix_lespedeza_plus_5', label: 'Dialix Lespedeza Plus 5',
    prot: 28.6, fat: 15.8, fiber: 0.5,
    declaredNutrients: ['prot', 'fat', 'fiber'],
    sourceUrl: 'https://es.vetnova.net/urologia-nefrologia/dialix-lespedeza-plus/',
    nutritionNote: 'Introducir gramos pesados, no número de chews: las fuentes discrepan sobre el peso por unidad. Valores por 100 g: cenizas 13,9 g y humedad 20,8 g. Cada chew declara Lespedeza capitata 100 mg y carbonato cálcico 150 mg; este último no equivale a 150 mg de calcio elemental. Energía, hidratos, fósforo y minerales totales no publicados. No se descuentan fósforo ni potasio por el uso de este producto.',
  },
  {
    ...BASE, id: 'adiva_b_biotic_small', label: 'Adiva B+Biotic Small',
    max: 10, step: 0.25, portion: { singular: 'chew', plural: 'chews', grams: 1 },
    prot: 6.8, fat: 19.7, fiber: 3, b9: 20000, b12: 25000,
    declaredNutrients: ['prot', 'fat', 'fiber', 'b9', 'b12'],
    sourceUrl: 'https://es.vetnova.net/digestivo/adiva-bbiotic/',
    additionalSources: [{ label: 'Presentación de 30 g / 30 chews (VetNova)', url: 'https://www.decathlon.es/es/p/mp/adiva-b-biotic-small/3cdcda1c-3f7f-4855-b6e7-72fc66c030d6/novar' }],
    nutritionNote: 'Variante Small: 1 chew = 1 g (30 g / 30 chews). Proteína, grasa y fibra por 100 g; cenizas 4,5 g/100 g. Por chew: vitamina B12 250 µg y ácido fólico 200 µg, convertidos a la base de 100 g de esta ficha. Humedad, energía, hidratos y minerales no publicados. Los probióticos y otros activos no se convierten en nutrientes.',
  },
  {
    ...BASE, id: 'adiva_gastric_small', label: 'Adiva Gastric Small',
    max: 10, step: 0.25, portion: { singular: 'chew', plural: 'chews', grams: 2 },
    kcal: 289.5, prot: 21.2, fat: 12.5, fiber: 1,
    declaredNutrients: ['kcal', 'prot', 'fat', 'fiber'],
    sourceUrl: 'https://es.vetnova.net/digestivo/adiva-gastric/',
    additionalSources: [{ label: 'Presentación de 60 g / 30 chews', url: 'https://www.decathlon.be/fr/p/mp/adiva-gastric-small/b204aaca-37a3-4f53-82e2-644a6c940fa1/novar' }, { label: 'Contraste de energía por chew (Riovet)', url: 'https://riovet.es/producto/adiva-gastric-razas-pequenas-30-premios/' }],
    nutritionNote: 'Variante Small: 1 chew = 2 g (60 g / 30 chews). Energía 5,79 kcal/chew, confirmada en la etiqueta del envase: 289,5 kcal/100 g. Valores analíticos por 100 g: cenizas 20,4 g y humedad 18 g. Hidratos y minerales totales no publicados. Las cantidades de carbonato cálcico e hidróxido de magnesio no son cantidades de calcio o magnesio elementales. La etiqueta indica consultar al veterinario antes de combinar con otros componentes y evitar el uso oral simultáneo con macrólidos.',
  },
  {
    ...BASE, id: 'nutratop_gastro_plus', label: 'Nutratop Gastro Plus',
    measure: { singular: 'ml', plural: 'ml', nutritionBasis: 1 },
    declaredNutrients: [],
    sourceUrl: 'https://syncftp.samaniegosva.es/fichas/CFP00030.pdf',
    sourceLabel: 'Ficha técnica de Nutratop Gastro Plus',
    nutritionNote: 'Cantidades en ml; densidad no publicada, por lo que no se convierte a gramos. Etiqueta del envase y ficha técnica coincidentes. Por ml: glicina 5 mg, sorbato potásico 1 mg y goma xantana 1 mg. Estas cantidades de ingredientes no equivalen a proteína, potasio elemental o fibra total. No hay energía ni análisis nutricional cuantificado verificable. Se descarta un análisis de tiendas atribuido erróneamente a este producto, que corresponde a Vetgastril.',
  },
  {
    ...BASE, id: 'irc_vet_gel', label: 'IRC Vet Gel',
    measure: { singular: 'ml', plural: 'ml', nutritionBasis: 1 },
    pot: 19, b6: 0.330, b9: 36, b12: 0.190,
    declaredNutrients: ['pot', 'b6', 'b9', 'b12'],
    sourceUrl: 'https://pharmadiet.com/es/productos/ircvet-gel-pienso-complementario-para-el-mantenimiento-del-sistema-renal/',
    sourceLabel: 'Producto actual de Pharmadiet',
    nutritionNote: 'Fórmula con taurina, verificada en la etiqueta del envase. Por ml: potasio 19 mg, B6 330 µg, ácido fólico 36 µg y B12 0,190 µg. Otros activos: taurina 50 mg, EPA 630 µg y DHA 514 µg, que no se suman a macros ni a omega-3 total. Carbonato cálcico 45 mg y acetato cálcico 40 mg no son calcio elemental. Energía, análisis por 100 g y densidad no confirmados para esta fórmula: no se usan datos de las fórmulas antiguas sin taurina. Fósforo y calcio totales desconocidos. Los quelantes no restan fósforo a la dieta calculada.',
  },
  {
    ...BASE, id: 'complivit', label: 'Complivit',
    kcal: 472, prot: 6.34, fat: 35.8, fiber: 4.1,
    vitA: 215000 * 0.3 / 10, vitD: 9615 * 0.025 / 10,
    b2: 3.5, b3: 86.5, b9: 4800, b12: 85, pot: 3.5, ca: 3, zn: 1, fe: 11,
    declaredNutrients: ['kcal', 'prot', 'fat', 'fiber', 'vitA', 'vitD', 'b2', 'b3', 'b9', 'b12', 'pot', 'ca', 'zn', 'fe'],
    partialNutrients: ['vitA', 'vitD', 'b2', 'b3', 'b9', 'b12', 'pot', 'ca', 'zn', 'fe'],
    nutrientNotes: { vitE: '1100 UI/kg: forma química no indicada', b1: 'Tiamina clorhidrato: 450 mg/kg', b6: 'Piridoxina clorhidrato: 400 mg/kg' },
    sourceUrl: 'https://vetplusglobal.com/product/complivit/',
    sourceLabel: 'Ficha de VetPlus',
    additionalSources: [
      { label: 'Análisis y energía (iPet)', url: 'https://ipet.ch/en/vetplus-complivit' },
      { label: 'Contraste de análisis (farmacia Apo24)', url: 'https://www.apo24.fi/Complivit-150-g' },
    ],
    nutritionNote: 'Pasta; cantidades en gramos. Etiqueta italiana del envase contrastada: 4720 kcal/kg = 472 kcal/100 g; proteína 6,34 %, grasa 35,8 %, fibra 4,1 %, cenizas 2,1 %. Aditivos por kg: A 215000 UI (0,3 µg retinol/UI), D3 9615 UI (0,025 µg/UI), riboflavina 35 mg, nicotinamida 865 mg, ácido fólico 48 mg, B12 0,85 mg, potasio 35 mg, calcio 30 mg, zinc 10 mg y hierro 110 mg; convertidos a 100 g. Vitamina E 1100 UI/kg sin forma química visible: no se convierte a mg. Tiamina clorhidrato 450 mg/kg, piridoxina clorhidrato 400 mg/kg y pantotenato cálcico 425 mg/kg se conservan como compuestos declarados, sin equipararlos a vitaminas puras. Fósforo, sodio total, humedad e hidratos no publicados. Los aditivos minerales son aportaciones declaradas, no análisis completo. No se usa la tabla española de 2022, que difiere del envase.'
  },
  {
    ...BASE, id: 'condrovet_force_ha', label: 'Condrovet Force HA · perros',
    max: 10, step: 0.25, measure: { singular: 'comprimido', plural: 'comprimidos', nutritionBasis: 1 },
    vitE: 20, declaredNutrients: ['vitE'],
    sourceUrl: 'https://www.bioiberica.com/es/productos/salud-animal/condrovet-force',
    nutritionNote: 'Variante regular para perros, confirmada en la etiqueta del envase (Collavant n2); no gatos ni razas grandes. Por comprimido: glucosamina HCl 450 mg, condroitín sulfato 330 mg, ácido hialurónico 18 mg, colágeno nativo tipo II 4 mg y vitamina E 20 mg. Solo la vitamina E coincide con un nutriente cuantificado de la calculadora. El envase declara 240 g netos, pero no se ha confirmado el número de comprimidos; no permite calcular g/comprimido. No se deducen macros, energía ni peso del comprimido sumando activos.',
  },
  {
    ...BASE, id: 'prolivet', label: 'Prolivet Small',
    max: 10, step: 0.25, measure: { singular: 'comprimido', plural: 'comprimidos', nutritionBasis: 1 },
    vitE: 21.9, declaredNutrients: ['vitE'],
    sourceUrl: 'https://www.bioiberica.com/es/productos/salud-animal/prolivet',
    nutritionNote: 'Presentación Small (gatos y perros pequeños), fórmula Oxomet. Por comprimido: Oxomet 210 mg, vitamina E 21,9 mg y Siliphos 35 mg. Oxomet no se equipara a SAMe puro ni Siliphos a silibina pura. Se suma solo la vitamina E. No se calcula el peso del comprimido sumando activos. Energía y minerales no publicados; los porcentajes analíticos de fuentes secundarias no se convierten a nutrientes por comprimido sin un peso verificado.',
  },
]
