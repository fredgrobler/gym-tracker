import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, DEFAULT_SETTINGS, type Settings as SettingsRow } from '../db'
import { WEAK_POINTS, SESSION_NAMES, SESSION_ORDER, type SessionKey } from '../data/program'
import { exportBackup, importBackup } from '../lib/backup'
import { requestPersistentStorage, isStoragePersisted } from '../lib/storage'
import { displayWeight, kgToLb, lbToKg } from '../lib/format'

export default function Settings() {
  const settings = useLiveQuery(() => db.settings.get(1)) ?? DEFAULT_SETTINGS
  const enrollment = useLiveQuery(() => db.enrollment.get(1))
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  async function update(patch: Partial<SettingsRow>) {
    await db.settings.put({ ...settings, ...patch })
  }

  async function checkPersistence() {
    const granted = await requestPersistentStorage()
    setPersisted(granted || (await isStoragePersisted()))
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!window.confirm('Importing will replace all current data with this backup. Continue?')) {
      e.target.value = ''
      return
    }
    setImporting(true)
    try {
      await importBackup(file)
      window.alert('Backup restored.')
    } catch {
      window.alert('Could not read this backup file.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  function updatePlate(index: number, valueDisplay: number) {
    const valueKg = settings.units === 'kg' ? valueDisplay : lbToKg(valueDisplay)
    const plates = [...settings.plateInventoryKg]
    plates[index] = valueKg
    void update({ plateInventoryKg: plates.sort((a, b) => b - a) })
  }

  return (
    <div className="screen">
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Settings</h1>

      <div className="stack">
        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Units</h2>
          <div className="row">
            <button className={`btn ${settings.units === 'kg' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => update({ units: 'kg' })}>
              Kilograms
            </button>
            <button className={`btn ${settings.units === 'lb' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => update({ units: 'lb' })}>
              Pounds
            </button>
          </div>
          <div className="spread">
            <span className="muted" style={{ fontSize: 13 }}>
              Barbell weight
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={displayWeight(settings.barWeightKg, settings.units)}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (!Number.isNaN(v)) update({ barWeightKg: settings.units === 'kg' ? v : lbToKg(v) })
              }}
              style={{ width: 80, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
            />
          </div>
        </div>

        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Plate inventory ({settings.units}, per plate)</h2>
          <p className="muted" style={{ fontSize: 12 }}>Used by the plate calculator during logging.</p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            {settings.plateInventoryKg.map((kg, i) => (
              <input
                key={i}
                type="number"
                inputMode="decimal"
                value={settings.units === 'kg' ? kg : Math.round(kgToLb(kg) * 10) / 10}
                onChange={(e) => updatePlate(i, Number(e.target.value))}
                style={{ width: 60, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
              />
            ))}
          </div>
        </div>

        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Weak point focus</h2>
          <label className="stack" style={{ gap: 4 }}>
            <span className="muted" style={{ fontSize: 13 }}>
              Arms &amp; Weak Points #1
            </span>
            <select
              value={settings.weakPointArms1}
              onChange={(e) => update({ weakPointArms1: e.target.value })}
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
              value={settings.weakPointArms2}
              onChange={(e) => update({ weakPointArms2: e.target.value })}
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
          <h2 style={{ fontSize: 15 }}>Current position in program</h2>
          <p className="muted" style={{ fontSize: 12 }}>
            Correct this if you skipped a session or set the wrong starting point.
          </p>
          {enrollment && (
            <>
              <div className="spread">
                <span className="muted" style={{ fontSize: 13 }}>
                  Block
                </span>
                <div className="row">
                  {([1, 2] as const).map((b) => (
                    <button
                      key={b}
                      className={`btn ${enrollment.block === b ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 16px', minHeight: 40 }}
                      onClick={() => db.enrollment.update(1, { block: b })}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="spread">
                <span className="muted" style={{ fontSize: 13 }}>
                  Week in block (5 = deload)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  inputMode="numeric"
                  value={enrollment.rotation}
                  onChange={(e) =>
                    db.enrollment.update(1, { rotation: Math.min(5, Math.max(1, Number(e.target.value) || 1)) })
                  }
                  style={{ width: 60, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
                />
              </div>
              <label className="stack" style={{ gap: 4 }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Next session
                </span>
                <select
                  value={SESSION_ORDER[enrollment.sessionIndex]}
                  onChange={(e) =>
                    db.enrollment.update(1, { sessionIndex: SESSION_ORDER.indexOf(e.target.value as SessionKey) })
                  }
                  style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-sunken)' }}
                >
                  {SESSION_ORDER.map((key) => (
                    <option key={key} value={key}>
                      {SESSION_NAMES[key]}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>

        <div className="card stack">
          <h2 style={{ fontSize: 15 }}>Storage &amp; backup</h2>
          <p className="muted" style={{ fontSize: 12 }}>
            iOS can clear a web app's local data after long inactivity. Request persistent storage, and export a backup
            occasionally as a safety net.
          </p>
          <button className="btn btn-secondary btn-block" onClick={checkPersistence}>
            {persisted === null ? 'Request persistent storage' : persisted ? 'Persistent storage granted ✓' : 'Not granted — try again'}
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => void exportBackup()}>
            Export backup (JSON)
          </button>
          <button className="btn btn-secondary btn-block" onClick={() => fileInput.current?.click()} disabled={importing}>
            {importing ? 'Restoring…' : 'Import backup'}
          </button>
          <input ref={fileInput} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
        </div>
      </div>
    </div>
  )
}
