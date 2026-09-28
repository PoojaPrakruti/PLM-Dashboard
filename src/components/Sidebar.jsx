import { NavLink } from 'react-router-dom'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: SpaceDashboardOutlinedIcon, end: true },
  { to: '/products', label: 'Products', icon: Inventory2OutlinedIcon },
  { to: '/analytics', label: 'Analytics', icon: InsightsOutlinedIcon },
  { to: '/live-inspection', label: 'Live Inspection', icon: SensorsOutlinedIcon },
  { to: '/settings', label: 'Settings', icon: SettingsOutlinedIcon },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 w-64 shrink-0 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full m-3 rounded-2xl glass flex flex-col overflow-hidden">
          <div className="px-5 py-6 flex items-center gap-3 border-b border-line-500/10">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-line-500 to-teal-500 flex items-center justify-center overflow-hidden shadow-glow">
              <span className="font-display font-extrabold text-white text-sm">LS</span>
              <span className="absolute left-0 right-0 h-2 bg-white/40 animate-scanline" />
            </div>
            <div>
              <div className="font-display font-bold text-line-900 dark:text-white leading-tight">LineSight</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-line-500 dark:text-line-300/60">
                Vision QA Console
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `focus-ring group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-line-500 text-white shadow-glow'
                      : 'text-line-700 dark:text-line-200/80 hover:bg-line-500/10 hover:text-line-700 dark:hover:text-white'
                  }`
                }
              >
                <Icon fontSize="small" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-line-500/10">
            <div className="flex items-center gap-2 text-[11px] font-mono text-line-500 dark:text-line-300/60">
              <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulseSoft" />
              LINE 03 · ONLINE
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
