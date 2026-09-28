import { useEffect, useState } from 'react'

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return true
    return true // default to dark for the industrial-console feel
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [dark])

  return [dark, setDark]
}
