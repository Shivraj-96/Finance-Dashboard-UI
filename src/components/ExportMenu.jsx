import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './ExportMenu.module.css'

export default function ExportMenu({ rows }) {
  const { exportCSV, exportJSON, state } = useApp()
  const [open, setOpen] = useState(false)
  const [flash, setFlash] = useState(null)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handle(type) {
    const data = rows ?? state.transactions
    if (type === 'csv')  exportCSV(data)
    if (type === 'json') exportJSON(data)
    setFlash(type)
    setTimeout(() => setFlash(null), 1500)
    setOpen(false)
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={`${styles.btn} ${open ? styles.btnActive : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Export data"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7A1.5 1.5 0 0012 11.5V10"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Export
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className={styles.menu}>
          <div className={styles.menuLabel}>
            {rows ? `${rows.length} filtered rows` : `${state.transactions.length} transactions`}
          </div>
          <button className={styles.item} onClick={() => handle('csv')}>
            <span className={styles.itemIcon} style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--green)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 4.5h5M4 6.5h5M4 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <div className={styles.itemTitle}>Download CSV</div>
              <div className={styles.itemSub}>Spreadsheet-compatible</div>
            </div>
          </button>
          <button className={styles.item} onClick={() => handle('json')}>
            <span className={styles.itemIcon} style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--amber)' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M4 2H3a1 1 0 00-1 1v2a1 1 0 01-1 1 1 1 0 011 1v2a1 1 0 001 1h1M9 2h1a1 1 0 011 1v2a1 1 0 001 1 1 1 0 01-1 1v2a1 1 0 01-1 1H9"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6.5" cy="6.5" r=".8" fill="currentColor" />
              </svg>
            </span>
            <div>
              <div className={styles.itemTitle}>Download JSON</div>
              <div className={styles.itemSub}>Developer-friendly format</div>
            </div>
          </button>
        </div>
      )}

      {flash && (
        <div className={styles.toast}>
          ✓ {flash.toUpperCase()} exported
        </div>
      )}
    </div>
  )
}