import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, suffix = '', accent = 'line', delay = 0 }) {
  const accentMap = {
    line: 'text-line-600 dark:text-line-300 bg-line-500/10',
    pass: 'text-pass bg-pass/10',
    fail: 'text-fail bg-fail/10',
    teal: 'text-teal-500 bg-teal-500/10',
    inspecting: 'text-inspecting bg-inspecting/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-panel p-5 flex flex-col gap-3 hover:shadow-glow transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-line-500 dark:text-line-300/70 font-semibold">
          {label}
        </span>
        {Icon && (
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
            <Icon fontSize="small" />
          </div>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-line-900 dark:text-white">
        {value}
        {suffix && <span className="text-lg font-semibold text-line-500 dark:text-line-300/70 ml-1">{suffix}</span>}
      </div>
    </motion.div>
  )
}
