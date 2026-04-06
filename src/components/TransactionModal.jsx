import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { CAT_COLORS } from '../data/mockData'
import styles from './TransactionModal.module.css'

const CATS = Object.keys(CAT_COLORS).filter(c => c !== 'Income')
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const empty = { desc:'', cat:'Food & Dining', type:'debit', amt:'', date:'' }

export default function TransactionModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useApp()
  const isEdit = Boolean(existing)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) setForm({ ...existing, amt: String(existing.amt) })
    else { const now = new Date(); setForm({ ...empty, date: `${now.getDate()} ${MONTHS[now.getMonth()]}` }) }
  }, [existing])

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function submit() {
    if (!form.desc.trim()) return setError('Description is required.')
    const amt = parseFloat(form.amt)
    if (!amt || amt <= 0) return setError('Enter a valid amount.')
    if (!form.date.trim()) return setError('Date is required.')
    const payload = { ...form, amt, cat: form.type === 'credit' ? 'Income' : form.cat }
    isEdit ? editTransaction(payload) : addTransaction(payload)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</span>
          <button className={styles.close} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className={styles.body}>
          {error && <div className={styles.error}>{error}</div>}
          <label className={styles.label}>Description</label>
          <input className={styles.input} value={form.desc} onChange={e => { set('desc', e.target.value); setError('') }} placeholder="e.g. Grocery run" />
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Type</label>
              <div className={styles.toggle}>
                {['debit','credit'].map(t => (
                  <button key={t} className={`${styles.toggleBtn} ${form.type===t?styles.toggleActive:''}`}
                    style={form.type===t?{background:t==='credit'?'var(--green)':'var(--red)',color:'#fff'}:{}} onClick={() => set('type',t)} type="button">
                    {t==='credit'?'Income':'Expense'}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Amount (₹)</label>
              <input className={styles.input} type="number" min="1" value={form.amt} onChange={e => { set('amt', e.target.value); setError('') }} placeholder="0" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.cat==='Income'?'Food & Dining':form.cat} onChange={e => set('cat',e.target.value)} disabled={form.type==='credit'}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input className={styles.input} value={form.date} onChange={e => set('date',e.target.value)} placeholder="e.g. 01 Apr" />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={submit}>{isEdit?'Save Changes':'Add Transaction'}</button>
        </div>
      </div>
    </div>
  )
}