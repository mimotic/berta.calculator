import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, calcNutrition, ingredientGrams, ingredientUnit, formatIngredientQuantity, withUnitWeights, getIngredientMax, hasPartialNutrition } from '../src/data/ingredients.ts'
import { saveRecipe, getRecipe, updateRecipe } from '../src/data/recipes.ts'

const bitesId = 'ec_bocaditos_manzana_arandanos'
const biscuitsId = 'ec_galletas_manzana_arandanos'
// Arbitrary test weights; these are not manufacturer specifications.
const unitWeights = { [bitesId]: 1.25, [biscuitsId]: 3 }
const ingredients = withUnitWeights(INGREDIENTS, unitWeights)
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)

test('unit quantities convert to grams before every nutritional calculation', () => {
  const values = { [bitesId]: 10, [biscuitsId]: 2, arroz: 100 }
  const r = calcNutrition(values, ingredients)
  closeTo(r.kcal, 184.29)
  closeTo(r.prot, 3.8495)
  closeTo(r.fat, 1.03)
  closeTo(r.fiber, 1.2725)
  closeTo(r.carb, 36.175)
  closeTo(ingredients.reduce((sum, ing) => sum + ingredientGrams(ing, values[ing.id] ?? 0), 0), 118.5)
})

test('existing grams, oil quantities and boiling retention keep their behavior', () => {
  const r = calcNutrition({ arroz: 100, aceite: 2, pollo_crudo: 50 })
  closeTo(r.kcal, 207.68)
  closeTo(r.phos, 35 + 213 * 0.5 * 0.7)
  closeTo(r.pot, 35 + 0.02 + 334 * 0.5 * 0.7)
  assert.equal(ingredientUnit(INGREDIENTS.find(i => i.id === 'aceite'), 2), 'ml')
})

test('unit labels, bounds and unreported nutrient flags distinguish treats', () => {
  const bites = ingredients.find(i => i.id === bitesId)
  const biscuits = ingredients.find(i => i.id === biscuitsId)
  assert.equal(formatIngredientQuantity(bites, 1), '1 premio')
  assert.equal(formatIngredientQuantity(bites, 2), '2 premios')
  assert.equal(formatIngredientQuantity(biscuits, 1), '1 galleta')
  assert.equal(formatIngredientQuantity(biscuits, 2), '2 galletas')
  assert.equal(getIngredientMax(bites, 100), getIngredientMax(bites, 3000))
  assert.equal(hasPartialNutrition(ingredients, { [bitesId]: 1 }), true)
  assert.equal(hasPartialNutrition(ingredients, { [bitesId]: 0, arroz: 50 }), false)
  assert.equal(biscuits.declaredNutrients.includes('phos'), false)
  assert.equal(biscuits.declaredNutrients.includes('carb'), false)
})

test('unit weights require positive finite numbers and do not mutate the catalog', () => {
  for (const grams of [0, -1, NaN, Infinity, '2']) {
    assert.equal(withUnitWeights(INGREDIENTS, { [bitesId]: grams }).find(i => i.id === bitesId).portion.grams, undefined)
  }
  assert.equal(INGREDIENTS.find(i => i.id === bitesId).portion.grams, undefined)
  assert.equal(ingredients.find(i => i.id === bitesId).portion.grams, 1.25)
})

test('saved recipes retain their own unit weights and legacy recipes still load', () => {
  const storage = new Map()
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } })
  try {
    const base = { title: 'Test', kcalTarget: 210, pathologies: [] }
    const old = saveRecipe({ ...base, values: { arroz: 100 } })
    const saved = saveRecipe({ ...base, values: { [bitesId]: 2, [biscuitsId]: 1 }, unitWeights })
    const other = saveRecipe({ ...base, values: saved.values, unitWeights: { [bitesId]: 2, [biscuitsId]: 4 } })
    updateRecipe(other.id, { unitWeights: { [bitesId]: 3, [biscuitsId]: 5 } })
    const reloaded = getRecipe(saved.id)
    assert.deepEqual(reloaded.unitWeights, unitWeights)
    assert.deepEqual(reloaded.values, saved.values)
    closeTo(calcNutrition(reloaded.values, withUnitWeights(INGREDIENTS, reloaded.unitWeights)).kcal, 17.14)
    const legacy = getRecipe(old.id)
    closeTo(calcNutrition(legacy.values, withUnitWeights(INGREDIENTS, legacy.unitWeights)).kcal, 130)
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})
