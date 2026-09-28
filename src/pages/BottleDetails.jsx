import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import BottleGraphic from '../components/BottleGraphic'
import StatusBadge from '../components/StatusBadge'
import { getBottle, getBatch } from '../services/bottleService'
import { formatConfidence } from '../utils/helpers'

export default function BottleDetails() {
  const { bottleId } = useParams()
  const [bottle, setBottle] = useState(null)
  const [siblings, setSiblings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    getBottle(bottleId).then((b) => {
      if (!active || !b) return
      setBottle(b)
      getBatch(b.batchId).then((batch) => active && setSiblings(batch.bottles.map((x) => x.bottleId)))
    })
    return () => {
      active = false
    }
  }, [bottleId])

  if (!bottle) {
    return <div className="text-sm text-line-500 dark:text-line-300/60">Loading bottle record...</div>
  }

  const idx = siblings.indexOf(bottleId)
  const prevId = idx > 0 ? siblings[idx - 1] : null
  const nextId = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-xs text-line-500 dark:text-line-300/60 flex-wrap">
        <Link to="/" className="hover:text-line-700 dark:hover:text-white">Dashboard</Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <Link to="/products" className="hover:text-line-700 dark:hover:text-white">Water Bottle</Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <Link to={`/products/${bottle.productId}/batch/${bottle.batchId}`} className="hover:text-line-700 dark:hover:text-white font-mono">
          {bottle.batchId}
        </Link>
        <NavigateNextIcon style={{ fontSize: 14 }} />
        <span className="text-line-800 dark:text-line-100 font-medium font-mono">{bottle.bottleId}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white font-mono">{bottle.bottleId}</h1>
          <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">Full inspection record</p>
        </div>
        <div className="flex items-center gap-2">
          <NavButton disabled={!prevId} onClick={() => navigate(`/bottle/${prevId}`)} dir="prev" />
          <NavButton disabled={!nextId} onClick={() => navigate(`/bottle/${nextId}`)} dir="next" />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5 width-[200px]">

        {/* Bottle graphic + details */}
        <motion.div
          key={bottle.bottleId + '-details'}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 glass-panel p-6 space-y-5"
        >
          <div className="flex items-center gap-5">
            <BottleGraphic
              design={bottle.design}
              capacity={bottle.capacity}
              status={bottle.status}
              defect={bottle.defect}
              size={110}
            />
            <div className="space-y-1">
              <StatusBadge status={bottle.status} />
              <div className="text-sm text-line-700 dark:text-line-200/80">
                Detected defect: <span className="font-semibold text-line-900 dark:text-white">{bottle.defect}</span>
              </div>
              <div className="text-sm text-line-700 dark:text-line-200/80">
                Confidence:{' '}
                <span className="font-semibold font-mono text-line-900 dark:text-white">
                  {formatConfidence(bottle.confidence)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-line-500/10">
            <Field label="Bottle ID" value={bottle.bottleId} mono />
            <Field label="Batch Number" value={bottle.batchId} mono />
            <Field label="Bottle Design" value={bottle.design} />
            <Field label="Bottle Capacity" value={bottle.capacity} />
            <Field label="Manufacturing Date" value={bottle.manufacturingDate} mono />
            <Field label="Manufacturing Time" value={bottle.manufacturingTime} mono />
            <Field label="Inspection Status" value={bottle.status} />
            <Field label="Detected Defect" value={bottle.defect} />
          </div>

          <div className="pt-4 border-t border-line-500/10">
            <div className="text-xs font-semibold uppercase tracking-wide text-line-500 dark:text-line-300/60 mb-1.5">
              AI Inspector Recommendation
            </div>
            <p className="text-sm text-line-800 dark:text-line-100 bg-line-500/5 rounded-xl p-3 border border-line-500/10">
              {bottle.recommendation}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-line-500 dark:text-line-300/60 font-semibold">
        {label}
      </div>
      <div className={`text-sm font-medium text-line-900 dark:text-white mt-0.5 ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  )
}

function NavButton({ dir, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="focus-ring h-9 w-9 rounded-xl bg-line-500/10 hover:bg-line-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-line-700 dark:text-line-100 transition-colors"
      title={dir === 'prev' ? 'Previous bottle' : 'Next bottle'}
    >
      {dir === 'prev' ? <ArrowBackIosNewIcon style={{ fontSize: 14 }} /> : <ArrowForwardIosIcon style={{ fontSize: 14 }} />}
    </button>
  )
}
