import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
      <div className="font-mono text-xs text-line-500 dark:text-line-300/60">ERROR 404</div>
      <h1 className="font-display text-xl font-bold text-line-900 dark:text-white">Record not found</h1>
      <p className="text-sm text-line-500 dark:text-line-300/60 max-w-sm">
        The bottle, batch, or page you're looking for doesn't exist in the current production log.
      </p>
      <Link to="/" className="mt-2 px-4 py-2 rounded-xl bg-line-500 text-white text-sm font-medium hover:bg-line-600 transition-colors">
        Back to Dashboard
      </Link>
    </div>
  )
}
