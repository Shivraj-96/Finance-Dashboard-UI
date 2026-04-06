import React from 'react'
import { useApp } from '../context/AppContext'
import styles from './RoleSelector.module.css'

export default function RoleSelector() {
  const { state, setRole } = useApp()
  const isAdmin = state.role === 'admin'
  return (
    <div className={styles.wrap}>
      <div className={styles.badge} style={{ background: isAdmin ? 'rgba(245,166,35,0.12)' : 'rgba(59,130,246,0.10)' }}>
        <span className={styles.dot} style={{ background: isAdmin ? 'var(--amber)' : 'var(--blue)' }} />
        <span className={styles.roleLabel} style={{ color: isAdmin ? 'var(--amber)' : 'var(--blue)' }}>
          {isAdmin ? 'Admin' : 'Viewer'}
        </span>
      </div>
      <div className={styles.selectWrap}>
        <select className={styles.select} value={state.role} onChange={e => setRole(e.target.value)}>
          <option value="viewer">Viewer — Read only</option>
          <option value="admin">Admin — Full access</option>
        </select>
        <svg className={styles.chevron} viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}