import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, calcNutrition, ingredientGrams, ingredientUnit, hasPartialNutrition } from '../src/data/ingredients.ts'

const breadId = 'pan_etiqueta_394'
const bread = INGREDIENTS.find(ingredient => ingredient.id === breadId)
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)

test('photographed bread is a separate carbohydrate ingredient measured in grams', () => {
  assert.ok(bread)
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
  // Unknown bread minerals must not be populated from a different bread.
  closeTo(result.phos, 35)
  closeTo(result.pot, 35)
})

test('unreported bread nutrients stay explicitly unknown and trigger the partial calculation notice', () => {
  assert.deepEqual(bread.declaredNutrients, ['kcal', 'prot', 'fat', 'carb', 'fiber', 'na'])
  for (const nutrient of ['phos', 'pot', 'ca', 'fe', 'zn', 'vitA', 'vitD', 'vitE', 'vitC', 'b1', 'b2', 'b3', 'b6', 'b9', 'b12']) {
    assert.equal(bread.declaredNutrients.includes(nutrient), false)
    assert.equal(bread[nutrient], 0)
  }
  assert.equal(hasPartialNutrition(INGREDIENTS, { [breadId]: 1 }), true)
  assert.equal(hasPartialNutrition(INGREDIENTS, { [breadId]: 0, arroz: 100 }), false)
})

test('bread note preserves label details outside the calculator nutrient fields', () => {
  assert.match(bread.nutritionNote, /por 100 g/)
  assert.match(bread.nutritionNote, /1665 kJ \/ 394 kcal/)
  assert.match(bread.nutritionNote, /saturadas 0,5 g/)
  assert.match(bread.nutritionNote, /azúcares 3,0 g/)
  assert.match(bread.nutritionNote, /sal 0,02 g/)
  assert.match(bread.nutritionNote, /no se conoce el peso de cada rebanada/)
})
