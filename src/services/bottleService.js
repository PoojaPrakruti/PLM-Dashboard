// Service layer — the ONLY place that touches data access.
//
// Every function returns a Promise, even though the current implementation
// reads from mock JSON in memory. This means that swapping to a real
// backend / AI inference API later only requires changing the function
// bodies below (e.g. replacing the mock lookups with fetch() calls to an
// endpoint like `/api/bottles/:id`) — nothing in components/pages needs to
// change since they already treat these as async calls.

import {
  BOTTLES,
  BATCHES,
  PRODUCTS,
  DEFECT_TYPES,
  getBottleById,
  getBatchById,
  getTodayBatch,
  getProductById,
  TODAY_STR,
} from '../mockData/bottles'

const LATENCY = 180 // simulated network latency (ms)

function delay(value, ms = LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Fetch a single bottle by ID. Future: GET /api/bottles/:id */
export function getBottle(bottleId) {
  return delay(getBottleById(bottleId) || null)
}

/** Fetch a batch (and its bottles) by batch ID. Future: GET /api/batches/:id */
export function getBatch(batchId) {
  return delay(getBatchById(batchId) || null)
}

/** Fetch today's batch for a given product. Future: GET /api/products/:id/batches/today */
export function getTodayBatchForProduct(productId) {
  return delay(getTodayBatch(productId) || null)
}

/** All products. Future: GET /api/products */
export function getProducts() {
  return delay(PRODUCTS)
}

export function getProduct(productId) {
  return delay(getProductById(productId) || null)
}

/** Dashboard-level aggregate statistics. Future: GET /api/statistics/today */
export function getStatistics() {
  const todaysBottles = BOTTLES.filter((b) => b.manufacturingDate === TODAY_STR)
  const inspected = todaysBottles.filter((b) => b.status !== 'Inspecting')
  const good = inspected.filter((b) => b.status === 'Passed').length
  const defective = inspected.filter((b) => b.status === 'Failed').length
  const total = todaysBottles.length
  const passPct = inspected.length ? (good / inspected.length) * 100 : 0
  const defectPct = inspected.length ? (defective / inspected.length) * 100 : 0

  const defectCounts = {}
  inspected
    .filter((b) => b.status === 'Failed')
    .forEach((b) => {
      defectCounts[b.defect] = (defectCounts[b.defect] || 0) + 1
    })
  const mostCommonDefect =
    Object.entries(defectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

  const lastInspection = [...inspected].sort((a, b) =>
    a.inspectionTimestamp < b.inspectionTimestamp ? 1 : -1
  )[0]

  return delay({
    totalManufactured: total,
    goodBottles: good,
    defectiveBottles: defective,
    passPercentage: +passPct.toFixed(1),
    defectPercentage: +defectPct.toFixed(1),
    mostCommonDefect,
    lastInspectionTime: lastInspection ? lastInspection.inspectionTimestamp : '—',
  })
}

/** Analytics-page aggregates: charts + summary stats. Future: GET /api/analytics */
export function getAnalytics() {
  const good = BOTTLES.filter((b) => b.status === 'Passed').length
  const defective = BOTTLES.filter((b) => b.status === 'Failed').length

  const defectCounts = {}
  DEFECT_TYPES.forEach((d) => (defectCounts[d] = 0))
  BOTTLES.filter((b) => b.status === 'Failed').forEach((b) => {
    defectCounts[b.defect] = (defectCounts[b.defect] || 0) + 1
  })
  const defectBarData = Object.entries(defectCounts).map(([name, count]) => ({
    name,
    count,
  }))

  // Production trend over the last 7 days (sum across products).
  const dayMap = {}
  BOTTLES.forEach((b) => {
    dayMap[b.manufacturingDate] = dayMap[b.manufacturingDate] || { produced: 0, passed: 0, failed: 0 }
    dayMap[b.manufacturingDate].produced += 1
    if (b.status === 'Passed') dayMap[b.manufacturingDate].passed += 1
    if (b.status === 'Failed') dayMap[b.manufacturingDate].failed += 1
  })
  const trend = Object.entries(dayMap)
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([date, v]) => ({ date: date.slice(5), ...v }))

  const inspected = BOTTLES.filter((b) => b.status !== 'Inspecting')
  const totalInspections = inspected.length
  const rejected = inspected.filter((b) => b.status === 'Failed').length
  const avgConfidence =
    inspected.reduce((sum, b) => sum + (b.confidence || 0), 0) / (inspected.length || 1)

  const defectCountsAll = {}
  inspected
    .filter((b) => b.status === 'Failed')
    .forEach((b) => (defectCountsAll[b.defect] = (defectCountsAll[b.defect] || 0) + 1))
  const mostFrequentDefect =
    Object.entries(defectCountsAll).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

  return delay({
    pieData: [
      { name: 'Good', value: good },
      { name: 'Defective', value: defective },
    ],
    defectBarData,
    trend,
    todaysPassRate: (() => {
      const t = BOTTLES.filter((b) => b.manufacturingDate === TODAY_STR && b.status !== 'Inspecting')
      const p = t.filter((b) => b.status === 'Passed').length
      return t.length ? +((p / t.length) * 100).toFixed(1) : 0
    })(),
    totalInspections,
    rejectedBottles: rejected,
    averageConfidence: +avgConfidence.toFixed(1),
    mostFrequentDefect,
  })
}

/** Search bottles by bottle ID, batch number, or manufacturing date. */
export function searchBottle(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return delay([])
  const results = BOTTLES.filter(
    (b) =>
      b.bottleId.toLowerCase().includes(q) ||
      b.batchId.toLowerCase().includes(q) ||
      b.manufacturingDate.includes(q)
  ).slice(0, 50)
  return delay(results)
}

/** Filter bottles by status / defect / batch / date. */
export function filterBottle(filters = {}) {
  let results = [...BOTTLES]
  if (filters.status) {
    results = results.filter((b) => b.status === filters.status)
  }
  if (filters.defect) {
    results = results.filter((b) => b.defect === filters.defect)
  }
  if (filters.batchId) {
    results = results.filter((b) => b.batchId === filters.batchId)
  }
  if (filters.date) {
    results = results.filter((b) => b.manufacturingDate === filters.date)
  }
  if (filters.productId) {
    results = results.filter((b) => b.productId === filters.productId)
  }
  return delay(results)
}

/**
 * Simulate running an AI inspection on a bottle.
 * Future: POST /api/inspect { bottleId, image } -> AI model response
 * Response shape intentionally mirrors the documented future API contract:
 * { bottle_id, status, defect, confidence, image }
 */
export function runInspection(bottleId) {
  const roll = Math.random()
  const status = roll < 0.82 ? 'Passed' : 'Failed'
  const defect = status === 'Failed' ? DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)] : 'No Defect'
  const confidence =
    status === 'Failed' ? +(90 + Math.random() * 9.8).toFixed(1) : +(95 + Math.random() * 4.9).toFixed(1)

  return delay(
    {
      bottle_id: bottleId,
      status: status.toUpperCase(),
      defect,
      confidence,
      image: 'detected.jpg',
    },
    900
  )
}

/** Fetch the latest inspection result for a bottle (polling-style). Future: GET /api/inspect/:id */
export function fetchInspection(bottleId) {
  return getBottle(bottleId)
}

/** Update a bottle record (e.g. after manual review). Future: PATCH /api/bottles/:id */
export function updateBottle(bottleId, patch) {
  const bottle = getBottleById(bottleId)
  if (bottle) Object.assign(bottle, patch)
  return delay(bottle || null)
}

/** Persist an inspection result. Future: POST /api/inspections */
export function saveInspection(record) {
  return delay({ ...record, saved: true })
}
