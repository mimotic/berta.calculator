import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { INGREDIENTS, calcNutrition } from '../src/data/ingredients.ts'

const require = createRequire(import.meta.url)
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2023 },
      fileName: filename,
    })
    module._compile(outputText, filename)
  }
}
const { IngredientGroupSelection } = require('../src/components/IngredientGroupSelection.tsx')
const { IngredientModal } = require('../src/components/IngredientModal.tsx')
const { SliderGroup } = require('../src/components/SliderGroup.tsx')
const { buildNutrientAssessment } = require('../src/utils/nutrientAssessment.tsx')
const markup = (component, props) => renderToStaticMarkup(createElement(component, props))
const item = id => INGREDIENTS.find(i => i.id === id)

// SSR checks complement browser coverage; they do not replace interaction/layout tests.
test('supplement selection shows all nine products and distinguishes unknown energy', () => {
  const html = markup(IngredientGroupSelection, { group: 'suplementos', label: 'Suplementos', selected: new Set(), onChange() {} })
  assert.equal((html.match(/type="checkbox"/g) ?? []).length, 9)
  assert.match(html, /Prolivet Small/)
  assert.match(html, /Energía no declarada/)
  assert.doesNotMatch(html, /[> ]0 kcal/)
  assert.match(html, /no son una recomendación de dosis/)
})

test('unit-based ingredient modal labels a tablet basis rather than 100 g', () => {
  const html = markup(IngredientModal, { ingredient: item('condrovet_force_ha'), onClose() {} })
  assert.match(html, /por 1 comprimido/)
  assert.match(html, /20.00/)
  assert.match(html, /No declarado/)
  assert.doesNotMatch(html, /por 100 g/)
})

test('Complivit keeps IU and salt compounds visible without false vitamin conversions', () => {
  const html = markup(IngredientModal, { ingredient: item('complivit'), onClose() {} })
  assert.match(html, /1100 UI\/kg/)
  assert.match(html, /Sin convertir/)
  assert.match(html, /Tiamina clorhidrato: 450 mg\/kg/)
  assert.match(html, /Aporte de aditivos; total desconocido/)
})

test('controls render decimal grams, ml and fractional tablets with unknown kcal', () => {
  const html = markup(SliderGroup, { group: 'suplementos', label: 'Suplementos', values: { prolivet: 0.5, nutratop_gastro_plus: 1.5 }, onChange() {}, targetKcal: 210 })
  assert.match(html, /Cantidad de Prolivet Small/)
  assert.match(html, /value="0.5"/)
  assert.match(html, /value="1.5"/)
  assert.match(html, /inputMode="decimal"/)
  assert.match(html, /comprimidos/)
  assert.match(html, /kcal n\/d/)
})

test('partial supplements show the known values with a warning, never a reassuring assessment', () => {
  const r = calcNutrition({ arroz: 100, nutratop_gastro_plus: 1 })
  const assessment = buildNutrientAssessment(r, 130, ['renal'])
  assert.equal(assessment.alerts.some(([type]) => type === 'ok'), false)
  assert.ok(assessment.alerts.some(([type, text]) => type === 'warn' && text === 'Calorías en objetivo con los datos conocidos (130.0 kcal) · incompleto: faltan datos de energía de Nutratop Gastro Plus'))
  // Rice alone: 35 mg phosphorus in 130 kcal → 27 mg/100 kcal, shown but not confirmed.
  assert.ok(assessment.alerts.some(([type, text]) => type === 'warn' && /^Fósforo 27 mg\/100kcal — incompleto: faltan datos de fósforo y energía de Nutratop Gastro Plus$/.test(text)))
  const html = assessment.mineralCards.map(card => renderToStaticMarkup(card.el)).join('')
  assert.match(html, />27</)
  assert.match(html, /incompleto/)
  assert.doesNotMatch(html, /No disponible|Sin datos/)
})

test('only supplements without data: no invented values', () => {
  const assessment = buildNutrientAssessment(calcNutrition({ nutratop_gastro_plus: 1 }), 130, ['renal'])
  assert.equal(assessment.alerts.some(([type]) => type === 'ok'), false)
  assert.ok(assessment.alerts.some(([, text]) => text === 'Energía: sin datos (Nutratop Gastro Plus)'))
  assert.ok(assessment.alerts.some(([, text]) => text === 'Fósforo: sin datos (Nutratop Gastro Plus)'))
  const html = assessment.mineralCards.map(card => renderToStaticMarkup(card.el)).join('')
  assert.match(html, /Sin datos/)
})

test('incomplete data already over the limit still raise the danger alert', () => {
  const r = calcNutrition({ pollo: 200, nutratop_gastro_plus: 1 })
  const assessment = buildNutrientAssessment(r, 300, ['renal'])
  assert.ok(assessment.alerts.some(([type, text]) => type === 'danger' && /^Fósforo \d+ mg\/100kcal — supera el límite de 100mg\/100kcal · incompleto: /.test(text)))
})
