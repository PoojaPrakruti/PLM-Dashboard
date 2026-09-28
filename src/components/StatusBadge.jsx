import { statusStyle } from '../utils/helpers'

export default function StatusBadge({ status, size = 'md' }) {
  const style = statusStyle(status)
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.border} ${style.bg} ${style.text} ${pad} font-semibold font-mono tracking-wide`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot} ${status === 'Inspecting' ? 'animate-pulseSoft' : ''}`} />
      {style.label.toUpperCase()}
    </span>
  )
}
