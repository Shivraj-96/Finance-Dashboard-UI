export const CAT_COLORS = {
  'Housing':       '#a78bfa',
  'Food & Dining': '#f59e0b',
  'Transport':     '#3b82f6',
  'Entertainment': '#f43f5e',
  'Shopping':      '#2dd4bf',
  'Utilities':     '#94a3b8',
  'Healthcare':    '#22c55e',
  'Income':        '#22c55e',
}

export const SUMMARY = [
  { key: 'balance', label: 'Total Balance',    value: '₹3,45,280', change: '+8.4% from last month',    up: true,  color: 'var(--amber)', bg: 'rgba(245,166,35,0.12)' },
  { key: 'income',  label: 'Monthly Income',   value: '₹1,00,000', change: '+17.6% — incl. freelance', up: true,  color: 'var(--green)', bg: 'rgba(34,197,94,0.12)'  },
  { key: 'expense', label: 'Monthly Expenses', value: '₹52,340',   change: '+6.2% from last month',    up: false, color: 'var(--red)',   bg: 'rgba(244,63,94,0.12)'  },
  { key: 'savings', label: 'Savings Rate',     value: '47.7%',     change: '₹47,660 saved this month', up: true,  color: 'var(--blue)',  bg: 'rgba(59,130,246,0.12)' },
]

export const MONTHS       = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
export const BALANCE_DATA = [210000, 238000, 215000, 265000, 298000, 345280]
export const INCOME_DATA  = [ 85000,  85000,  85000, 100000,  85000, 100000]
export const EXPENSE_DATA = [ 48200,  52000,  70000,  44200,  47800,  52340]

export const SPENDING = [
  { cat: 'Housing',       amt: 22000 },
  { cat: 'Food & Dining', amt:  8500 },
  { cat: 'Entertainment', amt:  5800 },
  { cat: 'Shopping',      amt:  6200 },
  { cat: 'Transport',     amt:  4200 },
  { cat: 'Utilities',     amt:  3100 },
  { cat: 'Healthcare',    amt:  2540 },
]

export const TRANSACTIONS = [
  { id: 1,  date: '28 Mar', desc: 'Salary — TechCorp',         cat: 'Income',        type: 'credit', amt: 85000 },
  { id: 2,  date: '28 Mar', desc: 'Freelance — Web Project',   cat: 'Income',        type: 'credit', amt: 15000 },
  { id: 3,  date: '27 Mar', desc: 'Monthly Rent',              cat: 'Housing',       type: 'debit',  amt: 22000 },
  { id: 4,  date: '26 Mar', desc: 'BigBasket',                 cat: 'Food & Dining', type: 'debit',  amt:  2340 },
  { id: 5,  date: '25 Mar', desc: 'Netflix Subscription',      cat: 'Entertainment', type: 'debit',  amt:   649 },
  { id: 6,  date: '24 Mar', desc: 'Myntra — Clothing',         cat: 'Shopping',      type: 'debit',  amt:  3200 },
  { id: 7,  date: '23 Mar', desc: 'Uber',                      cat: 'Transport',     type: 'debit',  amt:   340 },
  { id: 8,  date: '22 Mar', desc: 'Swiggy',                    cat: 'Food & Dining', type: 'debit',  amt:   680 },
  { id: 9,  date: '21 Mar', desc: 'Electricity Bill',          cat: 'Utilities',     type: 'debit',  amt:  1850 },
  { id: 10, date: '20 Mar', desc: 'PVR Cinemas',               cat: 'Entertainment', type: 'debit',  amt:   850 },
  { id: 11, date: '19 Mar', desc: 'Apollo Pharmacy',           cat: 'Healthcare',    type: 'debit',  amt:   890 },
  { id: 12, date: '18 Mar', desc: 'Amazon — Electronics',      cat: 'Shopping',      type: 'debit',  amt:  5400 },
  { id: 13, date: '17 Mar', desc: 'Zomato',                    cat: 'Food & Dining', type: 'debit',  amt:   450 },
  { id: 14, date: '15 Mar', desc: 'Rapido',                    cat: 'Transport',     type: 'debit',  amt:   180 },
  { id: 15, date: '14 Mar', desc: 'Internet Bill — Airtel',    cat: 'Utilities',     type: 'debit',  amt:   799 },
  { id: 16, date: '12 Mar', desc: 'Restaurant — La Terrasse',  cat: 'Food & Dining', type: 'debit',  amt:  2400 },
  { id: 17, date: '10 Mar', desc: 'Max Healthcare',            cat: 'Healthcare',    type: 'debit',  amt:  1650 },
  { id: 18, date: '08 Mar', desc: 'Spotify',                   cat: 'Entertainment', type: 'debit',  amt:   119 },
  { id: 19, date: '06 Mar', desc: 'Nykaa',                     cat: 'Shopping',      type: 'debit',  amt:  1200 },
  { id: 20, date: '04 Mar', desc: 'OLA — Airport',             cat: 'Transport',     type: 'debit',  amt:   780 },
]

export const CATEGORIES = [...new Set(TRANSACTIONS.map(t => t.cat))].filter(c => c !== 'Income')
export const fmt = v => '₹' + v.toLocaleString('en-IN')