import { test, expect } from '@playwright/test'
import { INGREDIENTS } from '../../src/data/ingredients.ts'

const selectionKey = 'foodCalculator.selectedIngredients'
const valuesKey = 'foodCalculator.values'
const recipesKey = 'foodCalculator.recipes'
const groups = ['Hidratos', 'Verduras', 'Frutas', 'Proteína', 'Grasa', 'Pienso comercial', 'Treats', 'Suplementos']
const initialIds = ['arroz', 'manzana', 'pollo', 'aceite']
const initialValues = { arroz: 40, manzana: 10, pollo: 30, aceite: 2 }

async function seed(page, extra = {}) {
  await page.goto('./')
  await page.evaluate(({ extra, initialIds, initialValues }) => {
    localStorage.clear()
    const data = {
      'foodCalculator.kcalTarget': 210,
      'foodCalculator.pathologies': [],
      'foodCalculator.selectedIngredients': initialIds,
      'foodCalculator.values': initialValues,
      ...extra,
    }
    for (const [key, value] of Object.entries(data)) localStorage.setItem(key, JSON.stringify(value))
  }, { extra, initialIds, initialValues })
  await page.goto('./#/calculadora')
}

async function stored(page, key) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)
}

async function edit(page) {
  await page.getByRole('button', { name: /^editar ingredientes \(/ }).click()
  await expect(page.getByRole('heading', { name: 'Editar ingredientes', exact: true })).toBeVisible()
}

const groupButton = (page, label) => page.getByRole('button', { name: new RegExp(`^${label} \\d+ de \\d+ seleccionados`) })
const ingredient = (page, label) => page.getByRole('checkbox', { name: new RegExp(`^${label} `) })
const save = page => page.getByRole('button', { name: 'Guardar y volver a grupos', exact: true }).click()

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('opens any group directly and saves back to the overview, preserving amounts', async ({ page }) => {
  await seed(page)
  await edit(page)
  for (const label of groups) await expect(groupButton(page, label)).toBeVisible()
  await expect(page.getByRole('button', { name: /Siguiente/ })).toHaveCount(0)
  await noOverflow(page)

  await groupButton(page, 'Frutas').click()
  await expect(page.getByRole('heading', { name: 'Editar frutas' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Editar frutas' })).toBeFocused()
  await expect(ingredient(page, 'Manzana')).toBeChecked()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await save(page)
  await expect(groupButton(page, 'Frutas')).toContainText('0 de')
  await expect(groupButton(page, 'Frutas')).toBeFocused()
  await expect(page.getByRole('status')).toHaveText('Frutas: cambios guardados')
  expect(await stored(page, selectionKey)).toEqual(['arroz', 'pollo', 'aceite'])

  await groupButton(page, 'Hidratos').click()
  await ingredient(page, 'Pan Recondo').check()
  await save(page)
  await expect(groupButton(page, 'Hidratos')).toContainText('2 de')
  expect(await stored(page, selectionKey)).toEqual(['arroz', 'pollo', 'aceite', 'pan_etiqueta_394'])
  await groupButton(page, 'Hidratos').click()
  await expect(ingredient(page, 'Pan Recondo')).toBeChecked()
  await expect(ingredient(page, 'Arroz blanco cocido')).toBeChecked()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()

  await page.getByRole('button', { name: 'Volver a la calculadora', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Calculadora dieta' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pan Recondo', exact: true }).first()).toBeVisible()
  expect(await stored(page, valuesKey)).toEqual(initialValues)
  await page.reload()
  await edit(page)
  await expect(groupButton(page, 'Hidratos')).toContainText('2 de')
  await expect(groupButton(page, 'Frutas')).toContainText('0 de')
})

test('cancel and back discard only the current unsaved group, including after reopening', async ({ page }) => {
  await seed(page)
  await edit(page)
  await groupButton(page, 'Frutas').click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await save(page)
  const saved = await stored(page, selectionKey)

  for (const button of ['Cancelar', '← Volver a grupos']) {
    await groupButton(page, 'Hidratos').click()
    await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
    await page.getByRole('button', { name: button, exact: true }).click()
    await expect(groupButton(page, 'Hidratos')).toContainText('1 de')
    expect(await stored(page, selectionKey)).toEqual(saved)
    await groupButton(page, 'Hidratos').click()
    await expect(ingredient(page, 'Arroz blanco cocido')).toBeChecked()
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  }

  await groupButton(page, 'Proteína').click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Calculadora dieta' })).toBeVisible()
  expect(await stored(page, selectionKey)).toEqual(saved)
  await edit(page)
  await groupButton(page, 'Hidratos').click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Nutrición canina' })).toBeVisible()
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Calculadora dieta' })).toBeVisible()
  expect(await stored(page, selectionKey)).toEqual(saved)
})

test('every group supports empty and full selections without changing other groups', async ({ page }) => {
  await seed(page, { [selectionKey]: [] })
  await edit(page)
  const ids = []
  for (const label of groups) {
    await groupButton(page, label).click()
    await noOverflow(page)
    await page.getByRole('button', { name: 'marcar todo', exact: true }).click()
    for (const checkbox of await page.getByRole('checkbox').all()) await expect(checkbox).toBeChecked()
    await save(page)
    const next = await stored(page, selectionKey)
    for (const id of ids) expect(next).toContain(id)
    expect(next.length).toBeGreaterThan(ids.length)
    ids.splice(0, ids.length, ...next)
  }
  expect(new Set(ids)).toEqual(new Set(INGREDIENTS.map(i => i.id)))
  for (const label of groups) {
    await groupButton(page, label).click()
    await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
    await save(page)
    await expect(groupButton(page, label)).toContainText('0 de')
  }
  expect(await stored(page, selectionKey)).toEqual([])
  await page.getByRole('button', { name: 'Volver a la calculadora', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Calculadora dieta' })).toBeVisible()
  await edit(page)
  await expect(groupButton(page, 'Treats')).toContainText('0 de')
})

test('editing a saved recipe leaves the current diet and recipe unchanged until recipe save', async ({ page }) => {
  const recipe = { id: 'recipe-test', title: 'Receta de prueba', createdAt: '2026-11-09T00:00:00Z', kcalTarget: 300, pathologies: [], values: { arroz: 60, pollo: 50 } }
  await seed(page, { [recipesKey]: [recipe] })
  await page.goto('./#/calculadora?receta=recipe-test')
  // A new route entry mounts the recipe calculator from the saved recipe.
  await page.reload()
  await expect(page.getByText('✎ Editando receta «Receta de prueba»')).toBeVisible()
  await edit(page)
  await groupButton(page, 'Hidratos').click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await save(page)
  await expect(groupButton(page, 'Hidratos')).toContainText('0 de')
  expect(await stored(page, selectionKey)).toEqual(initialIds)
  expect(await stored(page, valuesKey)).toEqual(initialValues)
  expect(await stored(page, recipesKey)).toEqual([recipe])
  await page.getByRole('button', { name: 'Volver a la calculadora', exact: true }).click()
  await page.getByRole('button', { name: '✓ Guardar cambios', exact: true }).click()
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  expect((await stored(page, recipesKey))[0].values).toEqual({ pollo: 50 })
  expect(await stored(page, selectionKey)).toEqual(initialIds)
  expect(await stored(page, valuesKey)).toEqual(initialValues)
})

test('first-time setup retains its sequential wizard and selections on Back', async ({ page }) => {
  await page.goto('./#/calculadora')
  await expect(page.getByText('paso 1 · objetivo')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar →', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Patologías' })).toBeVisible()
  await page.getByRole('button', { name: /Continuar/ }).click()
  await expect(page.getByText('paso 1 · hidratos')).toBeVisible()
  await ingredient(page, 'Pan Recondo').check()
  await page.getByRole('button', { name: 'Siguiente →', exact: true }).click()
  await page.getByRole('button', { name: '← Atrás', exact: true }).click()
  await expect(ingredient(page, 'Pan Recondo')).toBeChecked()
  for (let i = 0; i < groups.length; i++) {
    await expect(page.getByText(`paso ${i + 1} · ${groups[i].toLowerCase()}`)).toBeVisible()
    await page.getByRole('button', { name: i === groups.length - 1 ? 'Guardar' : 'Siguiente →', exact: true }).click()
  }
  await expect(page.getByRole('heading', { name: 'Calculadora dieta' })).toBeVisible()
  expect(await stored(page, selectionKey)).toEqual(['pan_etiqueta_394'])
  await edit(page)
  for (const label of groups) await expect(groupButton(page, label)).toBeVisible()
})
