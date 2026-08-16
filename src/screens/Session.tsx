import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, lastSetsForSlot, DEFAULT_SETTINGS, type SetLog } from '../db'
import { SESSION_NAMES, SUBSTITUTIONS, TECHNIQUE_LABEL, WEAK_POINTS, slotsForSession, type Slot } from '../data/program'
import { exerciseName } from '../data/exercises'
import { resolveSlotExercise } from '../lib/resolveSlot'
import { repsTargetForSet, guessRepsNumber } from '../lib/reps'
import { defaultRpe } from '../lib/rpe'
import { displayWeight, lbToKg } from '../lib/format'
import { unlockAudio } from '../lib/audio'
import { acquireWakeLock, releaseWakeLock, reacquireOnVisible } from '../lib/wakeLock'
import { advance } from '../lib/cycle'
import RestTimer from '../components/RestTimer'
import PlateSheet from '../components/PlateSheet'
import SubstitutionSheet from '../components/SubstitutionSheet'

const DEFAULT_REST_SECONDS = 90

function slotSubstituteOptions(slot: Slot, exId: string): string[] {
  if (slot.isWeakPointSlot) {
    // offer the other options within the same weak-point category
    for (const wp of WEAK_POINTS) {
      const set = slot.isWeakPointSlot === 1 ? wp.exercise1Options : wp.exercise2Options
      if (set.includes(exId)) return set.filter((o) => o !== exId)
    }
    return []
  }
  return SUBSTITUTIONS[exId] ?? []
}

export default function Session() {
  const { id } = useParams()
  const sessionId = Number(id)
  const navigate = useNavigate()

  const session = useLiveQuery(() => db.sessions.get(sessionId), [sessionId])
  const settings = useLiveQuery(() => db.settings.get(1)) ?? DEFAULT_SETTINGS
  const enrollment = useLiveQuery(() => db.enrollment.get(1))
  const logs = useLiveQuery(() => db.setLogs.where('sessionId').equals(sessionId).sortBy('setIndex'), [sessionId]) ?? []

  const slots = useMemo(() => (session ? slotsForSession(session.block, session.sessionKey) : []), [session])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [exerciseOverrides, setExerciseOverrides] = useState<Record<string, string>>({})
  const [showPlateSheet, setShowPlateSheet] = useState(false)
  const [showSubSheet, setShowSubSheet] = useState(false)
  const [history, setHistory] = useState<{ log: SetLog[]; sameExercise: boolean } | null>(null)

  const [weightKg, setWeightKg] = useState(0)
  const [reps, setReps] = useState(10)
  const [rpe, setRpe] = useState(9)
  const [isWarmup, setIsWarmup] = useState(false)

  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    void acquireWakeLock()
    const cleanup = reacquireOnVisible()
    return () => {
      cleanup()
      void releaseWakeLock()
    }
  }, [])

  const slot = slots[currentIndex]
  const exId = slot ? exerciseOverrides[slot.id] ?? resolveSlotExercise(slot, settings) : ''
  const setsToday = slot ? (session?.isDeload ? Math.min(2, slot.sets) : slot.sets) : 0
  const slotLogs = useMemo(() => logs.filter((l) => l.slotId === slot?.id), [logs, slot])
  const nextSetIndex = slotLogs.filter((l) => !l.isWarmup).length + 1

  useEffect(() => {
    if (!slot) return
    let cancelled = false
    void lastSetsForSlot(slot.id, exId).then((res) => {
      if (!cancelled) setHistory(res)
    })
    return () => {
      cancelled = true
    }
  }, [slot, exId])

  useEffect(() => {
    if (!slot) return
    const workingLogs = slotLogs.filter((l) => !l.isWarmup)
    const prevInSession = workingLogs[workingLogs.length - 1]
    const fromHistory = history?.log.find((l) => l.setIndex === nextSetIndex && !l.isWarmup)
    if (prevInSession) {
      setWeightKg(prevInSession.weightKg)
      setReps(prevInSession.reps)
      setRpe(prevInSession.rpe ?? defaultRpe(nextSetIndex, setsToday, slot.technique, !!session?.isDeload))
    } else if (fromHistory) {
      setWeightKg(fromHistory.weightKg)
      setReps(fromHistory.reps)
      setRpe(defaultRpe(nextSetIndex, setsToday, slot.technique, !!session?.isDeload))
    } else {
      setWeightKg((w) => (w > 0 ? w : settings.barWeightKg))
      setReps(guessRepsNumber(repsTargetForSet(slot.repsLabel, nextSetIndex)))
      setRpe(defaultRpe(nextSetIndex, setsToday, slot.technique, !!session?.isDeload))
    }
    setIsWarmup(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot?.id, exId, nextSetIndex, history])

  if (!session || !slot || !enrollment) return null

  const weightIncKg = settings.units === 'kg' ? 2.5 : lbToKg(5)

  async function logSet() {
    unlockAudio()
    await db.setLogs.add({
      sessionId,
      slotId: slot.id,
      exerciseId: exId,
      setIndex: isWarmup ? 0 : nextSetIndex,
      weightKg,
      reps,
      rpe: isWarmup ? undefined : rpe,
      isWarmup,
      createdAt: new Date().toISOString(),
    })
    if (!isWarmup) {
      await db.sessions.update(sessionId, { restEndsAt: new Date(Date.now() + DEFAULT_REST_SECONDS * 1000).toISOString() })
    }
  }

  async function undoLast() {
    const workingLogs = slotLogs.filter((l) => !l.isWarmup)
    const last = workingLogs[workingLogs.length - 1] ?? slotLogs[slotLogs.length - 1]
    if (last?.id) await db.setLogs.delete(last.id)
  }

  function goTo(delta: number) {
    setCurrentIndex((i) => Math.min(slots.length - 1, Math.max(0, i + delta)))
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 60) goTo(delta < 0 ? 1 : -1)
    touchStartX.current = null
  }

  async function finishSession() {
    if (!window.confirm('Finish this workout?')) return
    await db.sessions.update(sessionId, { status: 'completed', completedAt: new Date().toISOString(), restEndsAt: undefined })
    const next = advance({ block: enrollment!.block, rotation: enrollment!.rotation, sessionIndex: enrollment!.sessionIndex })
    if (next === null) {
      await db.enrollment.update(1, { block: 1, rotation: 1, sessionIndex: 0 })
      window.alert('You completed the full 10-week program! Restarting at Block 1 — repeat it, or pick a new split.')
    } else {
      await db.enrollment.update(1, next)
    }
    navigate('/')
  }

  const workingCount = slotLogs.filter((l) => !l.isWarmup).length
  const extraSets = workingCount - setsToday
  const isIsometric = slot.technique === 'isometricHold'
  const isAmrap = slot.technique === 'amrap'
  const subOptions = slotSubstituteOptions(slot, exId)

  return (
    <div className="screen" style={{ paddingBottom: 8 }}>
      <div className="spread" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => navigate('/')}>
          ← Home
        </button>
        <button className="btn btn-secondary" style={{ padding: '6px 14px' }} onClick={finishSession}>
          Finish
        </button>
      </div>

      <div className="row" style={{ marginBottom: 4 }}>
        <span className="pill">{SESSION_NAMES[session.sessionKey]}</span>
        {session.isDeload && <span className="pill pill-accent">Deload</span>}
      </div>

      <RestTimer sessionId={sessionId} restEndsAt={session.restEndsAt} />

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ marginTop: 12 }}>
        <div className="spread" style={{ marginBottom: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 10px' }} disabled={currentIndex === 0} onClick={() => goTo(-1)}>
            ‹
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            Exercise {currentIndex + 1} / {slots.length}
            {slot.supersetGroup && ` · Superset ${slot.supersetGroup}`}
          </span>
          <button className="btn btn-ghost" style={{ padding: '6px 10px' }} disabled={currentIndex === slots.length - 1} onClick={() => goTo(1)}>
            ›
          </button>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <button className="btn-ghost" style={{ fontSize: 19, fontWeight: 700, textAlign: 'left', padding: 0 }} onClick={() => setShowSubSheet(true)}>
            {exerciseName(exId)} ⇄
          </button>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {setsToday} × {slot.repsLabel}
            {slot.optional ? ' (optional)' : ''}
          </p>
          {TECHNIQUE_LABEL[slot.technique] && (
            <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              {TECHNIQUE_LABEL[slot.technique]}
            </p>
          )}
          {slot.note && (
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              {slot.note}
            </p>
          )}
          {slot.inferred && (
            <p style={{ fontSize: 11, marginTop: 4, color: 'var(--warning)' }}>≈ estimated for Block 2 — verify against your program</p>
          )}
          {extraSets > 0 && (
            <p style={{ fontSize: 12, marginTop: 6, color: 'var(--warning)' }}>
              +{extraSets} extra set{extraSets > 1 ? 's' : ''} beyond the {setsToday} prescribed
            </p>
          )}
          {slot.technique === 'dropset' && extraSets > 0 && (
            <p style={{ fontSize: 12, marginTop: 2, color: 'var(--warning)' }}>Multi-drop — program calls for a single drop</p>
          )}
        </div>

        {slotLogs.length > 0 && (
          <div className="card" style={{ marginBottom: 12, padding: 12 }}>
            {slotLogs.map((l) => (
              <div key={l.id} className="set-row">
                <span className="set-index">{l.isWarmup ? 'W' : l.setIndex}</span>
                <span style={{ flex: 1 }}>
                  {displayWeight(l.weightKg, settings.units)} {settings.units} × {l.reps}
                  {isIsometric ? 's' : ''}
                </span>
                {!l.isWarmup && l.rpe !== undefined && <span className="muted">RPE {l.rpe}</span>}
              </div>
            ))}
            <button className="btn btn-ghost" style={{ marginTop: 4, padding: '6px 0' }} onClick={undoLast}>
              Undo last set
            </button>
          </div>
        )}

        <div className="card stack">
          <div className="spread">
            <span style={{ fontWeight: 600 }}>
              {isWarmup ? 'Warm-up' : `Set ${nextSetIndex}`}
              {!isWarmup && ` target: ${repsTargetForSet(slot.repsLabel, nextSetIndex)}`}
            </span>
            <button
              className={`pill ${isWarmup ? 'pill-accent' : ''}`}
              style={{ border: 'none', cursor: 'pointer' }}
              onClick={() => setIsWarmup((w) => !w)}
            >
              {isWarmup ? 'Warm-up ✓' : 'Mark as warm-up'}
            </button>
          </div>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted" style={{ fontSize: 13, width: 60 }}>
              Weight
            </span>
            <div className="stepper">
              <button onClick={() => setWeightKg((w) => Math.max(0, w - weightIncKg))}>−</button>
              <input
                className="stepper-value"
                inputMode="decimal"
                value={displayWeight(weightKg, settings.units)}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v)) setWeightKg(settings.units === 'kg' ? v : lbToKg(v))
                }}
                style={{ border: 'none', background: 'transparent' }}
              />
              <button onClick={() => setWeightKg((w) => w + weightIncKg)}>+</button>
            </div>
            <button className="btn btn-ghost" style={{ padding: '6px 8px', fontSize: 18 }} onClick={() => setShowPlateSheet(true)} aria-label="Plate calculator">
              🏋️
            </button>
          </div>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted" style={{ fontSize: 13, width: 60 }}>
              {isIsometric ? 'Seconds' : 'Reps'}
            </span>
            <div className="stepper">
              <button onClick={() => setReps((r) => Math.max(0, r - 1))}>−</button>
              <input
                className="stepper-value"
                inputMode="numeric"
                value={reps}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v)) setReps(v)
                }}
                style={{ border: 'none', background: 'transparent' }}
              />
              <button onClick={() => setReps((r) => r + 1)}>+</button>
            </div>
            {isAmrap && <span className="muted" style={{ fontSize: 12 }}>AMRAP</span>}
          </div>

          {!isWarmup && (
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: 13, width: 60 }}>
                RPE
              </span>
              <div className="stepper">
                <button onClick={() => setRpe((r) => Math.max(5, r - 0.5))}>−</button>
                <span className="stepper-value">{rpe}</span>
                <button onClick={() => setRpe((r) => Math.min(10, r + 0.5))}>+</button>
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-block" style={{ marginTop: 4 }} onClick={logSet}>
            Log set
          </button>
        </div>
      </div>

      {showPlateSheet && (
        <PlateSheet targetKg={weightKg} barKg={settings.barWeightKg} inventoryKg={settings.plateInventoryKg} units={settings.units} onClose={() => setShowPlateSheet(false)} />
      )}
      {showSubSheet && (
        <SubstitutionSheet
          options={subOptions}
          currentExerciseId={exId}
          onSelect={(newId) => setExerciseOverrides((o) => ({ ...o, [slot.id]: newId }))}
          onClose={() => setShowSubSheet(false)}
        />
      )}
    </div>
  )
}
