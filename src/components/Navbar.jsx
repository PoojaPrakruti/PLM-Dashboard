import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { searchBottle } from '../services/bottleService'
import StatusBadge from './StatusBadge'

const NOTIFICATIONS = [
  { id: 1, text: 'Batch D2-Today flagged 2 defective units', time: '4m ago', tone: 'fail' },
  { id: 2, text: 'Line 03 pass rate above 95% for 2 hours', time: '38m ago', tone: 'pass' },
  { id: 3, text: 'Design 3 inspection queue backing up', time: '1h ago', tone: 'inspecting' },
]

export default function Navbar({ dark, setDark, onMenuClick }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    let active = true
    searchBottle(query).then((r) => active && setResults(r))
    return () => {
      active = false
    }
  }, [query])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-20 px-3 pt-3">
      <div className="glass rounded-2xl px-4 sm:px-5 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="focus-ring lg:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-line-500/10"
            onClick={onMenuClick}
          >
            <MenuIcon fontSize="small" />
          </button>
          <div className="min-w-0">
            <div className="font-display font-bold text-line-900 dark:text-white leading-tight truncate">
              AI Bottle Defect Detection
            </div>
            <div className="text-[11px] text-line-500 dark:text-line-300/60 hidden sm:block">
              Bottle Manufacturing · Plant Floor Monitoring
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="focus-ring h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-line-500/10 hover:bg-line-500/20 text-line-700 dark:text-line-100 flex items-center justify-center gap-2 transition-colors"
            >
              <SearchIcon fontSize="small" />
              <span className="hidden sm:inline text-sm font-medium">Search</span>
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[22rem] max-w-[90vw] glass-panel p-3 z-50"
                >
                  <div className="flex items-center gap-2 bg-line-500/5 rounded-xl px-3 py-2">
                    <SearchIcon fontSize="small" className="text-line-400" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Bottle ID, batch number, or date..."
                      className="bg-transparent outline-none text-sm w-full text-line-900 dark:text-white placeholder:text-line-400"
                    />
                    <button onClick={() => setSearchOpen(false)} className="focus-ring text-line-400 hover:text-line-700">
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                  {results.length > 0 && (
                    <div className="mt-2 max-h-72 overflow-y-auto space-y-1">
                      {results.map((b) => (
                        <button
                          key={b.bottleId}
                          onClick={() => {
                            navigate(`/bottle/${b.bottleId}`)
                            setSearchOpen(false)
                            setQuery('')
                          }}
                          className="focus-ring w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-line-500/10 text-left"
                        >
                          <div>
                            <div className="font-mono text-xs font-semibold text-line-900 dark:text-white">
                              {b.bottleId}
                            </div>
                            <div className="text-[11px] text-line-500 dark:text-line-300/60">{b.batchId}</div>
                          </div>
                          <StatusBadge status={b.status} size="sm" />
                        </button>
                      ))}
                    </div>
                  )}
                  {query && results.length === 0 && (
                    <div className="text-xs text-line-500 dark:text-line-300/60 px-3 py-4 text-center">
                      No matching records.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((s) => !s)}
              className="focus-ring relative h-10 w-10 rounded-xl bg-line-500/10 hover:bg-line-500/20 flex items-center justify-center text-line-700 dark:text-line-100 transition-colors"
            >
              <NotificationsNoneOutlinedIcon fontSize="small" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-fail" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 max-w-[90vw] glass-panel p-2 z-50"
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-line-500 dark:text-line-300/60">
                    Notifications
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-line-500/10">
                      <span
                        className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                          n.tone === 'fail' ? 'bg-fail' : n.tone === 'pass' ? 'bg-pass' : 'bg-inspecting'
                        }`}
                      />
                      <div>
                        <div className="text-sm text-line-800 dark:text-line-100">{n.text}</div>
                        <div className="text-[11px] text-line-500 dark:text-line-300/60">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setDark((d) => !d)}
            className="focus-ring h-10 w-10 rounded-xl bg-line-500/10 hover:bg-line-500/20 flex items-center justify-center text-line-700 dark:text-line-100 transition-colors"
          >
            {dark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
          </button>

          <button className="focus-ring flex items-center gap-2 pl-1 pr-3 h-10 rounded-xl bg-line-500/10 hover:bg-line-500/20 transition-colors">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-line-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold font-display">
              QA
            </span>
            <span className="hidden md:block text-sm font-medium text-line-800 dark:text-line-100">
              Priya Nair
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
