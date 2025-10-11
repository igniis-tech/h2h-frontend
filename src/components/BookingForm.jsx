// src/components/BookingForm.jsx
import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { submitBooking } from '../api'
import { useAuth } from '../state/AuthContext'

export default function BookingForm() {
  const { token } = useAuth()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    date: '',
    package: 'Standard',
    adults: 2,
    kids: 0,
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const canNext = useMemo(() => {
    if (step === 0) return !!form.date
    if (step === 1) return !!form.package
    if (step === 2) return !!form.name && !!form.email
    return true
  }, [step, form])

  const next = () => setStep((s) => Math.min(s + 1, 3))
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setSaving(true)
    try {
      const payload = { ...form, createdAt: new Date().toISOString() }
      const res = await submitBooking(payload, token)
      setResult(res)
      setStep(4)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-semibold mb-4">Book Your Unforgettable Escape</h3>

      {!token && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
          Tip: Login first for faster checkout. You can still book without logging in.
        </p>
      )}

      {step <= 3 && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          {['Dates', 'Package', 'Details', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={
                  'px-2 py-1 rounded-full ' +
                  (i <= step ? 'bg-leaf text-white' : 'bg-slate-100')
                }
              >
                {i + 1}
              </span>
              <span className={i === step ? 'font-medium' : ''}>{s}</span>
              {i < 3 && <span className="opacity-40">›</span>}
            </div>
          ))}
        </div>
      )}

      {step === 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Select Your Travel Date</label>
            <input
              type="date"
              min={dayjs().format('YYYY-MM-DD')}
              value={form.date}
              onChange={handle('date')}
              className="input"
            />
          </div>
          <div>
            <label className="label">Guests (Adults)</label>
            <input
              type="number"
              min="1"
              value={form.adults}
              onChange={handle('adults')}
              className="input"
            />
          </div>
          <div>
            <label className="label">Guests (Kids)</label>
            <input
              type="number"
              min="0"
              value={form.kids}
              onChange={handle('kids')}
              className="input"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Package</label>
            <select value={form.package} onChange={handle('package')} className="input">
              <option>Standard</option>
              <option>Adventure</option>
              <option>Luxury Retreat</option>
            </select>
          </div>
          <div>
            <label className="label">Special Notes</label>
            <input
              value={form.notes}
              onChange={handle('notes')}
              placeholder="Allergies, room preference, etc."
              className="input"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input value={form.name} onChange={handle('name')} className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={form.email} onChange={handle('email')} className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={form.phone} onChange={handle('phone')} className="input" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-2 text-slate-700">
          <div>
            <span className="font-medium">Date:</span> {form.date || '-'}
          </div>
          <div>
            <span className="font-medium">Package:</span> {form.package}
          </div>
          <div>
            <span className="font-medium">Guests:</span> {form.adults} adults, {form.kids} kids
          </div>
          <div>
            <span className="font-medium">Name:</span> {form.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {form.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {form.phone}
          </div>
          <div>
            <span className="font-medium">Notes:</span> {form.notes || '-'}
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="text-center">
          <div className="text-3xl font-bold text-leaf">Booking Confirmed!</div>
          <p className="mt-2">
            Your reference: <span className="font-mono">{result.id}</span>
          </p>
          <p className="opacity-70 mt-2">A confirmation email will be sent shortly.</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 0 && step < 4 ? (
          <button className="btn bg-slate-100" onClick={prev}>
            Back
          </button>
        ) : null}

        {step < 3 ? (
          <button className="btn btn-primary" disabled={!canNext} onClick={next}>
            Next
          </button>
        ) : null}

        {step === 3 ? (
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Processing...' : 'Pay & Confirm'}
          </button>
        ) : null}
      </div>
    </div>
  )
}
