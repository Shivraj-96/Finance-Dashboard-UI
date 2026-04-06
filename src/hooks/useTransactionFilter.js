import { useState, useMemo } from 'react'
import { TRANSACTIONS } from '../data/mockData'

export function useTransactionFilter() {
  const [query,   setQuery]   = useState('')
  const [catFilter, setCat]   = useState('')
  const [typeFilter, setType] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return TRANSACTIONS.filter(t =>
      (!q          || t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)) &&
      (!catFilter  || t.cat  === catFilter) &&
      (!typeFilter || t.type === typeFilter)
    )
  }, [query, catFilter, typeFilter])

  return { filtered, query, setQuery, catFilter, setCat, typeFilter, setType }
}
