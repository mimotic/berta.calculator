import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, calcNutrition, ingredientGrams, ingredientUnit, formatIngredientQuantity, getIngredientMax, hasPartialNutrition } from '../src/data/ingredients.ts'
import { saveRecipe, getRecipe, updateRecipe } from '../src/data/recipes.ts'

const bitesId = 'ec_bocaditos_manzana_arandanos'
const biscuitsId = 'ec_galletas_manzana_arandanos'
// Fixed catalog weights per unit: 0.9 g per bite, 2.9 g per biscuit.
const ingredients = INGREDIENTS
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`)

test('unit quantities convert to grams before every nutritional calculation', () => {
  const values = { [bitesId]: 10, [biscuitsId]: 2, arroz: 100 }
  const r = calcNutrition(values, ingredients)
  closeTo(r.kcal, 174.254)
  closeTo(r.prot, 3.6416)
  closeTo(r.fat, 0.944)
  closeTo(r.fiber, 1.08)
  closeTo(r.carb, 33.942)
  closeTo(ingredients.reduce((sum, ing) => sum + ingredientGrams(ing, values[ing.id] ?? 0), 0), 114.8)
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

test('every unit-based ingredient has a fixed positive weight per unit', () => {
  const unitBased = INGREDIENTS.filter(i => i.portion)
  assert.deepEqual(unitBased.map(i => i.id), [bitesId, biscuitsId])
  for (const ing of unitBased) {
    assert.ok(Number.isFinite(ing.portion.grams) && ing.portion.grams > 0, `${ing.id}: ${ing.portion.grams}`)
  }
  closeTo(ingredientGrams(INGREDIENTS.find(i => i.id === bitesId), 10), 9)
  closeTo(ingredientGrams(INGREDIENTS.find(i => i.id === biscuitsId), 2), 5.8)
})

test('saved recipes keep their unit quantities and legacy recipes still load', () => {
  const storage = new Map()
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  } })
  try {
    const base = { title: 'Test', kcalTarget: 210, pathologies: [] }
    const old = saveRecipe({ ...base, values: { arroz: 100 } })
    const saved = saveRecipe({ ...base, values: { [bitesId]: 2, [biscuitsId]: 1 } })
    const other = saveRecipe({ ...base, values: saved.values })
    updateRecipe(other.id, { values: { [bitesId]: 5, [biscuitsId]: 3 } })
    const reloaded = getRecipe(saved.id)
    assert.deepEqual(reloaded.values, saved.values)
    closeTo(calcNutrition(reloaded.values).kcal, 14.9234)
    closeTo(calcNutrition(getRecipe(old.id).values).kcal, 130)
    // Recipes saved while unit weights were configurable carry a stale
    // unitWeights field; it is ignored and the catalog weight applies.
    const stale = { ...saved, id: 'stale', unitWeights: { [bitesId]: 1.25, [biscuitsId]: 3 } }
    storage.set('foodCalculator.recipes', JSON.stringify([stale, ...JSON.parse(storage.get('foodCalculator.recipes'))]))
    closeTo(calcNutrition(getRecipe('stale').values).kcal, 14.9234)
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})
