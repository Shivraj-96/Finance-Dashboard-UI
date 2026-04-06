import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CAT_COLORS, fmt } from '../data/mockData'
import TransactionModal from './TransactionModal'
import ExportMenu from './ExportMenu'
import styles from './TransactionsTable.module.css'

const SORT_OPTS = [
  { value: 'date',     label: 'Date' },
  { value: 'amount',   label: 'Amount' },
  { value: 'category', label: 'Category' },
]

const GROUP_OPTS = [
  { value: 'none',     label: 'No Grouping' },
  { value: 'category', label: 'By Category' },
  { value: 'type',     label: 'By Type' },
  { value: 'month',    label: 'By Month' },
]

export default function TransactionsTable() {
  const { state, filteredTransactions, setFilter, resetFilters, deleteTransaction } = useApp()
  const { filters, role } = state
  const isAdmin = role === 'admin'

  const [modal, setModal]     = useState(null)   // null | 'add' | transaction-object
  const [groupBy, setGroupBy] = useState('none')
  const [page, setPage]       = useState(1)
  const PER_PAGE = 8

  // ── Grouping ───────────────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    if (groupBy === 'none') return null

    const map = {}
    filteredTransactions.forEach(t => {
      let key
      if (groupBy === 'category') key = t.cat
      else if (groupBy === 'type') key = t.type === 'credit' ? 'Income' : 'Expenses'
      else key = t.date?.split(' ').slice(1).join(' ') || 'Unknown'   // month grouping
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredTransactions, groupBy])

  // ── Pagination (ungrouped only) ────────────────────────────────────────────
  const totalPages = Math.ceil(filteredTransactions.length / PER_PAGE)
  const paged = grouped
    ? null
    : filteredTransactions.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const hasFilters = filters.query || filters.category || filters.type

  return (
    <div className="panel" style={{ flex: 1 }}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className="panel-title">Transactions</div>
          <div className={styles.count}>{filteredTransactions.length} records</div>
        </div>
        <div className={styles.headerActions}>
          <ExportMenu rows={filteredTransactions} />
          {isAdmin && (
            <button className={styles.addBtn} onClick={() => setModal('add')}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10l-2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            className={styles.search}
            placeholder="Search transactions…"
            value={filters.query}
            onChange={e => { setFilter('query', e.target.value); setPage(1) }}
          />
          {filters.query && (
            <button className={styles.clearSearch} onClick={() => setFilter('query', '')}>×</button>
          )}
        </div>

        {/* Category filter */}
        <select className={styles.select} value={filters.category} onChange={e => { setFilter('category', e.target.value); setPage(1) }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Type filter */}
        <select className={styles.select} value={filters.type} onChange={e => { setFilter('type', e.target.value); setPage(1) }}>
          <option value="">All Types</option>
          <option value="credit">Income</option>
          <option value="debit">Expense</option>
        </select>

        {/* Sort */}
        <select className={styles.select} value={filters.sortBy} onChange={e => setFilter('sortBy', e.target.value)}>
          {SORT_OPTS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
        </select>

        {/* Sort direction */}
        <button
          className={styles.sortDirBtn}
          onClick={() => setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
          title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
        >
          {filters.sortDir === 'asc' ? '↑' : '↓'}
        </button>

        {/* Group by */}
        <select className={styles.select} value={groupBy} onChange={e => setGroupBy(e.target.value)}>
          {GROUP_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Reset */}
        {hasFilters && (
          <button className={styles.resetBtn} onClick={() => { resetFilters(); setPage(1) }}>
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {filteredTransactions.length === 0 ? (
          <div className={styles.empty}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity=".3">
              <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 16h10M16 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>No transactions found</div>
          </div>
        ) : grouped ? (
          // ── Grouped view ──────────────────────────────────────────────────
          <div className={styles.groupedWrap}>
            {grouped.map(([groupKey, rows]) => {
              const total = rows.reduce((s, r) => s + (r.type === 'credit' ? r.amt : -r.amt), 0)
              return (
                <div key={groupKey} className={styles.group}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupLabel}>{groupKey}</span>
                    <span className={`${styles.groupTotal} ${total >= 0 ? styles.pos : styles.neg}`}>
                      {total >= 0 ? '+' : ''}{fmt(total)}
                    </span>
                    <span className={styles.groupCount}>{rows.length} txn{rows.length !== 1 ? 's' : ''}</span>
                  </div>
                  {rows.map(t => (
                    <TxnRow key={t.id} t={t} isAdmin={isAdmin} onEdit={() => setModal(t)} onDelete={() => deleteTransaction(t.id)} />
                  ))}
                </div>
              )
            })}
          </div>
        ) : (
          // ── Flat view with pagination ──────────────────────────────────────
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className={styles.right}>Amount</th>
                  {isAdmin && <th className={styles.right}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map(t => (
                  <TxnRow key={t.id} t={t} isAdmin={isAdmin} tableMode
                    onEdit={() => setModal(t)} onDelete={() => deleteTransaction(t.id)} />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                ))}
                <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <span className={styles.pageInfo}>
                  {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <TransactionModal
          existing={modal !== 'add' ? modal : null}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ── Row sub-component ──────────────────────────────────────────────────────────
function TxnRow({ t, isAdmin, tableMode, onEdit, onDelete }) {
  const isCredit = t.type === 'credit'
  const color    = CAT_COLORS[t.cat] || '#94a3b8'

  if (tableMode) {
    return (
      <tr className={styles.row} style={{ animationDelay: '0ms' }}>
        <td>
          <div className={styles.desc}>{t.desc}</div>
        </td>
        <td>
          <span className={styles.cat} style={{ background: color + '18', color }}>
            {t.cat}
          </span>
        </td>
        <td><span className={styles.date}>{t.date}</span></td>
        <td className={styles.right}>
          <span className={isCredit ? styles.credit : styles.debit}>
            {isCredit ? '+' : '-'}{fmt(t.amt)}
          </span>
        </td>
        {isAdmin && (
          <td className={styles.right}>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={onEdit} title="Edit">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>
              <button className={styles.delBtn} onClick={onDelete} title="Delete">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.7 7.5A1 1 0 003.7 11h4.6a1 1 0 001-.95L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </td>
        )}
      </tr>
    )
  }

  // Card-style for grouped view
  return (
    <div className={styles.groupRow}>
      <span className={styles.groupRowDot} style={{ background: color }} />
      <span className={styles.groupRowDesc}>{t.desc}</span>
      <span className={styles.groupRowDate}>{t.date}</span>
      <span className={`${styles.groupRowAmt} ${isCredit ? styles.credit : styles.debit}`}>
        {isCredit ? '+' : '-'}{fmt(t.amt)}
      </span>
      {isAdmin && (
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEdit}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.delBtn} onClick={onDelete}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.7 7.5A1 1 0 003.7 11h4.6a1 1 0 001-.95L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}