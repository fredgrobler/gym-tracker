import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, DEFAULT_SETTINGS } from '../db'
import { describeNext } from '../lib/cycle'
import { SESSION_NAMES, slotsForSession } from '../data/program'
import { exerciseName, exerciseCue } from '../data/exercises'
import { resolveSlotExercise } from '../lib/resolveSlot'

export default function Today() {
  const navigate = useNavigate()
  const enrollment = useLiveQuery(() => db.enrollment.get(1))
  const settings = useLiveQuery(() => db.settings.get(1))
  const inProgress = useLiveQuery(() => db.sessions.where('status').equals('in_progress').first())

  if (!enrollment || !settings) return null

  const next = describeNext(enrollment)
  const slots = slotsForSession(next.block, next.sessionKey)

  async function startSession() {
    const id = await db.sessions.add({
      sessionKey: next.sessionKey,
      block: next.block,
      rotation: next.rotation,
      isDeload: next.isDeload,
      weekNumber: next.weekNumber,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    })
    navigate(`/session/${id}`)
  }

  return (
    <div className="screen">
      <div className="row" style={{ marginBottom: 4 }}>
        <span className="pill">Block {next.block}</span>
        <span className="pill">Week {next.weekNumber}</span>
        {next.isDeload && <span className="pill pill-accent">Semi-deload</span>}
      </div>
      <h1 style={{ fontSize: 26, marginTop: 8, marginBottom: 16 }}>{SESSION_NAMES[next.sessionKey]}</h1>

      {next.isDeload && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'var(--warning)' }}>
          <p style={{ fontSize: 14 }}>
            <strong>Deload week.</strong> 2 sets per exercise, RPE ~7–8. Avoid failure.
          </p>
        </div>
      )}

      <div className="stack" style={{ marginBottom: 20 }}>
        {slots.map((slot) => {
          const exId = resolveSlotExercise(slot, settings ?? DEFAULT_SETTINGS)
          const setsToday = next.isDeload ? Math.min(2, slot.sets) : slot.sets
          return (
            <div key={slot.id} className="card" style={{ padding: 12 }}>
              <div className="spread">
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  {exerciseName(exId)}
                  {slot.optional && <span className="muted"> (optional)</span>}
                </span>
                <span className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {setsToday} × {slot.repsLabel}
                </span>
              </div>
              {exerciseCue(exId) && (
                <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {exerciseCue(exId)}
                </p>
              )}
              {slot.inferred && (
                <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                  ≈ estimated for Block 2 — verify against your program
                </p>
              )}
            </div>
          )
        })}
      </div>

      {inProgress ? (
        <button className="btn btn-primary btn-block" onClick={() => navigate(`/session/${inProgress.id}`)}>
          Resume in-progress session
        </button>
      ) : (
        <button className="btn btn-primary btn-block" onClick={startSession}>
          Start session
        </button>
      )}
    </div>
  )
}
