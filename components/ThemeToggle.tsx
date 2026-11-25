'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const THEME_STORAGE_KEY = 'tasknest-theme'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    const shouldUseDark = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', shouldUseDark)
    document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light'
    setIsDark(shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !isDark
    document.documentElement.classList.toggle('dark', nextIsDark)
    document.documentElement.style.colorScheme = nextIsDark ? 'dark' : 'light'
    window.localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? 'dark' : 'light')
    setIsDark(nextIsDark)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
