import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { MONTHS, INCOME_DATA, EXPENSE_DATA, fmt } from '../data/mockData'
import styles from './IncomeExpensesChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const avgIncome  = Math.round(INCOME_DATA.reduce((a,v) => a+v,0) / INCOME_DATA.length)
const avgExpense = Math.round(EXPENSE_DATA.reduce((a,v) => a+v,0) / EXPENSE_DATA.length)

const data = {
  labels: MONTHS,
  datasets: [
    { label: 'Income',   data: INCOME_DATA,  backgroundColor: 'rgba(34,197,94,0.75)',  borderRadius: 4, borderSkipped: false },
    { label: 'Expenses', data: EXPENSE_DATA, backgroundColor: 'rgba(244,63,94,0.75)',  borderRadius: 4, borderSkipped: false },
  ],
}
const options = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a2236', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#8fa3be', bodyColor: '#f0f4f8', padding: 10, callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + fmt(ctx.raw) } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#4d6380', font: { family: 'JetBrains Mono', size: 11 } }, border: { color: 'rgba(255,255,255,0.07)' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6380', font: { family: 'JetBrains Mono', size: 11 }, callback: v => '₹'+(v/1000).toFixed(0)+'k' }, border: { color: 'rgba(255,255,255,0.07)' } },
  },
}

export default function IncomeExpensesChart() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Income vs Expenses</div>
        <div className="panel-meta">6-month view</div>
      </div>
      <div className={styles.stats}>
        {[['Avg Income', fmt(avgIncome), 'var(--green)'], ['Avg Expense', fmt(avgExpense), 'var(--red)'], ['Avg Saving', fmt(avgIncome-avgExpense), 'var(--blue)']].map(([l,v,c]) => (
          <div key={l} className={styles.stat}>
            <div className={styles.statLabel}>{l}</div>
            <div className={styles.statValue} style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        {[['#22c55e','Income'],['#f43f5e','Expenses']].map(([c,l]) => (
          <span key={l} className={styles.legendItem}><span className={styles.legendDot} style={{ background: c }} />{l}</span>
        ))}
      </div>
      <div className="chart-wrap" style={{ height: 180 }}><Bar data={data} options={options} /></div>
    </div>
  )
}