import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import StatCard from '../components/StatCard'
import ProductCard from '../components/ProductCard'
import { getStatistics } from '../services/bottleService'

const CATEGORIES = [
  { name: 'Water Bottle', capacity: 'Live Line', disabled: false },
  { name: 'Juice Bottle', capacity: 'Not yet configured', disabled: true },
  { name: 'Medicine Bottle', capacity: 'Not yet configured', disabled: true },
  { name: 'Soft Drink Bottle', capacity: 'Not yet configured', disabled: true },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getStatistics().then(setStats)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white">Production Overview</h1>
        <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
          Real-time defect inspection summary across the bottling line, today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={PrecisionManufacturingOutlinedIcon}
          label="Total Manufactured"
          value={stats ? stats.totalManufactured : '—'}
          accent="line"
          delay={0}
        />
        <StatCard
          icon={CheckCircleOutlineIcon}
          label="Good Bottles"
          value={stats ? stats.goodBottles : '—'}
          accent="pass"
          delay={0.05}
        />
        <StatCard
          icon={HighlightOffIcon}
          label="Defective Bottles"
          value={stats ? stats.defectiveBottles : '—'}
          accent="fail"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUpIcon}
          label="Pass Percentage"
          value={stats ? stats.passPercentage : '—'}
          suffix="%"
          accent="teal"
          delay={0.15}
        />
        <StatCard
          icon={TrendingDownIcon}
          label="Defect Percentage"
          value={stats ? stats.defectPercentage : '—'}
          suffix="%"
          accent="fail"
          delay={0.2}
        />
        <StatCard
          icon={ReportProblemOutlinedIcon}
          label="Most Common Defect"
          value={stats ? stats.mostCommonDefect : '—'}
          accent="inspecting"
          delay={0.25}
        />
        <StatCard
          icon={ScheduleOutlinedIcon}
          label="Last Inspection"
          value={stats ? stats.lastInspectionTime.split(' ')[1] : '—'}
          accent="line"
          delay={0.3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-line-900 dark:text-white">Product Categories</h2>
          <span className="text-xs font-mono text-line-500 dark:text-line-300/60">1 of 4 lines active</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <ProductCard
              key={c.name}
              name={c.name}
              capacity={c.capacity}
              disabled={c.disabled}
              delay={i * 0.05}
              onClick={() => navigate('/products')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
