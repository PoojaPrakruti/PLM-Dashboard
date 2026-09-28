// Mock bottle inspection database.
// Structured to mirror the shape a future AI inspection API would return,
// so swapping mock data for live API responses requires minimal changes.

export const DEFECT_TYPES = ['Scratch', 'Dent', 'Crack', 'Missing Cap', 'Wrong Label']

export const PRODUCTS = [
  {
    id: 'd1',
    code: 'D1',
    name: 'Design 1',
    capacity: '500 mL',
    color: '#2b5cf5',
  },
  {
    id: 'd2',
    code: 'D2',
    name: 'Design 2',
    capacity: '1 L',
    color: '#00b4d8',
  },
  {
    id: 'd3',
    code: 'D3',
    name: 'Design 3',
    capacity: '2 L',
    color: '#1443a0',
  },
]

// Deterministic PRNG so data stays stable across re-renders within a session.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20260730)

function pad(n, len = 3) {
  return String(n).padStart(len, '0')
}

function fmtDate(d) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1, 2)
  const day = pad(d.getDate(), 2)
  return `${y}-${m}-${day}`
}

function fmtDateCompact(d) {
  return fmtDate(d).replace(/-/g, '')
}

function randomTime() {
  const h = pad(Math.floor(rand() * 14) + 7, 2) // 07:00 - 21:00 shift window
  const m = pad(Math.floor(rand() * 60), 2)
  const s = pad(Math.floor(rand() * 60), 2)
  return `${h}:${m}:${s}`
}

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

const today = new Date()

// Build a batch of bottle records for a given product on a given date.
function buildBatch(product, date, count, opts = {}) {
  const dateCompact = fmtDateCompact(date)
  const batchId = `${product.code}-${dateCompact}`
  const bottles = []

  for (let i = 1; i <= count; i++) {
    const bottleId = `${product.code}-${dateCompact}-${pad(i)}`
    const isToday = opts.isToday
    const forceInspecting = isToday && opts.inspectingCount && i > count - opts.inspectingCount

    let status
    if (forceInspecting) {
      status = 'Inspecting'
    } else {
      // ~82% pass rate
      status = rand() < 0.82 ? 'Passed' : 'Failed'
    }

    let defect = 'No Defect'
    let confidence = 0
    if (status === 'Failed') {
      defect = pick(DEFECT_TYPES)
      confidence = +(90 + rand() * 9.8).toFixed(1)
    } else if (status === 'Passed') {
      confidence = +(95 + rand() * 4.9).toFixed(1)
    } else {
      confidence = null
    }

    bottles.push({
      bottleId,
      batchId,
      productId: product.id,
      design: product.name,
      capacity: product.capacity,
      manufacturingDate: fmtDate(date),
      manufacturingTime: randomTime(),
      inspectionTimestamp: `${fmtDate(date)} ${randomTime()}`,
      status,
      defect,
      confidence,
      image: `${product.id}-bottle.svg`,
      recommendation:
        status === 'Failed'
          ? defectRecommendation(defect)
          : status === 'Passed'
          ? 'No action required. Bottle cleared for packaging.'
          : 'Inspection in progress.',
    })
  }

  return { batchId, productId: product.id, date: fmtDate(date), bottles }
}

function defectRecommendation(defect) {
  switch (defect) {
    case 'Scratch':
      return 'Route to secondary polish station or divert to rework line.'
    case 'Dent':
      return 'Reject unit. Inspect mold pressure on forming station 3.'
    case 'Crack':
      return 'Reject unit immediately. Flag for structural integrity review.'
    case 'Missing Cap':
      return 'Route back to capping station for re-application.'
    case 'Wrong Label':
      return 'Route to relabeling station before packaging.'
    default:
      return 'No action required.'
  }
}

// Generate 7 days of history per product, with today's batch fixed at 10 bottles.
export const BATCHES = []
for (const product of PRODUCTS) {
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(today)
    date.setDate(date.getDate() - dayOffset)
    const isToday = dayOffset === 0
    const count = isToday ? 10 : 14 + Math.floor(rand() * 8) // 14-21 on past days
    const batch = buildBatch(product, date, count, {
      isToday,
      inspectingCount: isToday ? 2 : 0,
    })
    BATCHES.push(batch)
  }
}

// Flatten into a single bottle list (100+ records).
export const BOTTLES = BATCHES.flatMap((b) => b.bottles)

export function getTodayBatch(productId) {
  const dateStr = fmtDate(today)
  return BATCHES.find((b) => b.productId === productId && b.date === dateStr)
}

export function getBatchById(batchId) {
  return BATCHES.find((b) => b.batchId === batchId)
}

export function getBottleById(bottleId) {
  return BOTTLES.find((b) => b.bottleId === bottleId)
}

export function getProductById(productId) {
  return PRODUCTS.find((p) => p.id === productId)
}

export const TODAY_STR = fmtDate(today)
