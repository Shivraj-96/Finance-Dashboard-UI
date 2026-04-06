import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { SPENDING, CAT_COLORS, fmt } from '../data/mockData'
import styles from './SpendingBreakdown.module.css'

ChartJS.register(ArcElement, Tooltip)

const total = SPENDING.reduce((a,s) => a + s.amt, 0)
const data = {
  labels: SPENDING.map(s => s.cat),
  datasets: [{ data: SPENDING.map(s => s.amt), backgroundColor: SPENDING.map(s => CAT_COLORS[s.cat]), borderColor: '#131e2f', borderWidth: 3, hoverOffset: 6 }],
}
const options = {
  responsive: true, maintainAspectRatio: false, cutout: '68%',
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a2236', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#8fa3be', bodyColor: '#f0f4f8', padding: 10, callbacks: { label: ctx => ' ' + fmt(ctx.raw) + ' (' + Math.round(ctx.raw/total*100) + '%)' } } },
}

export default function SpendingBreakdown() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Spending Breakdown</div>
        <div className="panel-meta">March 2024</div>
      </div>
      <div className={styles.donutWrap}>
        <Doughnut data={data} options={options} />
        <div className={styles.center}>
          <div className={styles.centerLabel}>Total</div>
          <div className={styles.centerValue}>{fmt(total)}</div>
        </div>
      </div>
      <div className={styles.legend}>
        {SPENDING.map(s => (
          <div key={s.cat} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: CAT_COLORS[s.cat] }} />
            <span className={styles.legendLabel}>{s.cat}</span>
            <span className={styles.legendVal}>{Math.round(s.amt/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}