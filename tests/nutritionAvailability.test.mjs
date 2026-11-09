import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calcNutrition } from '../src/data/ingredients.ts'
import { nutritionText, weightText, hasMacroDistribution, hasCalciumRatio, calciumRatioText, canAssess } from '../src/utils/nutritionAvailability.ts'

const complete = () => calcNutrition({ arroz: 100 })

test('complete food keeps numeric amounts and usable assessments', () => {
  const r = complete()
  assert.equal(nutritionText(r, 'kcal'), r.kcal.toFixed(1))
  assert.equal(weightText(r, 100), '100')
  assert.equal(hasMacroDistribution(r), true)
  assert.equal(canAssess(r, 'phosphorus', 'per_100kcal'), true)
})

test('missing energy cannot imply zero calories or a usable normalized assessment', () => {
  const r = { ...complete(), kcal: 0, missingNutrients: ['kcal'] }
  assert.equal(nutritionText(r, 'kcal'), 'No disponible')
  assert.equal(hasMacroDistribution(r), false)
  assert.equal(canAssess(r, 'phosphorus', 'per_100kcal'), false)
  assert.equal(canAssess(r, 'fat', 'pct_kcal'), false)
  assert.equal(canAssess(r, 'phosphorus', 'per_serving'), true)
})

test('known contributions are visibly partial and missing calcium prevents a ratio', () => {
  const r = { ...complete(), missingNutrients: ['ca', 'phos'], unknownWeight: true }
  assert.match(nutritionText(r, 'phos'), /\(parcial\)$/)
  assert.equal(canAssess(r, 'phosphorus', 'per_serving'), false)
  assert.equal(hasCalciumRatio(r), false)
  assert.equal(calciumRatioText(r), 'No disponible')
  assert.equal(weightText(r, 100), '100 (parcial)')
  assert.equal(weightText(r, 0), 'No disponible')
})

test('any unknown macro invalidates the shared macro-energy denominator', () => {
  const r = { ...complete(), missingNutrients: ['carb'] }
  assert.equal(hasMacroDistribution(r), false)
  assert.equal(canAssess(r, 'protein', 'pct_kcal'), false)
  assert.equal(canAssess(r, 'fat', 'pct_kcal'), false)
  assert.equal(canAssess(r, 'fiber', 'per_100kcal'), true)
})

test('bread unreported phosphorus is unavailable alone and partial in a mixed recipe', () => {
  assert.equal(nutritionText(calcNutrition({ pan_etiqueta_394: 25 }), 'phos'), 'No disponible')
  assert.equal(nutritionText(calcNutrition({ pan_etiqueta_394: 25, arroz: 100 }), 'phos'), '35.0 (parcial)')
})
