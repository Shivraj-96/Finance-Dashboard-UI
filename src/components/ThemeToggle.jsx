import React from 'react'
import { useApp } from '../context/AppContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { state, toggleTheme } = useApp()
  const isDark = state.theme === 'dark'

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`${styles.track} ${isDark ? styles.dark : styles.light}`}>
        <span className={styles.thumb}>
          {isDark ? (
            // Moon icon
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M10.5 7.5A5 5 0 015 2a5 5 0 100 10 5 5 0 005.5-4.5z"
                fill="currentColor"
              />
            </svg>
          ) : (
            // Sun icon
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="currentColor" />
              <path d="M6 1v1M6 10v1M1 6h1M10 6h1M2.5 2.5l.7.7M8.8 8.8l.7.7M2.5 9.5l.7-.7M8.8 3.2l.7-.7"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </span>
    </button>
  )
}