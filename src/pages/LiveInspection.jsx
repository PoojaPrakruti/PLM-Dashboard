import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import BottleGraphic from '../components/BottleGraphic'
import StatusBadge from '../components/StatusBadge'
import { PRODUCTS, DEFECT_TYPES } from '../mockData/bottles'

let counter = 1

function randomBottle() {
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
  const now = new Date()
  const time = now.toTimeString().slice(0, 8)
  const id = `LIVE-${String(counter++).padStart(4, '0')}`
  return {
    bottleId: id,
    design: product.name,
    capacity: product.capacity,
    time,
    status: 'Inspecting',
    defect: '—',
    confidence: null,
  }
}

function resolveBottle(bottle) {
  const passed = Math.random() < 0.8
  const defect = passed ? 'No Defect' : DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)]
  const confidence = passed ? +(95 + Math.random() * 4.9).toFixed(1) : +(90 + Math.random() * 9.8).toFixed(1)
  return { ...bottle, status: passed ? 'Passed' : 'Failed', defect, confidence }
}

export default function LiveInspection() {
  const [feed, setFeed] = useState(() => [randomBottle()])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!running) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setFeed((prev) => {
        // resolve the most recent inspecting bottle, then push a new one
        const resolved = prev.map((b, i) => (i === 0 && b.status === 'Inspecting' ? resolveBottle(b) : b))
        if (resolved[0] && resolved[0].status !== 'Inspecting') {
          setLog((l) => [resolved[0], ...l].slice(0, 30))
        }
        const next = [randomBottle(), ...resolved].slice(0, 9)
        return next
      })
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [running])

  const currentlyInspecting = feed.find((b) => b.status === 'Inspecting')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white flex items-center gap-2">
            <SensorsOutlinedIcon className="text-teal-500" /> Live Inspection
          </h1>
          <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
            Simulated real-time feed — a new bottle enters the scanner every 3 seconds.
          </p>
        </div>
        <button
          onClick={() => setRunning((r) => !r)}
          className="focus-ring flex items-center gap-2 px-4 py-2 rounded-xl bg-line-500/10 hover:bg-line-500/20 text-sm font-medium text-line-700 dark:text-line-100 transition-colors"
        >
          {running ? <PauseCircleOutlineIcon fontSize="small" /> : <PlayCircleOutlineIcon fontSize="small" />}
          {running ? 'Pause feed' : 'Resume feed'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col items-center gap-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-line-500 dark:text-line-300/60">
            Scanner — Live Feed
          </div>
          <AnimatePresence mode="wait">
            {currentlyInspecting && (
              <motion.div
                key={currentlyInspecting.bottleId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <BottleGraphic
                  design={currentlyInspecting.design}
                  capacity={currentlyInspecting.capacity}
                  status={currentlyInspecting.status}
                  scanning
                  size={160}
                />
                <div className="font-mono text-sm font-semibold text-line-900 dark:text-white">
                  {currentlyInspecting.bottleId}
                </div>
                <StatusBadge status={currentlyInspecting.status} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-3 mt-2">
            {feed.slice(1, 6).map((b) => (
              <motion.div
                key={b.bottleId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-line-500/5 border border-line-500/10"
              >
                <BottleGraphic design={b.design} capacity={b.capacity} status={b.status} defect={b.defect} size={56} />
                <span className="text-[10px] font-mono text-line-600 dark:text-line-300/70 truncate w-full text-center">
                  {b.bottleId}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 flex flex-col max-h-[520px]">
          <div className="text-xs font-semibold uppercase tracking-wide text-line-500 dark:text-line-300/60 mb-3">
            Live Activity Log
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence initial={false}>
              {log.map((entry) => (
                <motion.div
                  key={entry.bottleId}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-line-500/5 border border-line-500/10"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold text-line-900 dark:text-white truncate">
                      {entry.bottleId}
                    </div>
                    <div className="text-[11px] text-line-500 dark:text-line-300/60 truncate">
                      {entry.time} · {entry.defect} · {entry.confidence}%
                    </div>
                  </div>
                  <StatusBadge status={entry.status} size="sm" />
                </motion.div>
              ))}
              {log.length === 0 && (
                <div className="text-xs text-line-500 dark:text-line-300/60 text-center py-8">
                  Waiting for the first inspection to complete...
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
