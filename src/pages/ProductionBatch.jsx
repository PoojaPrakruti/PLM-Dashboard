import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import FilterListIcon from '@mui/icons-material/FilterList'
import BottleCard from '../components/BottleCard'
import { getBatch, getProduct } from '../services/bottleService'
import { DEFECT_TYPES } from '../mockData/bottles'

const STATUS_FILTERS = ['All', 'Passed', 'Failed', 'Inspecting']

export default function ProductionBatch() {
  const { productId, batchId } = useParams()
  const [batch, setBatch] = useState(null)
  const [product, setProduct] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [defectFilter, setDefectFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    getBatch(batchId).then(setBatch)
    getProduct(productId).then(setProduct)
  }, [batchId, productId])

  const filtered = useMemo(() => {
    if (!batch) return []
    return batch.bottles.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false
      if (defectFilter !== 'All' && b.defect !== defectFilter) return false
      return true
    })
  }, [batch, statusFilter, defectFilter])

  if (!batch || !product) {
    return <div className="text-sm text-line-500 dark:text-line-300/60">Loading batch...</div>
  }

  const passed = batch.bottles.filter((b) => b.status === 'Passed').length
  const failed = batch.bottles.filter((b) => b.status === 'Failed').length
  const inspecting = batch.bottles.filter((b) => b.status === 'Inspecting').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-xs text-line-500 dark:text-line-300/60 flex-wrap">
        <Link to="/" className="hover:text-line-700 dark:hover:text-white">Dashboard</Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <Link to="/products" className="hover:text-line-700 dark:hover:text-white">Water Bottle</Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <span className="text-line-800 dark:text-line-100 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white font-mono">
            Batch {batch.batchId}
          </h1>
          <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
            {product.name} · {product.capacity} · {batch.bottles.length} bottles manufactured today
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Stat label="Passed" value={passed} tone="pass" />
          <Stat label="Failed" value={failed} tone="fail" />
          <Stat label="Inspecting" value={inspecting} tone="inspecting" />
        </div>
      </div>

      <div className="glass-panel p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-line-500 dark:text-line-300/60 pr-2">
          <FilterListIcon fontSize="small" />
          <span className="text-xs font-semibold uppercase tracking-wide">Filters</span>
        </div>
        {STATUS_FILTERS.map((s) => (
          <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} label={s} />
        ))}
        <span className="w-px h-5 bg-line-500/15 mx-1" />
        <FilterChip active={defectFilter === 'All'} onClick={() => setDefectFilter('All')} label="All Defects" />
        {DEFECT_TYPES.map((d) => (
          <FilterChip key={d} active={defectFilter === d} onClick={() => setDefectFilter(d)} label={d} />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((b, i) => (
          <BottleCard key={b.bottleId} bottle={b} delay={i * 0.03} onClick={() => navigate(`/bottle/${b.bottleId}`)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-line-500 dark:text-line-300/60 py-10">
            No bottles match the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, tone }) {
  const toneClass = tone === 'pass' ? 'text-pass' : tone === 'fail' ? 'text-fail' : 'text-inspecting'
  return (
    <div className="text-center">
      <div className={`font-display font-bold text-xl ${toneClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-line-500 dark:text-line-300/60">{label}</div>
    </div>
  )
}

function FilterChip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-line-500 text-white shadow-glow'
          : 'bg-line-500/10 text-line-700 dark:text-line-200/80 hover:bg-line-500/20'
      }`}
    >
      {label}
    </button>
  )
}
