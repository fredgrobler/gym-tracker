import { useState } from 'react'
import { db, DEFAULT_SETTINGS } from '../db'
import { SESSION_NAMES, SESSION_ORDER, WEAK_POINTS, type SessionKey } from '../data/program'

export default function Onboarding() {
  const [units, setUnits] = useState<'kg' | 'lb'>('kg')
  const [barWeightKg, setBarWeightKg] = useState(20)
  const [weakPointArms1, setWeakPointArms1] = useState('shoulders')
  const [weakPointArms2, setWeakPointArms2] = useState('glutes')
  const [mode, setMode] = useState<'fresh' | 'resume'>('resume')
  const [block, setBlock] = useState<1 | 2>(1)
  const [rotation, setRotation] = useState(1)
  const [nextSession, setNextSession] = useState<SessionKey>('legs2')
  const [saving, setSaving] = useState(false)

  async function handleStart() {
    setSaving(true)
    const sessionIndex = mode === 'fresh' ? 0 : SESSION_ORDER.indexOf(nextSession)
    await db.settings.put({
      ...DEFAULT_SETTINGS,
      units,
      barWeightKg,
      weakPointArms1,
      weakPointArms2,
    })
    await db.enrollment.put({
      id: 1,
      block: mode === 'fresh' ? 1 : block,
      rotation: mode === 'fresh' ? 1 : rotation,
      sessionIndex,
      startedAt: new Date().toISOString(),
    })
    setSaving(false)
  }

  return (
    <div className="screen">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Set up your training</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        Jeff Nippard's Pure Bodybuilding Program — PPLA split
      </p>

      <div className="stack">
        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Units</h2>
          <div className="row">
            <button className={`btn ${units === 'kg' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setUnits('kg')}>
              Kilograms
            </button>
            <button className={`btn ${units === 'lb' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setUnits('lb')}>
              Pounds
            </button>
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <label className="muted" htmlFor="bar-weight">
              Barbell weight ({units})
            </label>
            <input
              id="bar-weight"
              type="number"
              inputMode="decimal"
              value={units === 'kg' ? barWeightKg : Math.round(barWeightKg * 2.20462 * 10) / 10}
              onChange={(e) => {
                const v = Number(e.target.value)
                setBarWeightKg(units === 'kg' ? v : v / 2.20462)
              }}
              style={{ width: 80, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
            />
          </div>
        </div>

        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Weak point focus</h2>
          <p className="muted" style={{ fontSize: 13 }}>
            One weak point is trained on each Arms &amp; Weak Points day.
          </p>
          <label className="stack" style={{ gap: 4 }}>
            <span className="muted" style={{ fontSize: 13 }}>
              Arms &amp; Weak Points #1
            </span>
            <select
              value={weakPointArms1}
              onChange={(e) => setWeakPointArms1(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
            >
              {WEAK_POINTS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
          <label className="stack" style={{ gap: 4 }}>
            <span className="muted" style={{ fontSize: 13 }}>
              Arms &amp; Weak Points #2
            </span>
            <select
              value={weakPointArms2}
              onChange={(e) => setWeakPointArms2(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
            >
              {WEAK_POINTS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Starting point</h2>
          <div className="row">
            <button className={`btn ${mode === 'fresh' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setMode('fresh')}>
              Start Day 1
            </button>
            <button className={`btn ${mode === 'resume' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setMode('resume')}>
              Resume mid-program
            </button>
          </div>
          {mode === 'resume' && (
            <div className="stack" style={{ marginTop: 4 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Block
                </span>
                <div className="row">
                  <button className={`btn ${block === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 16px' }} onClick={() => setBlock(1)}>
                    1
                  </button>
                  <button className={`btn ${block === 2 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 16px' }} onClick={() => setBlock(2)}>
                    2
                  </button>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Week within block (1–5, 5 = deload)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rotation}
                  onChange={(e) => setRotation(Math.min(5, Math.max(1, Number(e.target.value))))}
                  style={{ width: 60, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
                />
              </div>
              <label className="stack" style={{ gap: 4 }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Next session
                </span>
                <select
                  value={nextSession}
                  onChange={(e) => setNextSession(e.target.value as SessionKey)}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
                >
                  {SESSION_ORDER.map((key) => (
                    <option key={key} value={key}>
                      {SESSION_NAMES[key]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-block" onClick={handleStart} disabled={saving} style={{ marginTop: 4 }}>
          {saving ? 'Setting up…' : "Let's go"}
        </button>
      </div>
    </div>
  )
}
