import React, { useState } from 'react'
import styles from './Sidebar.module.css'

const NAV = [
  { id: 'overview',     label: 'Overview',     Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 7.5L7.5 1.5L13.5 7.5V13.5H9.5V10H5.5V13.5H1.5V7.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
  { id: 'analytics',    label: 'Analytics',    Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 11.5L6 7.5L9 10L13 5.5M1.5 13.5H13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'transactions', label: 'Transactions', Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5H13.5M5.5 1.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: 'budgets',      label: 'Budgets',      Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 4V7.5L9.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
]
const BOTTOM = [
  { id: 'profile',  label: 'Profile',  Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 13.5C2 11 4.5 9 7.5 9C10.5 9 13 11 13 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: 'settings', label: 'Settings', Icon: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 1V2.5M7.5 12.5V14M1 7.5H2.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
]

export default function Sidebar() {
  const [active, setActive] = useState('overview')
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M8 1v14M3 5h10M3 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        FinTrack
      </div>
      <div className={styles.sectionLabel}>Main</div>
      {NAV.map(({ id, label, Icon }) => (
        <button key={id} className={`${styles.navItem} ${active === id ? styles.active : ''}`} onClick={() => setActive(id)}>
          <Icon />{label}
        </button>
      ))}
      <div className={`${styles.sectionLabel} ${styles.spaced}`}>Account</div>
      {BOTTOM.map(({ id, label, Icon }) => (
        <button key={id} className={`${styles.navItem} ${active === id ? styles.active : ''}`} onClick={() => setActive(id)}>
          <Icon />{label}
        </button>
      ))}
      <div className={styles.bottomArea}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>SS</div>
          <div>
            <div className={styles.userName}>Shivraj Shinde</div>
            <div className={styles.userRole}>Personal Account</div>
          </div>
        </div>
      </div>
    </aside>
  )
}