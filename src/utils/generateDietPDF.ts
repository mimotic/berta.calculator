import { jsPDF } from 'jspdf'
import logoUrl from '../assets/berta_logo.png'
import type { Values, NutritionResult } from '../data/ingredients'
import { INGREDIENT_GROUPS, ingredientGrams, formatIngredientQuantity, hasPartialNutrition, PARTIAL_NUTRITION_NOTE, type Ingredient } from '../data/ingredients'
import type { PathologyId, NutrientKey } from '../data/pathologies'
import {
  PATHOLOGY_DEFS,
  NUTRIENT_META,
  computeActiveRules,
  getNormalizedValue,
  displayUnit,
} from '../data/pathologies'
import { macroDistribution } from './macroDistribution'

const NUTRIENT_ORDER: NutrientKey[] = ['phosphorus', 'potassium', 'sodium', 'protein', 'fat', 'fiber']

const BRAND = '#1a1a18'
const MUTED = '#6b6b67'
const GREEN = '#1D9E75'
const ORANGE = '#EF9F27'
const RED = '#E24B4A'
const TRACK = '#e5e2dc'

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

// Traza un arco con curvas de Bézier (una por tramo de ≤90°). 0° queda arriba
// y el sentido es horario, igual que el donut de la calculadora.
function strokeArc(doc: jsPDF, cx: number, cy: number, radius: number, fromDeg: number, toDeg: number) {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const chunks = Math.max(1, Math.ceil((toDeg - fromDeg) / 90))
  const sweep = (toRad(toDeg) - toRad(fromDeg)) / chunks
  const k = (4 / 3) * Math.tan(sweep / 4) * radius
  const curves: number[][] = []
  for (let i = 0; i < chunks; i++) {
    const a0 = toRad(fromDeg) + i * sweep
    const a1 = a0 + sweep
    const x0 = Math.cos(a0) * radius, y0 = Math.sin(a0) * radius
    const x3 = Math.cos(a1) * radius, y3 = Math.sin(a1) * radius
    curves.push([
      -k * Math.sin(a0), k * Math.cos(a0),
      x3 + k * Math.sin(a1) - x0, y3 - k * Math.cos(a1) - y0,
      x3 - x0, y3 - y0,
    ])
  }
  const start = toRad(fromDeg)
  doc.lines(curves, cx + Math.cos(start) * radius, cy + Math.sin(start) * radius, [1, 1], 'S')
}

// Donut de distribución de macros (% kcal) con su leyenda a la derecha. Ocupa
// 20 mm de alto, lo mismo que las dos filas de la rejilla de macros.
// (x, y) es la esquina superior izquierda; right, el borde derecho de la leyenda.
function drawMacroDonut(doc: jsPDF, r: NutritionResult, x: number, y: number, right: number) {
  const macros = macroDistribution(r)
  const radius = 8.8
  const cx = x + 10.2
  const cy = y + 10.2

  doc.setLineCap('butt')
  doc.setLineWidth(2.8)
  doc.setDrawColor(...hexToRgb(TRACK))
  doc.circle(cx, cy, radius, 'S')
  let fromDeg = 0
  for (const m of macros) {
    const toDeg = fromDeg + (m.pct / 100) * 360
    if (m.pct > 0) {
      doc.setDrawColor(...hexToRgb(m.color))
      strokeArc(doc, cx, cy, radius, fromDeg, toDeg)
    }
    fromDeg = toDeg
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.5)
  setColor(doc, MUTED)
  doc.text('macros', cx, cy - 0.3, { align: 'center' })
  doc.text('% kcal', cx, cy + 2.1, { align: 'center' })

  const legendX = x + 25
  macros.forEach((m, i) => {
    const ly = cy - 6 + i * 7
    doc.setFillColor(...hexToRgb(m.color))
    doc.circle(legendX + 1, ly - 1, 1, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setColor(doc, BRAND)
    doc.text(m.name, legendX + 3.5, ly)
    doc.setFont('helvetica', 'bold')
    doc.text(`${m.pct.toFixed(1)}%`, right, ly, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    setColor(doc, MUTED)
    doc.text(`ref. adulto sano ${m.range}`, legendX + 3.5, ly + 2.8)
  })
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
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const top = 18
  let y = top

  // Pasa a una página nueva si los próximos h mm no caben en la actual.
  const ensureSpace = (h: number) => {
    if (y + h <= pageH - 5) return
    doc.addPage()
    y = top
  }

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


  for (const { label, group } of INGREDIENT_GROUPS) {
    const items = activeIngredients.filter(i => i.group === group && (values[i.id] ?? 0) > 0)
    if (items.length === 0) continue

    // La etiqueta del grupo no se separa de su primer ingrediente.
    ensureSpace(9)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setColor(doc, BRAND)
    doc.text(label, margin, y)
    y += 4

    for (const ing of items) {
      const g = values[ing.id] ?? 0
      ensureSpace(5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      setColor(doc, BRAND)
      doc.text(`${ing.label}`, margin + 3, y)
      doc.setFont('helvetica', 'bold')
      doc.text(formatIngredientQuantity(ing, g), pageW - margin, y, { align: 'right' })
      y += 5
    }
    y += 1
  }

  drawHRule(doc, y)
  y += 7

  if (hasPartialNutrition(activeIngredients, values)) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setColor(doc, MUTED)
    const lines = doc.splitTextToSize(PARTIAL_NUTRITION_NOTE, pageW - margin * 2)
    ensureSpace(lines.length * 4)
    doc.text(lines, margin, y)
    y += lines.length * 4 + 5
  }

  // ── Macros (dos tercios del ancho) + distribución (último tercio) ──────────
  const colW = (pageW - margin * 2) / 3
  const macroColW = (colW * 2) / 3
  const chartX = margin + colW * 2

  ensureSpace(29)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('ENERGÍA Y MACROS', margin, y)
  doc.text('DISTRIBUCIÓN MACROS', chartX, y)
  y += 5

  drawMacroDonut(doc, r, chartX, y, pageW - margin)

  const diffK = r.kcal - target
  const kcalColor = Math.abs(diffK) <= 8 ? GREEN : diffK < 0 ? ORANGE : RED
  const totalG = activeIngredients.reduce((s, i) => s + ingredientGrams(i, values[i.id] ?? 0), 0)

  const macros = [
    { label: 'kcal', value: r.kcal.toFixed(1), color: kcalColor },
    { label: 'proteína g', value: r.prot.toFixed(1), color: BRAND },
    { label: 'grasa g', value: r.fat.toFixed(2), color: BRAND },
    { label: 'hidratos g', value: r.carb.toFixed(1), color: BRAND },
    { label: 'fibra g', value: r.fiber.toFixed(1), color: BRAND },
    { label: 'peso total g', value: totalG.toFixed(0), color: BRAND },
  ]

  macros.forEach((m, i) => {
    const cx = margin + (i % 3) * macroColW
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
      const inWarnZone = rule.warn !== undefined
        ? normalized >= rule.warn
        : rule.max !== undefined && normalized > rule.max * 0.85
      let color = GREEN
      if (rule.max !== undefined && normalized > rule.max) color = RED
      else if (inWarnZone) color = ORANGE
      else if (rule.min !== undefined && normalized < rule.min) color = ORANGE
      const barLabel = rule.min !== undefined && rule.max !== undefined
        ? `${rule.min}–${rule.max}${dUnit}`
        : rule.warn !== undefined && rule.max !== undefined
        ? `${rule.warn}–${rule.max}${dUnit}`
        : rule.max !== undefined ? `límite ${rule.max}${dUnit}` : `mín ${rule.min}${dUnit}`
      return { label: `${meta.label} ${dUnit}`, value: `${dispVal}`, range: barLabel, color }
    })

  if (nutrientRows.length > 0) {
    ensureSpace(5 + Math.ceil(nutrientRows.length / 3) * 10 + 4)
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
    { label: 'Vitamina C',   value: r.vitC.toFixed(1),  unit: 'mg' },
    { label: 'Tiamina (B1)', value: r.b1.toFixed(2),    unit: 'mg' },
    { label: 'Riboflavina (B2)', value: r.b2.toFixed(2), unit: 'mg' },
    { label: 'Niacina (B3)', value: r.b3.toFixed(1),    unit: 'mg' },
    { label: 'Vitamina B6',  value: r.b6.toFixed(2),    unit: 'mg' },
    { label: 'Folato (B9)',  value: r.b9.toFixed(0),    unit: 'µg' },
    { label: 'Vitamina B12', value: r.b12.toFixed(2),   unit: 'µg' },
    { label: 'Fibra',        value: r.fiber.toFixed(1), unit: 'g'  },
  ]

  const microCols = 4
  const microColW = (pageW - margin * 2) / microCols

  // Reserva también el pie, para que no quede solo en la página siguiente.
  ensureSpace(5 + Math.ceil(micros.length / microCols) * 9 + 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, MUTED)
  doc.text('MICRONUTRIENTES', margin, y)
  y += 5

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
