import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  INGREDIENTS, calcNutrition, ingredientGrams, ingredientUnit, isNutrientEstimated, isNutrientKnown, unknownNutrients,
} from '../src/data/ingredients.ts'
import { PATHOLOGY_DEFS } from '../src/data/pathologies.ts'
import { evaluateRule, incompleteIngredients } from '../src/utils/nutritionAvailability.ts'

const nathId = 'nath_renal'
const nath = INGREDIENTS.find(ingredient => ingredient.id === nathId)
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)

test('Nath renal is a commercial kibble measured in grams', () => {
  assert.ok(nath)
  assert.equal(nath.label, 'Nath · Veterinary Diets Renal')
  assert.equal(INGREDIENTS.filter(ingredient => ingredient.id === nathId).length, 1)
  assert.equal(nath.group, 'pienso')
  assert.equal(nath.isRaw, undefined)
  assert.equal(nath.portion, undefined)
  assert.equal(nath.measure, undefined)
  assert.equal(ingredientUnit(nath, 80), 'g')
  assert.equal(ingredientGrams(nath, 80), 80)
  assert.match(nath.sourceUrl, /nathpetfood\.es\/producto\/nath-veterinary-diets-renal-pienso-para-perros/)
})

test('Nath values match its analytical constituents per 100 g, without boiling losses', () => {
  const result = calcNutrition({ [nathId]: 100 })
  // 3760 kcal/kg; protein 15 %, fat 17 %, crude fibre 2.8 %, Ca 0.6 %, P 0.24 %, K 0.45 %, Na 0.2 %.
  for (const [nutrient, expected] of Object.entries({ kcal: 376, prot: 15, fat: 17, fiber: 2.8, ca: 600, phos: 240, pot: 450, na: 200 })) {
    closeTo(result[nutrient], expected)
  }
  closeTo(result.kcalProt + result.kcalCarb + result.kcalFat, 376)
  assert.deepEqual(result.missingNutrients.filter(key => ['kcal', 'prot', 'fat', 'carb', 'fiber', 'phos', 'pot', 'ca', 'na'].includes(key)), [])
})

test('the printed «Grasa bruta 170%» is read as 17 %, the only value that fits the declared energy', () => {
  // Carbohydrates are not declared: 100 − protein 15 − fat 17 − fibre 2.8 − ash 4.6 − moisture 10.
  const carb = 100 - 15 - 17 - 2.8 - 4.6 - 10
  closeTo(nath.carb, +carb.toFixed(1))
  assert.equal(isNutrientEstimated(nath, 'carb'), true)
  assert.equal(isNutrientKnown(nath, 'carb'), true)
  const modifiedAtwater = fat => (3.5 * 15 + 8.5 * fat + 3.5 * (100 - 15 - fat - 2.8 - 4.6 - 10)) * 10
  assert.ok(Math.abs(modifiedAtwater(17) - 3760) / 3760 < 0.01)
  assert.ok(Math.abs(modifiedAtwater(1.7) - 3760) / 3760 > 0.1)
  assert.match(nath.nutritionNote, /«Grasa bruta 170%», una errata: se usa 17 %/)
})

test('Nath additives are converted per 100 g and flagged as partial contributions', () => {
  const expected = {
    fe: 60 / 10, zn: 130 / 10,
    vitA: 21000 * 0.3 / 10, vitD: 1000 * 0.025 / 10,
    // 3a700 = all-rac-alpha-tocopheryl acetate; Regulation (EU) 2023/341: 1 mg = 1 IU.
    vitE: 1000 * 0.67 / 10,
    vitC: 500 / 10, b1: 10 / 10, b2: 13 / 10, b3: 90 / 10, b6: 6 / 10,
    b9: 2 * 1000 / 10, b12: 0.12 * 1000 / 10,
  }
  for (const [nutrient, value] of Object.entries(expected)) closeTo(nath[nutrient], value)
  assert.deepEqual(unknownNutrients(nath), Object.keys(expected))
})

test('additive-only micronutrients mark totals incomplete but not the renal assessment', () => {
  const values = { [nathId]: 100, arroz: 100 }
  const result = calcNutrition(values)
  assert.deepEqual(result.missingNutrients, ['fe', 'zn', 'vitA', 'vitD', 'vitE', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12'])
  assert.deepEqual(incompleteIngredients(INGREDIENTS, values), [{ label: 'Nath · Veterinary Diets Renal', gaps: 'hierro, zinc y vitaminas' }])
  const phosphorus = evaluateRule(calcNutrition({ [nathId]: 100 }), 'phosphorus', PATHOLOGY_DEFS.renal.rules.phosphorus)
  assert.equal(phosphorus.available, true)
  assert.equal(phosphorus.incomplete, false)
  assert.equal(phosphorus.zone, 'warn') // 240 mg / 376 kcal ≈ 64 mg/100 kcal
})

test("Hill's z/d Mini scales the package analysis to a 50 g portion", () => {
  const kibble = INGREDIENTS.find(ingredient => ingredient.id === 'hills_zd_mini')
  assert.ok(kibble)
  assert.equal(kibble.group, 'pienso')
  assert.equal(ingredientUnit(kibble, 50), 'g')
  assert.equal(isNutrientEstimated(kibble, 'kcal'), true)
  assert.equal(isNutrientEstimated(kibble, 'carb'), true)
  assert.equal(isNutrientEstimated(kibble, 'phos'), false)

  const result = calcNutrition({ [kibble.id]: 50 })
  const expected = {
    kcal: 176.7, prot: 8.95, fat: 6.9, carb: 24, fiber: 3.05,
    ca: 365, phos: 245, pot: 335, na: 120,
    fe: 94.8 / 20, zn: 147 / 20,
    vitA: 18594 * 0.3 / 20, vitD: 735 * 0.025 / 20, vitE: 832 / 20, vitC: 116 / 20,
  }
  for (const [nutrient, value] of Object.entries(expected)) closeTo(result[nutrient], value)
  closeTo(result.kcalProt + result.kcalCarb + result.kcalFat, result.kcal)
  assert.deepEqual(kibble.partialNutrients, ['fe', 'zn'])
  assert.deepEqual(result.missingNutrients, ['fe', 'zn', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12'])
})
