import React from 'react'
import { SUMMARY } from '../data/mockData'
import styles from './SummaryCards.module.css'

export default function SummaryCards() {
  return (
    <div className={styles.grid}>
      {SUMMARY.map(card => (
        <div key={card.key} className={`${styles.card} ${styles[card.key]}`}>
          <div className={styles.icon} style={{ background: card.bg }}>
            <CardIcon id={card.key} color={card.color} />
          </div>
          <div className={styles.label}><span className={styles.dot} style={{ background: card.color }} />{card.label}</div>
          <div className={styles.value}>{card.value}</div>
          <div className={`${styles.change} ${card.up ? styles.up : styles.down}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              {card.up ? <path d="M6 2.5L10 6.5H2L6 2.5Z" fill="currentColor"/> : <path d="M6 9.5L10 5.5H2L6 9.5Z" fill="currentColor"/>}
            </svg>
            {card.change}
          </div>
        </div>
      ))}
    </div>
  )
}

function CardIcon({ id, color }) {
  const s = { stroke: color, strokeWidth: '1.3', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (id === 'balance') return <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="1.5" y="4.5" width="14" height="10" rx="2" stroke={color} strokeWidth="1.3"/><path d="M5 4.5V3C5 2.17 5.67 1.5 6.5 1.5H10.5C11.33 1.5 12 2.17 12 3V4.5M7 10H10M8.5 8.5V11.5" {...s}/></svg>
  if (id === 'income')  return <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 3V14M5 6L8.5 3L12 6" {...s}/><path d="M3 14H14" {...s}/></svg>
  if (id === 'expense') return <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 14V3M5 11L8.5 14L12 11" {...s}/><path d="M3 3H14" {...s}/></svg>
  return <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M2.5 9C2.5 6 5 3.5 8.5 3.5C11 3.5 13.2 4.9 14.2 7H15L13 10H11.5C11 11 10 11.5 8.5 11.5C7.5 11.5 6.5 11 6 10.2M2.5 9H4M9 7.5V8.5" {...s}/><path d="M5 13.5H9V12.5C9 12 9 11.5 8.5 11.5" {...s}/></svg>
}