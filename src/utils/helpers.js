export const STATUS_STYLES = {
  Passed: {
    label: 'Passed',
    dot: 'bg-pass',
    text: 'text-pass',
    bg: 'bg-pass/10',
    border: 'border-pass/30',
  },
  Failed: {
    label: 'Failed',
    dot: 'bg-fail',
    text: 'text-fail',
    bg: 'bg-fail/10',
    border: 'border-fail/30',
  },
  Inspecting: {
    label: 'Inspecting',
    dot: 'bg-inspecting',
    text: 'text-inspecting',
    bg: 'bg-inspecting/10',
    border: 'border-inspecting/30',
  },
}

export function statusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.Inspecting
}

export function formatConfidence(confidence) {
  if (confidence === null || confidence === undefined) return '—'
  return `${confidence.toFixed(1)}%`
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}
