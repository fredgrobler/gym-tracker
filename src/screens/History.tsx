import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, DEFAULT_SETTINGS, type SetLog } from '../db'
import { SESSION_NAMES } from '../data/program'
import { exerciseName } from '../data/exercises'
import { displayWeight, formatDateTime } from '../lib/format'

export default function History() {
  const settings = useLiveQuery(() => db.settings.get(1)) ?? DEFAULT_SETTINGS
  const sessions = useLiveQuery(() => db.sessions.where('status').equals('completed').reverse().sortBy('startedAt')) ?? []
  const [expanded, setExpanded] = useState<number | null>(null)
  const expandedLogs =
    useLiveQuery(
      () => (expanded ? db.setLogs.where('sessionId').equals(expanded).sortBy('setIndex') : Promise.resolve<SetLog[]>([])),
      [expanded],
    ) ?? []

  return (
    <div className="screen">
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>History</h1>

      {sessions.length === 0 && <p className="muted">No completed sessions yet — finish a workout and it'll show up here.</p>}

      <div className="stack">
        {sessions.map((s) => {
          const isOpen = expanded === s.id
          return (
            <div key={s.id} className="card">
              <button
                className="btn-ghost spread"
                style={{ width: '100%', padding: 0, textAlign: 'left' }}
                onClick={() => setExpanded(isOpen ? null : s.id ?? null)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{SESSION_NAMES[s.sessionKey]}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {formatDateTime(s.startedAt)} · Block {s.block}, Week {s.weekNumber}
                    {s.isDeload ? ' (deload)' : ''}
                  </div>
                </div>
                <span className="muted">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="stack" style={{ marginTop: 12 }}>
                  {groupBySlot(expandedLogs).map(([slotId, group]) => (
                    <div key={slotId}>
                      <div className="muted" style={{ fontSize: 13, marginBottom: 2 }}>
                        {exerciseName(group[0].exerciseId)}
                      </div>
                      <div className="row" style={{ flexWrap: 'wrap' }}>
                        {group.map((l) => (
                          <span key={l.id} className="pill">
                            {l.isWarmup ? 'W' : l.setIndex}: {displayWeight(l.weightKg, settings.units)}×{l.reps}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function groupBySlot<T extends { slotId: string }>(logs: T[]): [string, T[]][] {
  const map = new Map<string, T[]>()
  for (const l of logs) {
    const arr = map.get(l.slotId) ?? []
    arr.push(l)
    map.set(l.slotId, arr)
  }
  return Array.from(map.entries())
}
