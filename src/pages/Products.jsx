import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import BottleGraphic from '../components/BottleGraphic'
import { PRODUCTS } from '../mockData/bottles'
import { getTodayBatchForProduct } from '../services/bottleService'

export default function Products() {
  const [batches, setBatches] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    PRODUCTS.forEach((p) => {
      getTodayBatchForProduct(p.id).then((batch) =>
        setBatches((prev) => ({ ...prev, [p.id]: batch }))
      )
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-xs text-line-500 dark:text-line-300/60">
        <Link to="/" className="hover:text-line-700 dark:hover:text-white">Dashboard</Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <span className="text-line-800 dark:text-line-100 font-medium">Water Bottle</span>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white">Water Bottle — Designs</h1>
        <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
          Select a design to open its live production batch.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PRODUCTS.map((p, i) => {
          const batch = batches[p.id]
          const bottles = batch?.bottles || []
          const inspected = bottles.filter((b) => b.status !== 'Inspecting')
          const passed = inspected.filter((b) => b.status === 'Passed').length
          const rejected = inspected.filter((b) => b.status === 'Failed').length
          const passRate = inspected.length ? ((passed / inspected.length) * 100).toFixed(1) : '—'

          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => batch && navigate(`/products/${p.id}/batch/${batch.batchId}`)}
              className="focus-ring group glass-panel p-6 text-left flex flex-col gap-4 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <BottleGraphic design={p.name} capacity={p.capacity} status="Passed" size={90} />
                  <div>
                    <div className="font-display font-bold text-line-900 dark:text-white">{p.name}</div>
                    <div className="text-xs font-mono text-line-500 dark:text-line-300/60 mt-1">{p.capacity}</div>
                  </div>
                </div>
                <ChevronRightIcon className="text-line-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line-500/10">
                <Metric label="Produced Today" value={bottles.length || '—'} />
                <Metric label="Passed" value={passed} tone="pass" />
                <Metric label="Rejected" value={rejected} tone="fail" />
                <Metric label="Pass Rate" value={passRate !== '—' ? `${passRate}%` : '—'} tone="teal" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function Metric({ label, value, tone }) {
  const toneClass =
    tone === 'pass' ? 'text-pass' : tone === 'fail' ? 'text-fail' : tone === 'teal' ? 'text-teal-500' : 'text-line-900 dark:text-white'
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-line-500 dark:text-line-300/60 font-semibold">
        {label}
      </div>
      <div className={`font-display font-bold text-lg ${toneClass}`}>{value}</div>
    </div>
  )
}
