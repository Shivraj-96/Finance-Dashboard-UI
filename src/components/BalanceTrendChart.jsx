import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import { MONTHS, BALANCE_DATA, INCOME_DATA, fmt } from '../data/mockData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const data = {
  labels: MONTHS,
  datasets: [
    { label: 'Balance', data: BALANCE_DATA, borderColor: '#f5a623', backgroundColor: 'rgba(245,166,35,0.08)', borderWidth: 2, pointBackgroundColor: '#f5a623', pointRadius: 4, pointHoverRadius: 6, tension: 0.4, fill: true },
    { label: 'Income',  data: INCOME_DATA,  borderColor: '#22c55e', backgroundColor: 'transparent', borderWidth: 1.5, borderDash: [5,4], pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: '#22c55e', tension: 0.3, fill: false },
  ],
}
const options = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a2236', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#8fa3be', bodyColor: '#f0f4f8', padding: 10, callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + fmt(ctx.raw) } } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6380', font: { family: 'JetBrains Mono', size: 11 } }, border: { color: 'rgba(255,255,255,0.07)' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4d6380', font: { family: 'JetBrains Mono', size: 11 }, callback: v => '₹' + (v/1000).toFixed(0) + 'k' }, border: { color: 'rgba(255,255,255,0.07)', dash: [3,3] } },
  },
}

export default function BalanceTrendChart() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Balance Trend</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3, fontFamily: 'var(--font-m)' }}>Oct 2023 – Mar 2024</div>
        </div>
        <div style={{ display:'flex', gap: 16 }}>
          {[['#f5a623','Balance',false],['#22c55e','Income',true]].map(([c,l,d]) => (
            <span key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text2)' }}>
              <span style={{ width:20, height:2, background: d ? 'transparent':'#'+c.slice(1), borderTop: d ? `2px dashed ${c}` : 'none', display:'inline-block' }} />{l}
            </span>
          ))}
        </div>
      </div>
      <div className="chart-wrap" style={{ height: 240 }}><Line data={data} options={options} /></div>
    </div>
  )
}