/**
 * App.jsx — Updated with optional enhancements wired in.
 *
 * Changes from the original:
 *   1. ThemeToggle added to topbar (dark/light mode)
 *   2. ApiStatusBadge added to topbar (shows mock API sync state)
 *   3. ExportMenu is now inside TransactionsTable (no change needed here)
 *   4. animations.css imported globally
 */

import React, { useState } from 'react'
import { AppProvider }       from './context/AppContext'
import Sidebar               from './components/Sidebar'
import SummaryCards          from './components/SummaryCards'
import BalanceTrendChart     from './components/BalanceTrendChart'
import SpendingBreakdown     from './components/SpendingBreakdown'
import IncomeExpensesChart   from './components/IncomeExpensesChart'
import TransactionsTable     from './components/TransactionsTable'   // ← updated file
import Insights              from './components/Insights'
import RoleSelector          from './components/RoleSelector'
import ThemeToggle           from './components/ThemeToggle'         // ← NEW
import ApiStatusBadge        from './components/ApiStatusBadge'      // ← NEW
import styles from './App.module.css'

// Also import once at the top level:
import './styles/animations.css'   // ← NEW  (adjust path to match your structure)

const PERIODS = ['3M', '6M', '1Y']

function Dashboard() {
  const [period, setPeriod] = useState('6M')
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>

        <div className={styles.topbar}>
          <div>
            <div className={styles.title}>
              <span className={styles.titleItalic}>Overview</span>
              <span className={styles.titleDivider}>/</span>
              <span className={styles.titleSub}>March 2024</span>
            </div>
            <div className={styles.subtitle}>Track, analyse and grow your financial health.</div>
          </div>

          <div className={styles.topbarRight}>
            {/* NEW: API sync indicator */}
            <ApiStatusBadge />

            <RoleSelector />

            {/* NEW: dark/light toggle */}
            <ThemeToggle />

            <div className={styles.dateBadge}>{today}</div>

            <div className={styles.periodSelector}>
              {PERIODS.map(p => (
                <button
                  key={p}
                  className={`${styles.periodBtn} ${period === p ? styles.periodActive : ''}`}
                  onClick={() => setPeriod(p)}
                >{p}</button>
              ))}
            </div>
          </div>
        </div>

        <SummaryCards />

        <div className={styles.chartsRow}>
          <BalanceTrendChart />
          <SpendingBreakdown />
        </div>

        <SectionHeading label="Insights" sub="Derived from your transaction history" />
        <Insights />

        <SectionHeading label="Income vs Expenses" sub="6-month overview" />
        <div className={styles.bottomRow}>
          <IncomeExpensesChart />
          {/* TransactionsTable now includes ExportMenu + grouping + pagination */}
          <TransactionsTable />
        </div>

      </main>
    </div>
  )
}

function SectionHeading({ label, sub }) {
  return (
    <div className={styles.sectionHeading}>
      <div className={styles.sectionTitle}>{label}</div>
      <div className={styles.sectionSub}>{sub}</div>
    </div>
  )
}

export default function App() {
  return <AppProvider><Dashboard /></AppProvider>
}