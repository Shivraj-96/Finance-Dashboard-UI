import React from 'react'
import { useApp } from '../context/AppContext'
import styles from './ApiStatusBadge.module.css'

export default function ApiStatusBadge() {
  const { state } = useApp()
  const { apiStatus, apiError } = state

  if (apiStatus === 'idle' || apiStatus === 'success') return null

  return (
    <div className={`${styles.badge} ${styles[apiStatus]}`}>
      {apiStatus === 'loading' && (
        <>
          <span className={styles.spinner} />
          Syncing…
        </>
      )}
      {apiStatus === 'error' && (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {apiError || 'API error'}
        </>
      )}
    </div>
  )
}