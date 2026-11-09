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

test('partial supplements cannot cause a reassuring renal or calorie assessment', () => {
  const r = calcNutrition({ arroz: 100, nutratop_gastro_plus: 1 })
  const assessment = buildNutrientAssessment(r, 130, ['renal'])
  assert.equal(assessment.alerts.some(([type]) => type === 'ok'), false)
  assert.ok(assessment.alerts.some(([, text]) => /Energía parcial/.test(text)))
  assert.ok(assessment.alerts.some(([, text]) => /fósforo: no se puede valorar/.test(text)))
  const html = assessment.mineralCards.map(card => renderToStaticMarkup(card.el)).join('')
  assert.match(html, /No disponible/)
})
