import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INGREDIENTS, calcNutrition } from '../src/data/ingredients.ts'
import { PATHOLOGY_DEFS } from '../src/data/pathologies.ts'
import {
  NO_DATA, STATUS_COLOR, nutritionText, isIncomplete, weightText, isWeightIncomplete, macroSplitMissing,
  hasCalciumRatio, calciumRatioText, isCalciumRatioIncomplete, evaluateRule, describeMissing,
  incompleteIngredients, kcalColor, listJoin,
} from '../src/utils/nutritionAvailability.ts'

const renal = PATHOLOGY_DEFS.renal.rules
const biscuits = 'ec_galletas_manzana_arandanos'
const biscuitsLabel = INGREDIENTS.find(i => i.id === biscuits).label
const complete = () => calcNutrition({ arroz: 100 })

test('complete food keeps numeric amounts and reassuring assessments', () => {
  const r = complete()
  assert.equal(nutritionText(r, 'kcal'), r.kcal.toFixed(1))
  assert.equal(isIncomplete(r, 'kcal'), false)
  assert.equal(weightText(r, 100), '100')
  assert.deepEqual(macroSplitMissing(r), [])
  const ev = evaluateRule(r, 'phosphorus', renal.phosphorus)
  assert.equal(ev.available, true)
  assert.equal(ev.incomplete, false)
  assert.equal(ev.color, STATUS_COLOR.ok)
})

test('a nutrient nobody declares shows «Sin datos», never zero', () => {
  const r = { ...complete(), kcal: 0, missingNutrients: ['kcal'] }
  assert.equal(nutritionText(r, 'kcal'), NO_DATA)
  assert.equal(isIncomplete(r, 'kcal'), false)
  assert.equal(evaluateRule(r, 'phosphorus', renal.phosphorus).available, false)
  assert.equal(evaluateRule(r, 'phosphorus', { basis: 'per_serving', max: 100 }).available, true)
  assert.equal(weightText({ ...r, unknownWeight: true }, 0), NO_DATA)
})

test('known contributions are shown and marked incomplete instead of hidden', () => {
  const r = { ...complete(), missingNutrients: ['ca', 'phos'], unknownWeight: true }
  assert.equal(nutritionText(r, 'phos'), r.phos.toFixed(1))
  assert.equal(isIncomplete(r, 'phos'), true)
  assert.equal(weightText(r, 100), '100')
  assert.equal(isWeightIncomplete(r, 100), true)
  assert.equal(calciumRatioText(r), `${(r.ca / r.phos).toFixed(2)}:1`)
  assert.equal(isCalciumRatioIncomplete(r), true)
  assert.equal(hasCalciumRatio(r), false) // not comparable between recipes
})

test('incomplete assessments keep the value but never turn green', () => {
  const r = calcNutrition({ [biscuits]: 2, arroz: 100 })
  const ev = evaluateRule(r, 'phosphorus', renal.phosphorus)
  assert.equal(ev.available, true)
  assert.equal(ev.incomplete, true)
  assert.equal(ev.zone, 'ok')
  assert.equal(ev.color, STATUS_COLOR.unknown)
  assert.equal(ev.text, (r.phos / r.kcal * 100).toFixed(0))
  assert.deepEqual(ev.missing, ['phos'])
  assert.equal(describeMissing(r, ev.missing), `faltan datos de fósforo de ${biscuitsLabel}`)
})

test('incomplete data already over a limit or in the warn zone keep red and amber', () => {
  const over = evaluateRule(calcNutrition({ [biscuits]: 2, pollo: 200 }), 'phosphorus', renal.phosphorus)
  assert.equal(over.incomplete, true)
  assert.equal(over.zone, 'over')
  assert.equal(over.color, STATUS_COLOR.danger)
  const warn = evaluateRule(calcNutrition({ [biscuits]: 2, pollo: 80, arroz: 100 }), 'phosphorus', renal.phosphorus)
  assert.equal(warn.zone, 'warn')
  assert.equal(warn.color, STATUS_COLOR.warn)
})

test('undeclared carbohydrates do not break the macro energy split', () => {
  // The biscuits declare kcal, protein and fat; their carbs take the remaining energy.
  const r = calcNutrition({ [biscuits]: 2, arroz: 100 })
  assert.ok(r.missingNutrients.includes('carb'))
  assert.deepEqual(macroSplitMissing(r), [])
  const ev = evaluateRule(r, 'protein', renal.protein)
  assert.equal(ev.available, true)
  assert.equal(ev.incomplete, false)
})

test('unknown supplement energy keeps the known kcal and flags the split as incomplete', () => {
  const r = calcNutrition({ arroz: 100, v_integra_renal: 0.5 })
  assert.equal(nutritionText(r, 'kcal'), '130.0')
  assert.equal(isIncomplete(r, 'kcal'), true)
  assert.deepEqual(macroSplitMissing(r), ['kcal'])
  assert.equal(describeMissing(r, ['kcal']), 'faltan datos de energía de V-Integra Renal')
  assert.equal(kcalColor(r, 130), STATUS_COLOR.unknown) // on target, but not confirmed
  assert.equal(kcalColor(r, 100), STATUS_COLOR.danger)  // already over with the known data
  const ev = evaluateRule(r, 'phosphorus', renal.phosphorus)
  assert.equal(ev.available, true)
  assert.equal(ev.incomplete, true)
})

test('missing data from the same ingredients is described once', () => {
  const r = calcNutrition({ arroz: 100, v_integra_renal: 0.5, nutratop_gastro_plus: 1 })
  assert.equal(
    describeMissing(r, ['kcal', 'prot', 'fat']),
    'faltan datos de energía de V-Integra Renal y Nutratop Gastro Plus; proteína y grasa de Nutratop Gastro Plus',
  )
})

test('the incomplete-data note lists each used ingredient and what it lacks', () => {
  assert.deepEqual(incompleteIngredients(INGREDIENTS, { pan_etiqueta_394: 30, arroz: 100 }), [{ label: 'Pan Recondo', gaps: 'vitaminas' }])
  assert.deepEqual(incompleteIngredients(INGREDIENTS, { nutratop_gastro_plus: 1 }), [{ label: 'Nutratop Gastro Plus', gaps: 'todos los datos nutricionales' }])
  assert.deepEqual(incompleteIngredients(INGREDIENTS, { pan_etiqueta_394: 0, arroz: 100 }), [])
})

test('Spanish list joins', () => {
  assert.equal(listJoin(['energía', 'hidratos']), 'energía e hidratos')
  assert.equal(listJoin(['zinc', 'hierro']), 'zinc y hierro')
  assert.equal(listJoin(['a', 'b', 'c', 'd', 'e'], 3), 'a, b, c y 2 más')
})
