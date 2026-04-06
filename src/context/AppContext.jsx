import React, { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react'
import { TRANSACTIONS } from '../data/mockData'

// ─── Mock API Layer ────────────────────────────────────────────────────────────
// Simulates network latency for realistic API behaviour
const mockApi = {
  delay: (ms = 400) => new Promise(res => setTimeout(res, ms)),

  async fetchTransactions() {
    await this.delay(600)
    const saved = localStorage.getItem('fintrack_transactions')
    return saved ? JSON.parse(saved) : TRANSACTIONS
  },

  async saveTransaction(txn) {
    await this.delay(300)
    return { ...txn, id: txn.id || Date.now() }
  },

  async deleteTransaction(id) {
    await this.delay(200)
    return { success: true, id }
  },
}

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  role:         'viewer',
  transactions: TRANSACTIONS,
  filters:      { query: '', category: '', type: '', sortBy: 'date', sortDir: 'desc' },
  theme:        'dark',
  apiStatus:    'idle',   // 'idle' | 'loading' | 'success' | 'error'
  apiError:     null,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } }

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }

    case 'SET_THEME':
      return { ...state, theme: action.payload }

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }

    case 'API_LOADING':
      return { ...state, apiStatus: 'loading', apiError: null }

    case 'API_SUCCESS':
      return { ...state, apiStatus: 'success', apiError: null }

    case 'API_ERROR':
      return { ...state, apiStatus: 'error', apiError: action.payload }

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      }

    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Hydrate theme from localStorage before first render
  const savedTheme = localStorage.getItem('fintrack_theme') || 'dark'

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    theme: savedTheme,
  })

  // ── Apply theme class to <html> ──────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('light', state.theme === 'light')
    localStorage.setItem('fintrack_theme', state.theme)
  }, [state.theme])

  // ── Persist transactions to localStorage whenever they change ────────────
  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(state.transactions))
  }, [state.transactions])

  // ── Persist role to localStorage ─────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('fintrack_role', state.role)
  }, [state.role])

  // ── Bootstrap: load transactions via mock API on mount ───────────────────
  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'API_LOADING' })
    mockApi.fetchTransactions()
      .then(data => {
        if (!cancelled) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: data })
          dispatch({ type: 'API_SUCCESS' })
        }
      })
      .catch(err => {
        if (!cancelled) dispatch({ type: 'API_ERROR', payload: err.message })
      })
    return () => { cancelled = true }
  }, [])

  // ─── Derived: filtered + sorted transaction list ─────────────────────────
  const filteredTransactions = useMemo(() => {
    const { query, category, type, sortBy, sortDir } = state.filters
    const q = query.toLowerCase()

    let list = state.transactions.filter(t =>
      (!q        || t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)) &&
      (!category || t.cat  === category) &&
      (!type     || t.type === type)
    )

    return [...list].sort((a, b) => {
      let va, vb
      if (sortBy === 'amount')        { va = a.amt; vb = b.amt }
      else if (sortBy === 'category') { va = a.cat; vb = b.cat }
      else                            { va = a.id;  vb = b.id  }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
  }, [state.transactions, state.filters])

  // ─── Derived: financial insights ─────────────────────────────────────────
  const insights = useMemo(() => {
    const expenses = state.transactions.filter(t => t.type === 'debit')
    const income   = state.transactions.filter(t => t.type === 'credit')

    const byCategory = {}
    expenses.forEach(t => { byCategory[t.cat] = (byCategory[t.cat] || 0) + t.amt })

    const topCat       = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
    const totalExpense = expenses.reduce((s, t) => s + t.amt, 0)
    const totalIncome  = income.reduce((s, t)   => s + t.amt, 0)
    const savingsRate  = totalIncome ? (totalIncome - totalExpense) / totalIncome * 100 : 0
    const largest      = [...state.transactions].sort((a, b) => b.amt - a.amt)[0]
    const avgExpense   = expenses.length ? totalExpense / expenses.length : 0

    return { topCat, totalExpense, totalIncome, savingsRate, largest, avgExpense, byCategory }
  }, [state.transactions])

  // ─── Export helpers ───────────────────────────────────────────────────────
  const exportCSV = useCallback((rows = state.transactions) => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount']
    const lines = [
      headers.join(','),
      ...rows.map(t =>
        [t.id, `"${t.date}"`, `"${t.desc}"`, `"${t.cat}"`, t.type, t.amt].join(',')
      ),
    ]
    triggerDownload(lines.join('\n'), 'fintrack_transactions.csv', 'text/csv')
  }, [state.transactions])

  const exportJSON = useCallback((rows = state.transactions) => {
    triggerDownload(JSON.stringify(rows, null, 2), 'fintrack_transactions.json', 'application/json')
  }, [state.transactions])

  function triggerDownload(content, filename, type) {
    const blob = new Blob([content], { type })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  // ─── Actions ─────────────────────────────────────────────────────────────
  const actions = {
    setRole:      role  => dispatch({ type: 'SET_ROLE', payload: role }),
    setFilter:    (k,v) => dispatch({ type: 'SET_FILTER', key: k, value: v }),
    resetFilters: ()    => dispatch({ type: 'RESET_FILTERS' }),
    toggleTheme:  ()    => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' }),

    addTransaction: async txn => {
      dispatch({ type: 'API_LOADING' })
      try {
        const saved = await mockApi.saveTransaction(txn)
        dispatch({ type: 'ADD_TRANSACTION', payload: saved })
        dispatch({ type: 'API_SUCCESS' })
      } catch (err) {
        dispatch({ type: 'API_ERROR', payload: err.message })
      }
    },

    editTransaction: async txn => {
      dispatch({ type: 'API_LOADING' })
      try {
        const saved = await mockApi.saveTransaction(txn)
        dispatch({ type: 'EDIT_TRANSACTION', payload: saved })
        dispatch({ type: 'API_SUCCESS' })
      } catch (err) {
        dispatch({ type: 'API_ERROR', payload: err.message })
      }
    },

    deleteTransaction: async id => {
      dispatch({ type: 'API_LOADING' })
      try {
        await mockApi.deleteTransaction(id)
        dispatch({ type: 'DELETE_TRANSACTION', payload: id })
        dispatch({ type: 'API_SUCCESS' })
      } catch (err) {
        dispatch({ type: 'API_ERROR', payload: err.message })
      }
    },

    exportCSV,
    exportJSON,
  }

  return (
    <AppContext.Provider value={{ state, filteredTransactions, insights, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}