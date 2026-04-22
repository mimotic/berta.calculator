import { jsPDF } from 'jspdf'
import logoUrl from '../assets/berta_logo.png'
import type { Values, NutritionResult } from '../data/ingredients'
import type { Ingredient } from '../data/ingredients'
import type { PathologyId, NutrientKey } from '../data/pathologies'
import {
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
  getNormalizedValue,
  displayUnit,
} from '../data/pathologies'

const NUTRIENT_ORDER: NutrientKey[] = ['phosphorus', 'potassium', 'sodium', 'protein', 'fat', 'fiber']

const BRAND = '#1a1a18'
const MUTED = '#6b6b67'
const GREEN = '#1D9E75'
const ORANGE = '#EF9F27'
const RED = '#E24B4A'

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function setColor(doc: jsPDF, hex: string) {
  doc.setTextColor(...hexToRgb(hex))
}

function drawHRule(doc: jsPDF, y: number, x = 14, w = 182) {
  doc.setDrawColor(220, 218, 214)
  doc.setLineWidth(0.3)
  doc.line(x, y, x + w, y)
}

async function loadImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function generateDietPDF(
  target: number,
  pathologies: PathologyId[],
  activeIngredients: Ingredient[],
  values: Values,
  r: NutritionResult,
) {
  const logoDataUrl = await loadImageAsDataUrl(logoUrl)

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = 18

  // ── Header ─────────────────────────────────────────────────────────────────
  const logoH = 10
  const logoW = 10
  doc.addImage(logoDataUrl, 'PNG', margin, y - logoH + 2, logoW, logoH)

  const textX = margin + logoW + 3
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  setColor(doc, BRAND)
  doc.text('berta.calc', textX, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor(doc, MUTED)
  doc.text('dieta · calculadora canina', textX, y + 6)

  const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(dateStr, pageW - margin, y + 6, { align: 'right' })

  y += 13
  drawHRule(doc, y)
  y += 7

  // ── Objetivo & patologías ──────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('OBJETIVO CALÓRICO', margin, y)
  y += 4

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  setColor(doc, BRAND)
  doc.text(`${target}`, margin, y + 7)
  const targetTextW = doc.getTextWidth(`${target}`)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor(doc, MUTED)
  doc.text('kcal/día', margin + targetTextW + 2, y + 7)

  if (pathologies.length > 0) {
    const chip = pathologies.map(id => PATHOLOGY_DEFS[id].label).join(' · ')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    setColor(doc, MUTED)
    doc.text(`Patología: ${chip}`, pageW - margin, y + 4, { align: 'right' })
  }

  y += 14
  drawHRule(doc, y)
  y += 7

  // ── Ingredientes ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('INGREDIENTES', margin, y)
  y += 5

  const groups: { label: string; group: 'hc' | 'prot' | 'fat' }[] = [
    { label: 'Hidratos', group: 'hc' },
    { label: 'Proteína', group: 'prot' },
    { label: 'Grasa', group: 'fat' },
  ]

  for (const { label, group } of groups) {
    const items = activeIngredients.filter(i => i.group === group && (values[i.id] ?? 0) > 0)
    if (items.length === 0) continue

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setColor(doc, BRAND)
    doc.text(label, margin, y)
    y += 4

    for (const ing of items) {
      const g = values[ing.id] ?? 0
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      setColor(doc, BRAND)
      doc.text(`${ing.label}`, margin + 3, y)
      doc.setFont('helvetica', 'bold')
      doc.text(`${g} g`, pageW - margin, y, { align: 'right' })
      y += 5
    }
    y += 1
  }

  drawHRule(doc, y)
  y += 7

  // ── Macros (2-column) ──────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('ENERGÍA Y MACROS', margin, y)
  y += 5

  const diffK = r.kcal - target
  const kcalColor = Math.abs(diffK) <= 8 ? GREEN : diffK < 0 ? ORANGE : RED
  const totalG = activeIngredients.reduce((s, i) => s + (values[i.id] ?? 0), 0)

  const macros = [
    { label: 'kcal', value: r.kcal.toFixed(1), color: kcalColor },
    { label: 'proteína g', value: r.prot.toFixed(1), color: BRAND },
    { label: 'grasa g', value: r.fat.toFixed(2), color: BRAND },
    { label: 'hidratos g', value: r.carb.toFixed(1), color: BRAND },
    { label: 'fibra g', value: r.fiber.toFixed(1), color: BRAND },
    { label: 'peso total g', value: totalG.toFixed(0), color: BRAND },
  ]

  const colW = (pageW - margin * 2) / 3
  macros.forEach((m, i) => {
    const cx = margin + (i % 3) * colW
    const cy = y + Math.floor(i / 3) * 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    setColor(doc, m.color)
    doc.text(m.value, cx, cy + 5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    setColor(doc, MUTED)
    doc.text(m.label, cx, cy + 9)
  })

  y += Math.ceil(macros.length / 3) * 10 + 4
  drawHRule(doc, y)
  y += 7

  // ── Minerales & parámetros ─────────────────────────────────────────────────
  const activeRules = computeActiveRules(pathologies)
  const actualValues: Record<NutrientKey, number> = {
    fat: r.fat, protein: r.prot, phosphorus: r.phos, potassium: r.pot, sodium: r.na, fiber: r.fiber,
  }

  const nutrientRows = NUTRIENT_ORDER
    .filter(key => activeRules[key])
    .map(key => {
      const rule = activeRules[key]!
      const meta = NUTRIENT_META[key]
      const actual = actualValues[key]
      const normalized = getNormalizedValue(actual, r.kcal, rule.basis, meta.kcalFactor)
      const dUnit = displayUnit(rule.basis, meta.unit)
      const dispVal = rule.basis === 'pct_kcal' || meta.unit === 'g'
        ? normalized.toFixed(1)
        : normalized.toFixed(0)
      let color = GREEN
      if (rule.max !== undefined && normalized > rule.max) color = RED
      else if (rule.max !== undefined && normalized > rule.max * 0.85) color = ORANGE
      else if (rule.min !== undefined && normalized < rule.min) color = ORANGE
      const barLabel = rule.min !== undefined && rule.max !== undefined
        ? `${rule.min}–${rule.max}${dUnit}`
        : rule.max !== undefined ? `límite ${rule.max}${dUnit}` : `mín ${rule.min}${dUnit}`
      return { label: `${meta.label} ${dUnit}`, value: `${dispVal}`, range: barLabel, color }
    })

  if (nutrientRows.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setColor(doc, MUTED)
    doc.text('MINERALES Y PARÁMETROS', margin, y)
    y += 5

    nutrientRows.forEach((row, i) => {
      const cx = margin + (i % 3) * colW
      const cy = y + Math.floor(i / 3) * 10
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      setColor(doc, row.color)
      doc.text(row.value, cx, cy + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      setColor(doc, MUTED)
      doc.text(`${row.label}  (${row.range})`, cx, cy + 9)
    })

    y += Math.ceil(nutrientRows.length / 3) * 10 + 4
    drawHRule(doc, y)
    y += 7
  }

  // ── Micronutrientes ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('MICRONUTRIENTES', margin, y)
  y += 5

  const micros = [
    { label: 'Calcio',       value: r.ca.toFixed(1),    unit: 'mg' },
    { label: 'Fósforo',      value: r.phos.toFixed(1),  unit: 'mg' },
    { label: 'Ratio Ca:P',   value: r.phos > 0 ? `${(r.ca / r.phos).toFixed(2)}:1` : '—', unit: '' },
    { label: 'Sodio',        value: r.na.toFixed(1),    unit: 'mg' },
    { label: 'Potasio',      value: r.pot.toFixed(1),   unit: 'mg' },
    { label: 'Hierro',       value: r.fe.toFixed(2),    unit: 'mg' },
    { label: 'Zinc',         value: r.zn.toFixed(2),    unit: 'mg' },
    { label: 'Vitamina A',   value: r.vitA.toFixed(0),  unit: 'µg' },
    { label: 'Vitamina D',   value: r.vitD.toFixed(2),  unit: 'µg' },
    { label: 'Vitamina E',   value: r.vitE.toFixed(2),  unit: 'mg' },
    { label: 'Vitamina B12', value: r.b12.toFixed(2),   unit: 'µg' },
    { label: 'Fibra',        value: r.fiber.toFixed(1), unit: 'g'  },
  ]

  const microCols = 4
  const microColW = (pageW - margin * 2) / microCols
  micros.forEach((m, i) => {
    const cx = margin + (i % microCols) * microColW
    const cy = y + Math.floor(i / microCols) * 9
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setColor(doc, BRAND)
    doc.text(`${m.value}${m.unit ? ' ' + m.unit : ''}`, cx, cy + 4)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    setColor(doc, MUTED)
    doc.text(m.label, cx, cy + 8)
  })

  y += Math.ceil(micros.length / microCols) * 9 + 6
  drawHRule(doc, y)
  y += 6

  // ── Footer ─────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7)
  setColor(doc, MUTED)
  doc.text('Generado por berta.calc · dieta orientativa, consulta siempre con tu veterinario', margin, y)

  const filename = `berta-dieta-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
