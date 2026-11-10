import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, calcNutrition, ingredientGrams, ingredientUnit, hasPartialNutrition, isNutrientKnown, isNutrientEstimated } from '../src/data/ingredients.ts'

const breadId = 'pan_etiqueta_394'
const bread = INGREDIENTS.find(ingredient => ingredient.id === breadId)
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)

test('photographed bread is a separate carbohydrate ingredient measured in grams', () => {
  assert.ok(bread)
  assert.equal(bread.label, 'Pan Recondo')
  assert.equal(INGREDIENTS.filter(ingredient => ingredient.id === breadId).length, 1)
  assert.equal(bread.group, 'hc')
  assert.equal(bread.isOil, false)
  assert.equal(bread.isRaw, undefined)
  assert.equal(bread.portion, undefined)
  assert.equal(ingredientUnit(bread, 30), 'g')
  assert.equal(ingredientGrams(bread, 30), 30)
  assert.equal(INGREDIENTS.find(ingredient => ingredient.id === 'pan_sin_sal').kcal, 272)
  assert.equal(INGREDIENTS.find(ingredient => ingredient.id === 'pan_azimo').kcal, 360)
})

test('bread values match the label per 100 g, with salt converted to sodium', () => {
  const result = calcNutrition({ [breadId]: 100 })
  for (const [nutrient, expected] of Object.entries({ kcal: 394, prot: 15, fat: 3.9, carb: 72, fiber: 5.2, na: 8 })) {
    closeTo(result[nutrient], expected)
  }
  closeTo(result.na, 0.02 / 2.5 * 1000)
  closeTo(result.kcalProt + result.kcalCarb + result.kcalFat, 394)
})

test('bread nutrition scales by the entered weight and combines with other ingredients', () => {
  const result = calcNutrition({ [breadId]: 25, arroz: 100 })
  for (const [nutrient, expected] of Object.entries({ kcal: 228.5, prot: 6.45, fat: 1.275, carb: 46.2, fiber: 1.7, na: 3 })) {
    closeTo(result[nutrient], expected)
  }
  // Estimated bread minerals (CIQUAL 7310 adjusted for added gluten), not boiled.
  closeTo(result.phos, 35 + 0.25 * 118)
  closeTo(result.pot, 35 + 0.25 * 181)
  assert.equal(result.missingNutrients.includes('phos'), false)
})

test('undeclared bread minerals are reference estimates; vitamins stay unknown', () => {
  assert.deepEqual(bread.declaredNutrients, ['kcal', 'prot', 'fat', 'carb', 'fiber', 'na'])
  assert.deepEqual(bread.estimatedNutrients, ['phos', 'pot', 'ca', 'fe', 'zn'])
  // CIQUAL 2025 7310 (P 110, K 186, Ca 25.1, Fe 1.4, Zn 0.94 mg; protein 11.6 g) mixed with
  // vital wheat gluten (USDA 168147: protein 75.16 g; P 260, K 100, Ca 142, Fe 5.2, Zn 0.85 mg)
  // up to the label's 15 g of protein.
  const gluten = (15 - 11.6) / (75.16 - 11.6)
  const mix = (biscotte, glutenValue) => biscotte * (1 - gluten) + glutenValue * gluten
  for (const [nutrient, expected, decimals] of [['phos', mix(110, 260), 0], ['pot', mix(186, 100), 0], ['ca', mix(25.1, 142), 0], ['fe', mix(1.4, 5.2), 1], ['zn', mix(0.94, 0.85), 2]]) {
    assert.equal(bread[nutrient], +expected.toFixed(decimals), nutrient)
    assert.equal(isNutrientKnown(bread, nutrient), true)
    assert.equal(isNutrientEstimated(bread, nutrient), true)
  }
  assert.equal(isNutrientEstimated(bread, 'na'), false)
  for (const nutrient of ['vitA', 'vitD', 'vitE', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12']) {
    assert.equal(isNutrientKnown(bread, nutrient), false)
    assert.equal(bread[nutrient], 0)
  }
  assert.equal(hasPartialNutrition(INGREDIENTS, { [breadId]: 1 }), true)
  assert.equal(hasPartialNutrition(INGREDIENTS, { [breadId]: 0, arroz: 100 }), false)
})

test('bread note names the product and explains the mineral estimates', () => {
  assert.match(bread.sourceUrl, /briochepasquier\.es\/productos\/recondo\/.*pan-tostado-sin-sal/)
  assert.match(bread.nutritionNote, /Pan tostado sin sal añadida/)
  assert.match(bread.nutritionNote, /CIQUAL 2025 \(código 7310/)
  assert.match(bread.nutritionNote, /gluten/)
})

test('bread note preserves label details outside the calculator nutrient fields', () => {
  assert.match(bread.nutritionNote, /por 100 g/)
  assert.match(bread.nutritionNote, /1665 kJ \/ 394 kcal/)
  assert.match(bread.nutritionNote, /saturadas 0,5 g/)
  assert.match(bread.nutritionNote, /azúcares 3,0 g/)
  assert.match(bread.nutritionNote, /sal 0,02 g/)
  assert.match(bread.nutritionNote, /no se conoce el peso de cada rebanada/)
})
