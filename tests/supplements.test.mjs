import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, INGREDIENT_GROUPS, NUTRITION_KEYS, calcNutrition, ingredientGrams, ingredientUnit, ingredientNutritionFactor, nutritionBasisLabel, getIngredientMax, formatIngredientQuantity, isNutrientKnown } from '../src/data/ingredients.ts'
import { saveRecipe, getRecipe } from '../src/data/recipes.ts'

const supplements = INGREDIENTS.filter(i => i.group === 'suplementos')
const byId = id => supplements.find(i => i.id === id)
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`)

test('the new supplement group contains nine distinct products with explicit data provenance', () => {
  assert.equal(INGREDIENT_GROUPS.at(-1).label, 'Suplementos')
  assert.equal(supplements.length, 9)
  assert.equal(new Set(INGREDIENTS.map(i => i.id)).size, INGREDIENTS.length)
  for (const item of supplements) {
    assert.ok(Array.isArray(item.declaredNutrients), item.id)
    assert.ok(item.nutritionNote, item.id)
    assert.equal(item.val, 0)
    assert.equal(getIngredientMax(item, 100), getIngredientMax(item, 3000))
    for (const key of NUTRITION_KEYS) assert.ok(Number.isFinite(item[key]), `${item.id}.${key}`)
    // Control bounds are independent of calorie target and never dosing advice.
    assert.equal(item.isRaw, undefined)
    assert.equal(item.isOil, false)
  }
})

test('powder grams scale published minerals and preserve explicit zero phosphorus', () => {
  const item = byId('v_integra_renal')
  assert.equal(ingredientUnit(item, 1), 'g')
  const r = calcNutrition({ [item.id]: 0.5 })
  closeTo(r.ca, 75.5)
  closeTo(r.pot, 37.5)
  closeTo(r.na, 7)
  closeTo(r.prot, 0.0345)
  closeTo(r.phos, 0)
  assert.equal(isNutrientKnown(item, 'phos'), true)
  assert.equal(r.missingNutrients.includes('phos'), false)
  assert.equal(r.missingNutrients.includes('kcal'), true)
})

test('Adiva Small products use verified chew weights including fractional quantities', () => {
  const b = byId('adiva_b_biotic_small')
  const g = byId('adiva_gastric_small')
  closeTo(ingredientGrams(b, 0.5), 0.5)
  closeTo(ingredientGrams(g, 0.5), 1)
  const r = calcNutrition({ [b.id]: 0.5, [g.id]: 1 })
  closeTo(r.b12, 125)
  closeTo(r.b9, 100)
  closeTo(r.kcal, 5.79)
  closeTo(r.prot, 0.034 + 0.424)
  closeTo(r.fat, 0.0985 + 0.25)
  assert.ok(r.missingNutrients.includes('kcal')) // B+Biotic energy is not known.
  assert.equal(r.unknownWeight, false)
  assert.equal(formatIngredientQuantity(b, 0.5), '0,5 chews')
})

test('unknown density is not assumed to be 1 g/ml or confused with an oil', () => {
  const item = byId('nutratop_gastro_plus')
  assert.equal(ingredientUnit(item, 2), 'ml')
  assert.equal(nutritionBasisLabel(item), 'por 1 ml')
  assert.equal(ingredientNutritionFactor(item, 2), 2)
  assert.equal(ingredientGrams(item, 2), 0)
  const r = calcNutrition({ [item.id]: 2, arroz: 100 })
  assert.equal(r.unknownWeight, true)
  closeTo(r.kcal, 130)
  closeTo(r.pot, 35) // Potassium sorbate is not total elemental potassium.
  assert.ok(r.missingNutrients.includes('kcal'))
  assert.ok(r.missingNutrients.includes('pot'))
})

test('per-tablet vitamins scale without inventing a tablet mass or calories', () => {
  const item = byId('condrovet_force_ha')
  assert.equal(nutritionBasisLabel(item), 'por 1 comprimido')
  const r = calcNutrition({ [item.id]: 0.5 })
  closeTo(r.vitE, 10)
  assert.equal(r.unknownWeight, true)
  assert.equal(r.missingNutrients.includes('vitE'), false)
  assert.equal(r.missingNutrients.includes('kcal'), true)
  assert.equal(ingredientGrams(item, 1), 0)
})

test('unverified formulations remain unknown and never reduce dietary phosphorus', () => {
  const item = byId('irc_vet_gel')
  const r = calcNutrition({ [item.id]: 2, dialix_lespedeza_plus_5: 1, arroz: 100 })
  closeTo(r.phos, 35)
  closeTo(r.ca, 10)
  assert.ok(r.missingNutrients.includes('phos'))
  assert.ok(r.missingNutrients.includes('ca'))
  assert.equal(isNutrientKnown(item, 'kcal'), false)
  const empty = calcNutrition(Object.fromEntries(supplements.map(i => [i.id, 0])))
  assert.deepEqual(empty.missingNutrients, [])
  assert.equal(empty.unknownWeight, false)
})

test('recipes persist gram, chew, ml and tablet amounts without losing fractions', () => {
  const storage = new Map()
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } })
  try {
    const values = { v_integra_renal: 0.5, adiva_b_biotic_small: 0.5, adiva_gastric_small: 1, nutratop_gastro_plus: 1.5, condrovet_force_ha: 0.5 }
    const saved = saveRecipe({ title: 'Suplementos', kcalTarget: 210, pathologies: ['renal'], values })
    assert.deepEqual(getRecipe(saved.id).values, values)
    assert.deepEqual(calcNutrition(getRecipe(saved.id).values), calcNutrition(values))
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})

test('IRC current taurine formula uses only nutrients confirmed per ml on its label', () => {
  const r = calcNutrition({ irc_vet_gel: 1.5 })
  closeTo(r.pot, 28.5)
  closeTo(r.b6, 0.495)
  closeTo(r.b9, 54)
  closeTo(r.b12, 0.285)
  for (const nutrient of ['kcal', 'prot', 'fat', 'carb', 'fiber', 'ca', 'phos']) assert.ok(r.missingNutrients.includes(nutrient))
})

test('Complivit follows the actual per-kg Italian label and does not reuse old micronutrients', () => {
  const c = byId('complivit')
  const r = calcNutrition({ complivit: 5 })
  closeTo(r.kcal, 23.6)
  closeTo(r.prot, 0.317)
  closeTo(r.fat, 1.79)
  closeTo(r.vitA, 322.5)
  closeTo(r.vitD, 1.201875)
  closeTo(r.b2, 0.175)
  closeTo(r.b3, 4.325)
  closeTo(r.b9, 240)
  closeTo(r.b12, 4.25)
  closeTo(r.pot, 0.175)
  closeTo(r.ca, 0.15)
  closeTo(r.fe, 0.55)
  closeTo(r.zn, 0.05)
  for (const nutrient of ['vitE', 'b1', 'b6']) assert.equal(isNutrientKnown(c, nutrient), false)
  for (const nutrient of ['ca', 'pot', 'zn', 'fe']) assert.ok(r.missingNutrients.includes(nutrient)) // Added amounts are not total mineral analyses.
  assert.equal(r.missingNutrients.includes('kcal'), false)
})

test('Prolivet Small uses its own vitamin E content rather than larger tablet variants', () => {
  const r = calcNutrition({ prolivet: 0.5 })
  closeTo(r.vitE, 10.95)
  assert.equal(byId('prolivet').label, 'Prolivet Small')
  assert.ok(r.missingNutrients.includes('kcal'))
  assert.equal(r.unknownWeight, true)
})
