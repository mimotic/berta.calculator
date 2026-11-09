import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { INGREDIENTS, INGREDIENT_GROUPS } from '../src/data/ingredients.ts'

// Node's native type stripping does not support TSX. Transpile these components
// in memory for the same dependency-free Node test runner as the nutrition tests.
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
const { IngredientsEditor } = require('../src/components/IngredientsEditor.tsx')

function descendants(element) {
  if (element == null || typeof element !== 'object') return []
  const children = [element.props?.children].flat(Infinity)
  return [element, ...children.flatMap(descendants)]
}

function picker(selected) {
  let next
  const tree = IngredientGroupSelection({ group: 'hc', label: 'Hidratos', selected, onChange: value => { next = value } })
  const elements = descendants(tree)
  return {
    elements,
    result: () => next,
    action: label => elements.find(element => element.type === 'button' && element.props.children === label).props.onClick(),
  }
}

test('editing starts with all group cards and saved selection counts, not sequential steps', () => {
  const markup = renderToStaticMarkup(createElement(IngredientsEditor, {
    selectedIds: ['arroz', 'pan_etiqueta_394', 'manzana'], onSave() {}, onClose() {},
  }))
  for (const { label } of INGREDIENT_GROUPS) assert.ok(markup.includes(label))
  assert.match(markup, /2 de \d+ seleccionados/)
  assert.match(markup, /1 de \d+ seleccionados/)
  assert.match(markup, /0 de \d+ seleccionados/)
  assert.match(markup, /Volver a la calculadora/)
  assert.doesNotMatch(markup, /Siguiente|paso \d|type="checkbox"/)
})

test('group picker renders only its group and marks the saved selections', () => {
  const original = new Set(['arroz', 'manzana'])
  const { elements } = picker(original)
  const checkboxes = elements.filter(element => element.type === 'input')
  assert.equal(checkboxes.length, INGREDIENTS.filter(ingredient => ingredient.group === 'hc').length)
  assert.equal(checkboxes.filter(element => element.props.checked).length, 1)
  const markup = renderToStaticMarkup(createElement(IngredientGroupSelection, {
    group: 'hc', label: 'Hidratos', selected: original, onChange() {},
  }))
  assert.match(markup, /Pan Recondo/)
  assert.doesNotMatch(markup, /Manzana|Pechuga de pollo/)
})

test('select all is scoped to the group and does not mutate saved selections', () => {
  const original = new Set(['arroz', 'manzana', 'pollo'])
  const subject = picker(original)
  subject.action('marcar todo')
  const expected = new Set([...original, ...INGREDIENTS.filter(ingredient => ingredient.group === 'hc').map(ingredient => ingredient.id)])
  assert.deepEqual(subject.result(), expected)
  assert.deepEqual(original, new Set(['arroz', 'manzana', 'pollo']))
})

test('deselect all clears only its group, preserving other groups', () => {
  const original = new Set(['arroz', 'pan_etiqueta_394', 'manzana', 'pollo'])
  const subject = picker(original)
  subject.action('desmarcar todo')
  assert.deepEqual(subject.result(), new Set(['manzana', 'pollo']))
  assert.equal(original.size, 4)
})

test('individual toggles create an isolated draft and preserve other selections', () => {
  const original = new Set(['arroz', 'manzana'])
  const subject = picker(original)
  const checkbox = subject.elements.find(element => element.type === 'input' && element.props.checked)
  checkbox.props.onChange()
  assert.deepEqual(subject.result(), new Set(['manzana']))
  assert.deepEqual(original, new Set(['arroz', 'manzana']))
  const empty = picker(new Set())
  empty.elements.find(element => element.type === 'input').props.onChange()
  assert.equal(empty.result().size, 1)
})
