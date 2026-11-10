import { test, expect } from '@playwright/test'

const biscuits = 'Edgard & Cooper · Galletas de manzana y arándanos'

async function seed(page) {
  await page.goto('./')
  await page.evaluate(() => {
    localStorage.clear()
    const data = {
      'foodCalculator.kcalTarget': 210,
      'foodCalculator.pathologies': ['renal'],
      'foodCalculator.selectedIngredients': ['arroz', 'pollo', 'pan_etiqueta_394', 'ec_galletas_manzana_arandanos'],
      'foodCalculator.values': { arroz: 100, pollo: 50, pan_etiqueta_394: 20, ec_galletas_manzana_arandanos: 2 },
    }
    for (const [key, value] of Object.entries(data)) localStorage.setItem(key, JSON.stringify(value))
  })
  await page.goto('./#/calculadora')
}

test('incomplete ingredients show the known values with a warning instead of hiding them', async ({ page }) => {
  await seed(page)
  const note = page.getByRole('note')
  await expect(note).toContainText('Datos incompletos')
  await expect(note).toContainText(`${biscuits}: faltan hidratos, fósforo, potasio, calcio, sodio, hierro, zinc y vitaminas.`)
  await expect(note).toContainText('Pan Recondo: faltan vitaminas.')

  // Renal phosphorus: a number, marked incomplete, naming the ingredient without data.
  await expect(page.getByText(new RegExp(`^Fósforo \\d+ mg/100kcal — .*incompleto: faltan datos de fósforo de ${biscuits}$`))).toBeVisible()
  await expect(page.getByText('No disponible', { exact: false })).toHaveCount(0)
  await expect(page.getByText(/^✓ Fósforo/)).toHaveCount(0)

  // Undeclared biscuit carbs do not hide the macro split or the protein assessment.
  await expect(page.getByText('macros', { exact: true })).toBeVisible()
  await expect(page.getByText(/^Proteína [\d.]+ % ME/)).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('Pan Recondo minerals are marked as estimates in its sheet', async ({ page }) => {
  await seed(page)
  await page.getByRole('button', { name: 'Pan Recondo', exact: true }).filter({ visible: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Fósforo', { exact: true }).locator('..')).toContainText(/≈ 118\s*mg/)
  await expect(dialog.getByText('Sodio', { exact: true }).locator('..')).toContainText(/^Sodio\s*8\s*mg$/)
  await expect(dialog.getByText('Vitamina B12', { exact: true }).locator('..')).toContainText('No declarado')
  await expect(dialog.getByRole('link', { name: 'Ficha de Recondo (Brioche Pasquier)' })).toBeVisible()
})
