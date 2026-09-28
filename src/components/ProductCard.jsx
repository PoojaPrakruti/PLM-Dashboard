import { motion } from 'framer-motion'
import LockOutlineIcon from '@mui/icons-material/LockOutlined'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import BottleGraphic from './BottleGraphic'

export default function ProductCard({ name, disabled, onClick, capacity, delay = 0 }) {
  return (
    <motion.button
      type="button"
      onClick={!disabled ? onClick : undefined}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={!disabled ? { y: -4 } : {}}
      className={`focus-ring group relative glass-panel p-6 flex flex-col items-center gap-4 text-left transition-all duration-300 ${
        disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer hover:shadow-glow'
      }`}
    >
      {disabled && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-semibold text-line-500 dark:text-line-300/70 bg-line-500/10 px-2 py-1 rounded-full">
          <LockOutlineIcon style={{ fontSize: 13 }} /> Coming soon
        </span>
      )}
      {!disabled && (
        <ArrowOutwardIcon
          className="absolute top-4 right-4 text-line-400 opacity-0 group-hover:opacity-100 transition-opacity"
          fontSize="small"
        />
      )}
      <BottleGraphic design={name} capacity={capacity} status="Passed" size={110} />
      <div className="text-center">
        <div className="font-display font-semibold text-line-900 dark:text-white">{name}</div>
        {capacity && <div className="text-xs font-mono text-line-500 dark:text-line-300/70 mt-1">{capacity}</div>}
      </div>
    </motion.button>
  )
}
