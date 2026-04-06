import React from 'react'
import { useApp } from '../context/AppContext'
import { CAT_COLORS, MONTHS, INCOME_DATA, EXPENSE_DATA, fmt } from '../data/mockData'
import styles from './Insights.module.css'

export default function Insights() {
  const { insights } = useApp()
  const { topCat, totalExpense, totalIncome, savingsRate, largest, avgExpense, byCategory } = insights
  const totalSpend = Object.values(byCategory).reduce((a,v) => a+v, 0)
  const lastIncome = INCOME_DATA[INCOME_DATA.length-1], prevIncome = INCOME_DATA[INCOME_DATA.length-2]
  const lastExpense = EXPENSE_DATA[EXPENSE_DATA.length-1], prevExpense = EXPENSE_DATA[EXPENSE_DATA.length-2]
  const incomeΔ  = ((lastIncome  - prevIncome)  / prevIncome  * 100).toFixed(1)
  const expenseΔ = ((lastExpense - prevExpense) / prevExpense * 100).toFixed(1)

  return (
    <div className={styles.grid}>

      {/* top category */}
      <div className="panel">
        <div className={styles.cardIcon} style={{ background: topCat[0] ? CAT_COLORS[topCat[0][0]] + '18' : '#fff1' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14l4-4 3 3 5-6 2 1" stroke={topCat[0] ? CAT_COLORS[topCat[0][0]] : '#fff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className={styles.insightLabel}>Top Spending Category</div>
        {topCat.length === 0 ? <div className={styles.none}>No data</div> : <>
          <div className={styles.insightValue} style={{ color: CAT_COLORS[topCat[0][0]] }}>{topCat[0][0]}</div>
          <div className={styles.insightSub}>{fmt(topCat[0][1])} — {Math.round(topCat[0][1]/totalSpend*100)}% of spend</div>
          <div className={styles.catBar}>
            {topCat.slice(0,4).map(([cat,amt]) => (
              <div key={cat} className={styles.catBarSeg} style={{ width: `${Math.round(amt/totalSpend*100)}%`, background: CAT_COLORS[cat] || '#94a3b8' }} title={cat} />
            ))}
          </div>
          <div className={styles.catList}>
            {topCat.slice(0,4).map(([cat,amt]) => (
              <div key={cat} className={styles.catItem}>
                <span className={styles.catDot} style={{ background: CAT_COLORS[cat] }} />
                <span className={styles.catName}>{cat}</span>
                <span className={styles.catAmt}>{Math.round(amt/totalSpend*100)}%</span>
              </div>
            ))}
          </div>
        </>}
      </div>

      {/* monthly comparison */}
      <div className="panel">
        <div className={styles.cardIcon} style={{ background: 'rgba(59,130,246,0.12)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="10" width="3" height="6" rx="1" fill="#3b82f6" opacity=".5"/><rect x="7" y="6" width="3" height="10" rx="1" fill="#3b82f6" opacity=".7"/><rect x="12" y="2" width="3" height="14" rx="1" fill="#3b82f6"/></svg>
        </div>
        <div className={styles.insightLabel}>Monthly Comparison</div>
        <div className={styles.insightValue} style={{ color: 'var(--blue)', fontSize: 15 }}>{MONTHS[MONTHS.length-2]} → {MONTHS[MONTHS.length-1]}</div>
        <div className={styles.compRow}>
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Income</div>
            <div className={styles.compValue} style={{ color: 'var(--green)' }}>{fmt(lastIncome)}</div>
            <div className={`${styles.compChange} ${Number(incomeΔ)>=0?styles.up:styles.down}`}>{Number(incomeΔ)>=0?'▲':'▼'} {Math.abs(incomeΔ)}%</div>
          </div>
          <div className={styles.compDivider} />
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Expenses</div>
            <div className={styles.compValue} style={{ color: 'var(--red)' }}>{fmt(lastExpense)}</div>
            <div className={`${styles.compChange} ${Number(expenseΔ)<=0?styles.up:styles.down}`}>{Number(expenseΔ)>=0?'▲':'▼'} {Math.abs(expenseΔ)}%</div>
          </div>
        </div>
        <div className={styles.insightNote}>{Number(expenseΔ) > 0 ? `Expenses rose ${expenseΔ}% vs last month. Review discretionary spend.` : `Expenses dropped ${Math.abs(expenseΔ)}% vs last month. Great cost control!`}</div>
      </div>

      {/* savings health */}
      <div className="panel">
        <div className={styles.cardIcon} style={{ background: 'rgba(34,197,94,0.12)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="#22c55e" strokeWidth="1.3"/><path d="M9 5.5v3.5l2.5 1.5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </div>
        <div className={styles.insightLabel}>Savings Health</div>
        <div className={styles.insightValue} style={{ color: savingsRate>30?'var(--green)':savingsRate>15?'var(--amber)':'var(--red)' }}>{savingsRate.toFixed(1)}% rate</div>
        <div className={styles.savingsBar}>
          <div className={styles.savingsFill} style={{ width:`${Math.min(savingsRate,100)}%`, background: savingsRate>30?'var(--green)':savingsRate>15?'var(--amber)':'var(--red)' }} />
        </div>
        <div className={styles.insightNote}>{savingsRate>30?'Excellent! Well above the 20% benchmark.':savingsRate>15?'Good. Push above 30% for long-term stability.':'Below target. Reduce expenses or boost income.'}</div>
      </div>

      {/* largest transaction */}
      <div className="panel">
        <div className={styles.cardIcon} style={{ background: 'rgba(245,166,35,0.12)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3l6 6-6 6" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className={styles.insightLabel}>Largest Transaction</div>
        {!largest ? <div className={styles.none}>No data</div> : <>
          <div className={styles.insightValue} style={{ color: 'var(--amber)' }}>{fmt(largest.amt)}</div>
          <div className={styles.insightSub}>{largest.desc}</div>
          <div className={styles.insightNote}>Avg expense is {fmt(Math.round(avgExpense))}. This was {(largest.amt/avgExpense).toFixed(1)}× the average.</div>
        </>}
      </div>

    </div>
  )
}