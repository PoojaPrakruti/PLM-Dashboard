import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { getAnalytics } from '../services/bottleService'

const PIE_COLORS = ['#16a34a', '#dc2626']
const BAR_COLOR = '#2b5cf5'

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getAnalytics().then(setData)
  }, [])

  if (!data) {
    return <div className="text-sm text-line-500 dark:text-line-300/60">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
          Quality trends across all designs, last 7 days.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryStat label="Total Inspections" value={data.totalInspections} />
        <SummaryStat label="Rejected Bottles" value={data.rejectedBottles} tone="fail" />
        <SummaryStat label="Average Confidence" value={`${data.averageConfidence}%`} tone="teal" />
        <SummaryStat label="Most Frequent Defect" value={data.mostFrequentDefect} tone="inspecting" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Good vs Defective">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {data.pieData.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={24} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Defect Counts">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.defectBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Today's Pass Rate">
          <div className="flex flex-col items-center justify-center h-[240px] gap-4">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(120,140,200,0.15)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.todaysPassRate / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-2xl text-line-900 dark:text-white">
                  {data.todaysPassRate}%
                </span>
                <span className="text-[10px] uppercase tracking-wide text-line-500 dark:text-line-300/60">
                  Pass rate
                </span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Production Trend — Last 7 Days">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,140,200,0.15)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="produced" name="Produced" stroke="#2b5cf5" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="passed" name="Passed" stroke="#16a34a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="failed" name="Failed" stroke="#dc2626" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

const tooltipStyle = {
  background: 'rgba(15, 23, 42, 0.92)',
  border: 'none',
  borderRadius: 12,
  fontSize: 12,
  color: 'white',
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-panel p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-line-500 dark:text-line-300/60 mb-3">
        {title}
      </div>
      {children}
    </div>
  )
}

function SummaryStat({ label, value, tone }) {
  const toneClass =
    tone === 'fail' ? 'text-fail' : tone === 'teal' ? 'text-teal-500' : tone === 'inspecting' ? 'text-inspecting' : 'text-line-900 dark:text-white'
  return (
    <div className="glass-panel p-5">
      <div className="text-[10px] uppercase tracking-wide text-line-500 dark:text-line-300/60 font-semibold">
        {label}
      </div>
      <div className={`font-display font-bold text-xl mt-1 ${toneClass}`}>{value}</div>
    </div>
  )
}
