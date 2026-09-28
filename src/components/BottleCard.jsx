import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'
import BottleGraphic from './BottleGraphic'
import { statusStyle } from '../utils/helpers'

export default function BottleCard({ bottle, onClick, delay = 0 }) {
  const style = statusStyle(bottle.status)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      className={`focus-ring glass-panel p-4 flex flex-col items-center gap-2 text-left border-t-2 ${style.border} hover:shadow-glow transition-all duration-300`}
    >
      <BottleGraphic
        design={bottle.design}
        capacity={bottle.capacity}
        status={bottle.status}
        defect={bottle.defect}
        scanning={bottle.status === 'Inspecting'}
        size={90}
      />
      <div className="w-full text-center">
        <div className="font-mono text-xs font-semibold text-line-900 dark:text-white truncate">
          {bottle.bottleId}
        </div>
        <div className="text-[11px] text-line-500 dark:text-line-300/60 mt-0.5">
          {bottle.inspectionTimestamp.split(' ')[1]}
        </div>
        <div className="mt-2">
          <StatusBadge status={bottle.status} size="sm" />
        </div>
      </div>
    </motion.button>
  )
}
