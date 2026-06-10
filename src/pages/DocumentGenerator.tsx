import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Package, ClipboardList, Plus, Trash2, Printer, Copy, Upload, Lock } from 'lucide-react'
import { useProfile } from '../contexts/ProfileContext'
import { useIsMobile } from '../hooks/useIsMobile'

// ── Style constants ────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f8fafc',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(248,250,252,0.45)',
  fontWeight: 600,
  display: 'block',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  padding: '24px',
}

const SECTION_TITLE: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: 'rgba(248,250,252,0.35)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '14px',
}

const BTN_PRIMARY: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}

const BTN_GHOST: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  background: 'rgba(255,255,255,0.06)',
  color: '#f8fafc',
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer',
}

const BTN_DANGER: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'rgba(248,250,252,0.35)',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
}

// ── Types ──────────────────────────────────────────────────────────────────

type Tab = 'invoice' | 'packing' | 'shipping'

interface SharedParty {
  shipperName: string
  shipperAddress: string
  shipperCity: string
  shipperCountry: string
  consigneeName: string
  consigneeAddress: string
  consigneeCity: string
  consigneeCountry: string
}

interface InvoiceItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  hsCode: string
}

interface InvoiceState {
  invoiceNo: string
  invoiceDate: string
  incoterms: string
  paymentTerms: string
  currency: string
  bankDetails: string
  items: InvoiceItem[]
}

interface PackingRow {
  id: string
  markNumber: string
  description: string
  qty: number
  grossWeight: number
  netWeight: number
  dimensions: string
}

interface PackingState {
  packingNo: string
  date: string
  rows: PackingRow[]
}

interface ShippingState {
  bookingRef: string
  vesselFlight: string
  portLoading: string
  portDischarge: string
  cargoDescription: string
  containerType: string
  specialInstructions: string
}

const LS_KEY = 'trackora_docgen_v1'

const DEFAULT_SHARED: SharedParty = {
  shipperName: '', shipperAddress: '', shipperCity: '', shipperCountry: '',
  consigneeName: '', consigneeAddress: '', consigneeCity: '', consigneeCountry: '',
}

function newInvoiceItem(): InvoiceItem {
  return { id: crypto.randomUUID(), description: '', qty: 1, unitPrice: 0, hsCode: '' }
}

function newPackingRow(): PackingRow {
  return { id: crypto.randomUUID(), markNumber: '', description: '', qty: 1, grossWeight: 0, netWeight: 0, dimensions: '' }
}

const DEFAULT_INVOICE: InvoiceState = {
  invoiceNo: '', invoiceDate: new Date().toISOString().slice(0, 10),
  incoterms: 'FOB', paymentTerms: '', currency: 'USD', bankDetails: '',
  items: [newInvoiceItem()],
}

const DEFAULT_PACKING: PackingState = {
  packingNo: '', date: new Date().toISOString().slice(0, 10),
  rows: [newPackingRow()],
}

const DEFAULT_SHIPPING: ShippingState = {
  bookingRef: '', vesselFlight: '', portLoading: '', portDischarge: '',
  cargoDescription: '', containerType: '20ft GP', specialInstructions: '',
}

// ── Small helpers ──────────────────────────────────────────────────────────

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

function loadLS(): Partial<SharedParty> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Partial<SharedParty>
  } catch { /* ignore */ }
  return {}
}

// ── Field helper ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

// ── Preview styles ─────────────────────────────────────────────────────────

const PREVIEW_DOC: React.CSSProperties = {
  background: '#fff',
  color: '#111',
  borderRadius: '10px',
  padding: '32px',
  fontSize: '11px',
  lineHeight: 1.5,
  fontFamily: 'Georgia, serif',
  minHeight: '500px',
}

const PREVIEW_H1: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '20px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#111',
}

const PREVIEW_TH: React.CSSProperties = {
  padding: '6px 8px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid #111',
  color: '#111',
}

const PREVIEW_TD: React.CSSProperties = {
  padding: '5px 8px',
  borderBottom: '1px solid #e5e7eb',
  color: '#111',
  fontSize: '11px',
}

// ══════════════════════════════════════════════════════════════════════════
// COMMERCIAL INVOICE
// ══════════════════════════════════════════════════════════════════════════

function InvoiceForm({
  state, onChange, shared, onSharedChange,
}: {
  state: InvoiceState
  onChange: (s: InvoiceState) => void
  shared: SharedParty
  onSharedChange: (s: SharedParty) => void
}) {
  function setField<K extends keyof InvoiceState>(k: K, v: InvoiceState[K]) {
    onChange({ ...state, [k]: v })
  }

  function setItem(id: string, key: keyof InvoiceItem, val: string | number) {
    onChange({
      ...state,
      items: state.items.map(i => i.id === id ? { ...i, [key]: val } : i),
    })
  }

  function addItem() {
    onChange({ ...state, items: [...state.items, newInvoiceItem()] })
  }

  function removeItem(id: string) {
    if (state.items.length === 1) return
    onChange({ ...state, items: state.items.filter(i => i.id !== id) })
  }

  return (
    <div>
      <p style={SECTION_TITLE}>Shipper / Exporter</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.shipperName} onChange={e => onSharedChange({ ...shared, shipperName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.shipperAddress} onChange={e => onSharedChange({ ...shared, shipperAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.shipperCity} onChange={e => onSharedChange({ ...shared, shipperCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.shipperCountry} onChange={e => onSharedChange({ ...shared, shipperCountry: e.target.value })} /></Field>
      </div>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Consignee / Importer</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.consigneeName} onChange={e => onSharedChange({ ...shared, consigneeName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.consigneeAddress} onChange={e => onSharedChange({ ...shared, consigneeAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.consigneeCity} onChange={e => onSharedChange({ ...shared, consigneeCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.consigneeCountry} onChange={e => onSharedChange({ ...shared, consigneeCountry: e.target.value })} /></Field>
      </div>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Invoice Details</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Invoice #"><input style={INPUT_STYLE} value={state.invoiceNo} onChange={e => setField('invoiceNo', e.target.value)} /></Field>
        <Field label="Invoice Date"><input type="date" style={INPUT_STYLE} value={state.invoiceDate} onChange={e => setField('invoiceDate', e.target.value)} /></Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Incoterms">
          <select style={INPUT_STYLE} value={state.incoterms} onChange={e => setField('incoterms', e.target.value)}>
            {['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP', 'FCA'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Currency">
          <select style={INPUT_STYLE} value={state.currency} onChange={e => setField('currency', e.target.value)}>
            {['USD', 'EUR', 'AED', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Payment Terms"><input style={INPUT_STYLE} value={state.paymentTerms} onChange={e => setField('paymentTerms', e.target.value)} placeholder="e.g. T/T 30 days" /></Field>
      <Field label="HS Code (optional)">
        <input style={INPUT_STYLE} value={state.items[0]?.hsCode ?? ''} onChange={e => setItem(state.items[0].id, 'hsCode', e.target.value)} placeholder="e.g. 8471.30" />
      </Field>
      <Field label="Bank Details (optional)">
        <textarea style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '72px' }} value={state.bankDetails} onChange={e => setField('bankDetails', e.target.value)} placeholder="Bank name, IBAN, SWIFT..." />
      </Field>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Line Items</p>
      {state.items.map((item, idx) => (
        <div key={item.id} style={{ ...CARD_STYLE, padding: '14px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)', fontWeight: 600 }}>Item {idx + 1}</span>
            <button style={BTN_DANGER} onClick={() => removeItem(item.id)} title="Remove"><Trash2 size={14} /></button>
          </div>
          <Field label="Description"><input style={INPUT_STYLE} value={item.description} onChange={e => setItem(item.id, 'description', e.target.value)} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Field label="Qty"><input type="number" min={1} style={INPUT_STYLE} value={item.qty} onChange={e => setItem(item.id, 'qty', Number(e.target.value))} /></Field>
            <Field label="Unit Price"><input type="number" min={0} step="0.01" style={INPUT_STYLE} value={item.unitPrice} onChange={e => setItem(item.id, 'unitPrice', Number(e.target.value))} /></Field>
          </div>
          <div style={{ fontSize: '12px', color: '#22d3ee', textAlign: 'right', marginTop: '4px' }}>
            Total: {fmt(item.qty * item.unitPrice, state.currency)}
          </div>
        </div>
      ))}
      <button style={BTN_GHOST} onClick={addItem}><Plus size={14} /> Add Item</button>
    </div>
  )
}

function InvoicePreview({ state, shared, logo }: { state: InvoiceState; shared: SharedParty; logo: string | null }) {
  const subtotal = state.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)

  return (
    <div style={PREVIEW_DOC}>
      {logo && <img src={logo} alt="logo" style={{ maxWidth: '80px', maxHeight: '80px', marginBottom: '12px' }} />}
      <p style={PREVIEW_H1}>Commercial Invoice</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Shipper / Exporter</p>
          <p>{shared.shipperName || '—'}</p>
          <p>{shared.shipperAddress}</p>
          <p>{[shared.shipperCity, shared.shipperCountry].filter(Boolean).join(', ')}</p>
        </div>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Consignee / Importer</p>
          <p>{shared.consigneeName || '—'}</p>
          <p>{shared.consigneeAddress}</p>
          <p>{[shared.consigneeCity, shared.consigneeCountry].filter(Boolean).join(', ')}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
        <div><span style={{ fontWeight: 700 }}>Invoice No: </span>{state.invoiceNo || '—'}</div>
        <div><span style={{ fontWeight: 700 }}>Date: </span>{state.invoiceDate || '—'}</div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <thead>
          <tr>
            <th style={PREVIEW_TH}>Description</th>
            <th style={PREVIEW_TH}>HS Code</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Qty</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Unit Price</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {state.items.map(item => (
            <tr key={item.id}>
              <td style={PREVIEW_TD}>{item.description || '—'}</td>
              <td style={PREVIEW_TD}>{item.hsCode || '—'}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{item.qty}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{fmt(item.unitPrice, state.currency)}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{fmt(item.qty * item.unitPrice, state.currency)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ ...PREVIEW_TD, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #111' }}>Subtotal</td>
            <td style={{ ...PREVIEW_TD, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #111' }}>{fmt(subtotal, state.currency)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div><span style={{ fontWeight: 700 }}>Incoterms: </span>{state.incoterms}</div>
        <div><span style={{ fontWeight: 700 }}>Payment Terms: </span>{state.paymentTerms || '—'}</div>
      </div>

      {state.bankDetails && (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px', marginTop: '10px' }}>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Bank Details</p>
          <p style={{ whiteSpace: 'pre-line' }}>{state.bankDetails}</p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PACKING LIST
// ══════════════════════════════════════════════════════════════════════════

function PackingForm({
  state, onChange, shared, onSharedChange,
}: {
  state: PackingState
  onChange: (s: PackingState) => void
  shared: SharedParty
  onSharedChange: (s: SharedParty) => void
}) {
  function setRow(id: string, key: keyof PackingRow, val: string | number) {
    onChange({ ...state, rows: state.rows.map(r => r.id === id ? { ...r, [key]: val } : r) })
  }

  function addRow() { onChange({ ...state, rows: [...state.rows, newPackingRow()] }) }

  function removeRow(id: string) {
    if (state.rows.length === 1) return
    onChange({ ...state, rows: state.rows.filter(r => r.id !== id) })
  }

  return (
    <div>
      <p style={SECTION_TITLE}>Shipper / Exporter</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.shipperName} onChange={e => onSharedChange({ ...shared, shipperName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.shipperAddress} onChange={e => onSharedChange({ ...shared, shipperAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.shipperCity} onChange={e => onSharedChange({ ...shared, shipperCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.shipperCountry} onChange={e => onSharedChange({ ...shared, shipperCountry: e.target.value })} /></Field>
      </div>
      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Consignee / Importer</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.consigneeName} onChange={e => onSharedChange({ ...shared, consigneeName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.consigneeAddress} onChange={e => onSharedChange({ ...shared, consigneeAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.consigneeCity} onChange={e => onSharedChange({ ...shared, consigneeCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.consigneeCountry} onChange={e => onSharedChange({ ...shared, consigneeCountry: e.target.value })} /></Field>
      </div>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Packing List Details</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Packing List #"><input style={INPUT_STYLE} value={state.packingNo} onChange={e => onChange({ ...state, packingNo: e.target.value })} /></Field>
        <Field label="Date"><input type="date" style={INPUT_STYLE} value={state.date} onChange={e => onChange({ ...state, date: e.target.value })} /></Field>
      </div>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Packing Rows</p>
      {state.rows.map((row, idx) => (
        <div key={row.id} style={{ ...CARD_STYLE, padding: '14px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)', fontWeight: 600 }}>Package {idx + 1}</span>
            <button style={BTN_DANGER} onClick={() => removeRow(row.id)}><Trash2 size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Field label="Mark / Number"><input style={INPUT_STYLE} value={row.markNumber} onChange={e => setRow(row.id, 'markNumber', e.target.value)} /></Field>
            <Field label="Description"><input style={INPUT_STYLE} value={row.description} onChange={e => setRow(row.id, 'description', e.target.value)} /></Field>
            <Field label="Qty"><input type="number" min={1} style={INPUT_STYLE} value={row.qty} onChange={e => setRow(row.id, 'qty', Number(e.target.value))} /></Field>
            <Field label="Gross Weight (kg)"><input type="number" min={0} step="0.01" style={INPUT_STYLE} value={row.grossWeight} onChange={e => setRow(row.id, 'grossWeight', Number(e.target.value))} /></Field>
            <Field label="Net Weight (kg)"><input type="number" min={0} step="0.01" style={INPUT_STYLE} value={row.netWeight} onChange={e => setRow(row.id, 'netWeight', Number(e.target.value))} /></Field>
            <Field label="Dimensions (LxWxH cm)"><input style={INPUT_STYLE} value={row.dimensions} onChange={e => setRow(row.id, 'dimensions', e.target.value)} placeholder="e.g. 40x30x20" /></Field>
          </div>
        </div>
      ))}
      <button style={BTN_GHOST} onClick={addRow}><Plus size={14} /> Add Row</button>
    </div>
  )
}

function PackingPreview({ state, shared, logo }: { state: PackingState; shared: SharedParty; logo: string | null }) {
  const totalGross = state.rows.reduce((s, r) => s + r.grossWeight, 0)
  const totalNet = state.rows.reduce((s, r) => s + r.netWeight, 0)
  const totalQty = state.rows.reduce((s, r) => s + r.qty, 0)

  return (
    <div style={PREVIEW_DOC}>
      {logo && <img src={logo} alt="logo" style={{ maxWidth: '80px', maxHeight: '80px', marginBottom: '12px' }} />}
      <p style={PREVIEW_H1}>Packing List</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Shipper</p>
          <p>{shared.shipperName || '—'}</p>
          <p>{shared.shipperAddress}</p>
          <p>{[shared.shipperCity, shared.shipperCountry].filter(Boolean).join(', ')}</p>
        </div>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>Consignee</p>
          <p>{shared.consigneeName || '—'}</p>
          <p>{shared.consigneeAddress}</p>
          <p>{[shared.consigneeCity, shared.consigneeCountry].filter(Boolean).join(', ')}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontWeight: 700 }}>Packing List No: </span>{state.packingNo || '—'}
        &nbsp;&nbsp;&nbsp;
        <span style={{ fontWeight: 700 }}>Date: </span>{state.date || '—'}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <thead>
          <tr>
            <th style={PREVIEW_TH}>Mark/No.</th>
            <th style={PREVIEW_TH}>Description</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Qty</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Gross (kg)</th>
            <th style={{ ...PREVIEW_TH, textAlign: 'right' }}>Net (kg)</th>
            <th style={PREVIEW_TH}>Dims (cm)</th>
          </tr>
        </thead>
        <tbody>
          {state.rows.map(row => (
            <tr key={row.id}>
              <td style={PREVIEW_TD}>{row.markNumber || '—'}</td>
              <td style={PREVIEW_TD}>{row.description || '—'}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{row.qty}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{row.grossWeight.toFixed(2)}</td>
              <td style={{ ...PREVIEW_TD, textAlign: 'right' }}>{row.netWeight.toFixed(2)}</td>
              <td style={PREVIEW_TD}>{row.dimensions || '—'}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ ...PREVIEW_TD, fontWeight: 700, borderTop: '2px solid #111' }}>Totals</td>
            <td style={{ ...PREVIEW_TD, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #111' }}>{totalQty}</td>
            <td style={{ ...PREVIEW_TD, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #111' }}>{totalGross.toFixed(2)}</td>
            <td style={{ ...PREVIEW_TD, fontWeight: 700, textAlign: 'right', borderTop: '2px solid #111' }}>{totalNet.toFixed(2)}</td>
            <td style={{ ...PREVIEW_TD, borderTop: '2px solid #111' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// SHIPPING INSTRUCTIONS
// ══════════════════════════════════════════════════════════════════════════

function ShippingForm({
  state, onChange, shared, onSharedChange,
}: {
  state: ShippingState
  onChange: (s: ShippingState) => void
  shared: SharedParty
  onSharedChange: (s: SharedParty) => void
}) {
  function set<K extends keyof ShippingState>(k: K, v: ShippingState[K]) {
    onChange({ ...state, [k]: v })
  }

  return (
    <div>
      <p style={SECTION_TITLE}>Shipper / Exporter</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.shipperName} onChange={e => onSharedChange({ ...shared, shipperName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.shipperAddress} onChange={e => onSharedChange({ ...shared, shipperAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.shipperCity} onChange={e => onSharedChange({ ...shared, shipperCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.shipperCountry} onChange={e => onSharedChange({ ...shared, shipperCountry: e.target.value })} /></Field>
      </div>
      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Consignee / Notify Party</p>
      <Field label="Name"><input style={INPUT_STYLE} value={shared.consigneeName} onChange={e => onSharedChange({ ...shared, consigneeName: e.target.value })} /></Field>
      <Field label="Address"><input style={INPUT_STYLE} value={shared.consigneeAddress} onChange={e => onSharedChange({ ...shared, consigneeAddress: e.target.value })} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City"><input style={INPUT_STYLE} value={shared.consigneeCity} onChange={e => onSharedChange({ ...shared, consigneeCity: e.target.value })} /></Field>
        <Field label="Country"><input style={INPUT_STYLE} value={shared.consigneeCountry} onChange={e => onSharedChange({ ...shared, consigneeCountry: e.target.value })} /></Field>
      </div>

      <p style={{ ...SECTION_TITLE, marginTop: '8px' }}>Shipment Details</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Booking Ref"><input style={INPUT_STYLE} value={state.bookingRef} onChange={e => set('bookingRef', e.target.value)} /></Field>
        <Field label="Vessel / Flight (optional)"><input style={INPUT_STYLE} value={state.vesselFlight} onChange={e => set('vesselFlight', e.target.value)} /></Field>
        <Field label="Port of Loading"><input style={INPUT_STYLE} value={state.portLoading} onChange={e => set('portLoading', e.target.value)} /></Field>
        <Field label="Port of Discharge"><input style={INPUT_STYLE} value={state.portDischarge} onChange={e => set('portDischarge', e.target.value)} /></Field>
      </div>
      <Field label="Cargo Description">
        <textarea style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '64px' }} value={state.cargoDescription} onChange={e => set('cargoDescription', e.target.value)} />
      </Field>
      <Field label="Container Type">
        <select style={INPUT_STYLE} value={state.containerType} onChange={e => set('containerType', e.target.value)}>
          {['20ft GP', '40ft GP', '40ft HC', 'LCL'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Special Instructions">
        <textarea style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '72px' }} value={state.specialInstructions} onChange={e => set('specialInstructions', e.target.value)} />
      </Field>
    </div>
  )
}

function ShippingPreview({ state, shared, logo }: { state: ShippingState; shared: SharedParty; logo: string | null }) {
  function section(title: string, value: string) {
    return (
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#555', marginBottom: '3px' }}>{title}</p>
        <p style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>{value || '—'}</p>
      </div>
    )
  }

  return (
    <div style={PREVIEW_DOC}>
      {logo && <img src={logo} alt="logo" style={{ maxWidth: '80px', maxHeight: '80px', marginBottom: '12px' }} />}
      <p style={PREVIEW_H1}>Shipping Instructions</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '6px' }}>Shipper</p>
          <p>{shared.shipperName || '—'}</p>
          <p>{shared.shipperAddress}</p>
          <p>{[shared.shipperCity, shared.shipperCountry].filter(Boolean).join(', ')}</p>
        </div>
        <div>
          <p style={{ fontWeight: 700, marginBottom: '6px' }}>Consignee / Notify Party</p>
          <p>{shared.consigneeName || '—'}</p>
          <p>{shared.consigneeAddress}</p>
          <p>{[shared.consigneeCity, shared.consigneeCountry].filter(Boolean).join(', ')}</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          {section('Booking Reference', state.bookingRef)}
          {section('Vessel / Flight', state.vesselFlight)}
          {section('Port of Loading', state.portLoading)}
          {section('Port of Discharge', state.portDischarge)}
          {section('Container Type', state.containerType)}
        </div>
        {section('Cargo Description', state.cargoDescription)}
        {state.specialInstructions && section('Special Instructions', state.specialInstructions)}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════

export default function DocumentGenerator() {
  const { profile } = useProfile()
  const isMobile = useIsMobile()
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<Tab>('invoice')
  const [logo, setLogo] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [shared, setSharedRaw] = useState<SharedParty>(() => ({
    ...DEFAULT_SHARED,
    ...loadLS(),
  }))

  const [invoice, setInvoice] = useState<InvoiceState>(DEFAULT_INVOICE)
  const [packing, setPacking] = useState<PackingState>(DEFAULT_PACKING)
  const [shipping, setShipping] = useState<ShippingState>(DEFAULT_SHIPPING)

  // SEO
  useEffect(() => {
    document.title = 'Logistics Document Generator — Commercial Invoice & Packing List | Trackora'
  }, [])

  // Persist shared to localStorage
  const setShared = useCallback((s: SharedParty) => {
    setSharedRaw(s)
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)) } catch { /* ignore */ }
  }, [])

  // ── Pro gate ────────────────────────────────────────────────────────────
  const isPro = profile?.plan_tier === 'pro' || profile?.plan_tier === 'business'

  if (!isPro) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <style>{`@media print { .no-print { display:none!important } .print-only { display:block } }`}</style>
        <div style={{ ...CARD_STYLE, maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 36px' }} className="no-print">
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Lock size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>Pro Feature</h2>
          <p style={{ color: 'rgba(248,250,252,0.55)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
            This tool requires a <strong style={{ color: '#f8fafc' }}>Pro</strong> or <strong style={{ color: '#f8fafc' }}>Business</strong> plan. Upgrade to generate commercial invoices, packing lists, and shipping instructions.
          </p>
          <Link to="/plans" style={{
            display: 'inline-block', padding: '12px 28px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
            fontWeight: 700, fontSize: '15px', textDecoration: 'none',
          }}>
            View Plans
          </Link>
        </div>
      </div>
    )
  }

  // ── Logo upload ─────────────────────────────────────────────────────────
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogo(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  function handlePrint() {
    window.print()
  }

  function handleCopy() {
    if (!previewRef.current) return
    const text = previewRef.current.innerText ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Tab meta ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'invoice', label: 'Commercial Invoice', icon: <FileText size={15} /> },
    { id: 'packing', label: 'Packing List', icon: <Package size={15} /> },
    { id: 'shipping', label: 'Shipping Instructions', icon: <ClipboardList size={15} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#f8fafc', padding: isMobile ? '80px 16px 40px' : '100px 32px 60px' }}>
      <style>{`@media print { .no-print { display:none!important } .print-only { display:block } }`}</style>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 32px' }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Logistics Document Generator
            </h1>
            <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '14px', margin: 0 }}>
              Generate professional trade documents instantly
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }} className="no-print">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: activeTab === t.id ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.05)',
                color: activeTab === t.id ? '#fff' : 'rgba(248,250,252,0.6)',
                border: activeTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Two-panel layout */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '24px',
          alignItems: 'flex-start',
        }}>
          {/* Left: Form */}
          <div
            className="no-print"
            style={{
              flex: isMobile ? 'unset' : '0 0 44%',
              width: isMobile ? '100%' : '44%',
              ...CARD_STYLE,
              maxHeight: isMobile ? 'unset' : '82vh',
              overflowY: isMobile ? 'visible' : 'auto',
            }}
          >
            {activeTab === 'invoice' && (
              <InvoiceForm state={invoice} onChange={setInvoice} shared={shared} onSharedChange={setShared} />
            )}
            {activeTab === 'packing' && (
              <PackingForm state={packing} onChange={setPacking} shared={shared} onSharedChange={setShared} />
            )}
            {activeTab === 'shipping' && (
              <ShippingForm state={shipping} onChange={setShipping} shared={shared} onSharedChange={setShared} />
            )}
          </div>

          {/* Right: Preview */}
          <div style={{ flex: isMobile ? 'unset' : '0 0 calc(56% - 24px)', width: isMobile ? '100%' : 'calc(56% - 24px)' }}>
            {/* Logo upload + actions */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <button style={BTN_GHOST} onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} /> {logo ? 'Change Logo' : 'Upload Logo'}
              </button>
              {logo && (
                <button style={{ ...BTN_GHOST, color: 'rgba(248,250,252,0.45)' }} onClick={() => setLogo(null)}>
                  Remove Logo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleLogoUpload}
              />
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button style={BTN_GHOST} onClick={handlePrint}><Printer size={14} /> Print / Download PDF</button>
                <button style={BTN_PRIMARY} onClick={handleCopy}>
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy as Text'}
                </button>
              </div>
            </div>

            {/* Preview document */}
            <div ref={previewRef} className="print-only" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {activeTab === 'invoice' && <InvoicePreview state={invoice} shared={shared} logo={logo} />}
              {activeTab === 'packing' && <PackingPreview state={packing} shared={shared} logo={logo} />}
              {activeTab === 'shipping' && <ShippingPreview state={shipping} shared={shared} logo={logo} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
