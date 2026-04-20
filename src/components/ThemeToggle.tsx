import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const isDark = theme === 'dark'
  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="fixed top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#1a1a18] text-[#1a1a18] dark:text-[#e8e6e0] shadow-sm hover:border-black/30 dark:hover:border-white/30 transition-colors font-mono text-[14px]"
    >
      {isDark ? '☀' : '☾'}
    </button>
  )
}
