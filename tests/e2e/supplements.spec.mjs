import { test, expect } from '@playwright/test'
import { INGREDIENTS } from '../../src/data/ingredients.ts'

const ids = INGREDIENTS.filter(i => i.group === 'suplementos').map(i => i.id)

async function seed(page, values = {}) {
  await page.goto('./')
  await page.evaluate(({ ids, values }) => {
    localStorage.clear()
    localStorage.setItem('foodCalculator.kcalTarget', '210')
    localStorage.setItem('foodCalculator.pathologies', '["renal"]')
    localStorage.setItem('foodCalculator.selectedIngredients', JSON.stringify(['arroz', ...ids]))
    localStorage.setItem('foodCalculator.values', JSON.stringify({ arroz: 100, ...values }))
  }, { ids, values })
  await page.goto('./#/calculadora')
}

const input = (page, label) => page.getByRole('textbox', { name: `Cantidad de ${label}`, exact: true }).filter({ visible: true })

test('supplements accept fractions with their own units and survive reload and recipe save', async ({ page }) => {
  await seed(page)
  for (const [label, quantity] of [
    ['V-Integra Renal', '0.5'], ['Adiva B+Biotic Small', '0.5'],
    ['Adiva Gastric Small', '1'], ['Nutratop Gastro Plus', '1.5'],
    ['Condrovet Force HA · perros', '0.5'], ['Prolivet Small', '0.5'],
  ]) await input(page, label).fill(quantity)

  // Known values stay visible, flagged as incomplete; nothing is reported as OK.
  await expect(page.getByText(/^Faltan 74\.2 kcal para llegar a 210 · incompleto: faltan datos de energía de V-Integra Renal, /)).toBeVisible()
  await expect(page.getByText('✓ Calorías en objetivo', { exact: false })).toHaveCount(0)
  await expect(page.getByText(/^Fósforo \d+ mg\/100kcal — incompleto: faltan datos de /)).toBeVisible()
  await expect(page.getByText(/^Incompleto: no incluye el peso de Nutratop Gastro Plus, Condrovet Force HA · perros y Prolivet Small/)).toBeVisible()
  await expect(page.getByText('No disponible', { exact: false })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

  await page.reload()
  await expect(input(page, 'Adiva B+Biotic Small')).toHaveValue('0.5')
  await expect(input(page, 'Nutratop Gastro Plus')).toHaveValue('1.5')
  await page.getByRole('button', { name: '☆ Guardar receta', exact: true }).click()
  await page.getByPlaceholder('Título de la receta').fill('Dieta con suplementos')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  const recipe = await page.evaluate(() => JSON.parse(localStorage.getItem('foodCalculator.recipes'))[0])
  expect(recipe.values.nutratop_gastro_plus).toBe(1.5)
  expect(recipe.values.condrovet_force_ha).toBe(0.5)
  expect(recipe.values.prolivet).toBe(0.5)
  await page.goto(`./#/recetas/${recipe.id}`)
  await expect(page.getByText('1,5 ml', { exact: true })).toBeVisible()
  await expect(page.getByText('0,5 comprimidos', { exact: true })).toHaveCount(2)
})

test('modal shows verified bases, unknown calories and real zero phosphorus', async ({ page }) => {
  await seed(page)
  await page.getByRole('button', { name: 'Condrovet Force HA · perros', exact: true }).filter({ visible: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('por 1 comprimido', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Energía', { exact: true }).locator('..')).toContainText('No declarado')
  await expect(dialog.getByText('Vitamina E', { exact: true }).locator('..')).toContainText('20.00')
  await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.getByRole('button', { name: 'V-Integra Renal', exact: true }).filter({ visible: true }).click()
  await expect(dialog.getByText('por 100 g', { exact: true })).toBeVisible()
  // The value and its unit are separate elements: «0» + «mg».
  await expect(dialog.getByText('Fósforo', { exact: true }).locator('..')).toContainText(/^Fósforo\s*0\s*mg$/)
  await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click()
})

test('supplement group can be removed and restored without losing stored amounts', async ({ page }) => {
  await seed(page, { adiva_gastric_small: 0.5 })
  await page.getByRole('button', { name: /^editar ingredientes/ }).click()
  await page.getByRole('button', { name: /^Suplementos 9 de 9/ }).click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Suplementos 9 de 9/ })).toBeVisible()
  await page.getByRole('button', { name: /^Suplementos 9 de 9/ }).click()
  await page.getByRole('button', { name: 'desmarcar todo', exact: true }).click()
  await page.getByRole('button', { name: 'Guardar y volver a grupos', exact: true }).click()
  await page.getByRole('button', { name: 'Volver a la calculadora', exact: true }).click()
  await expect(page.getByText('incompleto', { exact: false })).toHaveCount(0)
  await page.getByRole('button', { name: /^editar ingredientes/ }).click()
  await page.getByRole('button', { name: /^Suplementos 0 de 9/ }).click()
  await page.getByRole('checkbox', { name: /^Adiva Gastric Small/ }).check()
  await page.getByRole('button', { name: 'Guardar y volver a grupos', exact: true }).click()
  await page.getByRole('button', { name: 'Volver a la calculadora', exact: true }).click()
  await expect(input(page, 'Adiva Gastric Small')).toHaveValue('0.5')
})


test('typing decimal separators sequentially does not change 0.5 into 5', async ({ page }) => {
  await seed(page)
  const dose = input(page, 'Prolivet Small')
  for (const typed of ['0.5', '0,5']) {
    await dose.fill('')
    await dose.pressSequentially(typed)
    await expect(dose).toHaveValue(typed)
    await dose.blur()
    await expect(dose).toHaveValue('0.5')
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('foodCalculator.values')).prolivet)).toBe(0.5)
  }
})
