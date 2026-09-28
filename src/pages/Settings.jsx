import { useState } from 'react'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

export default function Settings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(90)
  const [autoReject, setAutoReject] = useState(true)
  const [alerts, setAlerts] = useState(true)
  const [aiEndpoint, setAiEndpoint] = useState('')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-line-900 dark:text-white">Settings</h1>
        <p className="text-sm text-line-500 dark:text-line-300/60 mt-1">
          Configure inspection thresholds and integrations. Changes here are local to this session.
        </p>
      </div>

      <SettingsSection icon={TuneOutlinedIcon} title="Inspection Rules">
        <label className="block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-line-800 dark:text-line-100">Minimum confidence threshold</span>
            <span className="font-mono text-sm text-line-500 dark:text-line-300/60">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="99"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-line-500"
          />
        </label>
        <ToggleRow
          label="Auto-reject bottles below threshold"
          checked={autoReject}
          onChange={setAutoReject}
        />
      </SettingsSection>

      <SettingsSection icon={SmartToyOutlinedIcon} title="AI Model Integration">
        <label className="block">
          <span className="text-sm font-medium text-line-800 dark:text-line-100 block mb-2">
            Inference endpoint (not yet connected)
          </span>
          <input
            value={aiEndpoint}
            onChange={(e) => setAiEndpoint(e.target.value)}
            placeholder="https://your-model-endpoint/api/inspect"
            className="w-full rounded-xl bg-line-500/5 border border-line-500/10 px-3 py-2 text-sm font-mono outline-none focus:border-line-500/40 text-line-900 dark:text-white placeholder:text-line-400"
          />
        </label>
        <p className="text-xs text-line-500 dark:text-line-300/60">
          Once configured, inspection requests will be routed to this endpoint instead of the built-in
          simulator. No connection is active in this build.
        </p>
      </SettingsSection>

      <SettingsSection icon={NotificationsNoneOutlinedIcon} title="Notifications">
        <ToggleRow label="Alert on defect spikes" checked={alerts} onChange={setAlerts} />
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ icon: Icon, title, children }) {
  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center gap-2 text-line-800 dark:text-line-100">
        <Icon fontSize="small" className="text-line-500" />
        <span className="font-display font-semibold text-sm">{title}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-line-800 dark:text-line-100">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`focus-ring w-11 h-6 rounded-full relative transition-colors ${
          checked ? 'bg-line-500' : 'bg-line-500/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
