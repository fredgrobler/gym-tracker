import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, lastSetsForSlot, DEFAULT_SETTINGS, type SetLog } from '../db'
import { SESSION_NAMES, SUBSTITUTIONS, TECHNIQUE_LABEL, WEAK_POINTS, slotsForSession, type Slot } from '../data/program'
import { exerciseName, exerciseCue, exerciseVideoId } from '../data/exercises'
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
import VideoSheet from '../components/VideoSheet'
import NumberField from '../components/NumberField'

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

  const slots = useMemo(
    () => (session ? slotsForSession(session.block, session.sessionKey) : []),
    [session?.block, session?.sessionKey], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [exerciseOverrides, setExerciseOverrides] = useState<Record<string, string>>({})
  const [showPlateSheet, setShowPlateSheet] = useState(false)
  const [showSubSheet, setShowSubSheet] = useState(false)
  const [showVideoSheet, setShowVideoSheet] = useState(false)
  const [lastTime, setLastTime] = useState<{ log: SetLog[]; sameExercise: boolean } | null>(null)

  const [weightKg, setWeightKg] = useState(0)
  const [reps, setReps] = useState(10)
  const [rpe, setRpe] = useState(9)
  const [isWarmup, setIsWarmup] = useState(false)

  const touchStart = useRef<{ x: number; y: number } | null>(null)

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
  const isDeload = !!session?.isDeload
  const setsToday = slot ? (isDeload ? Math.min(2, slot.sets) : slot.sets) : 0

  // `logs` comes from useLiveQuery with a fresh array identity each render, so
  // memoizing on it would never hit cache. These are cheap scans over one session.
  const slotLogs = logs.filter((l) => l.slotId === slot?.id)
  const workingLogs = slotLogs.filter((l) => !l.isWarmup)
  const nextSetIndex = workingLogs.length + 1

  /** working-set count per slot, for the progress strip */
  const doneBySlot = new Map<string, number>()
  for (const l of logs) {
    if (!l.isWarmup) doneBySlot.set(l.slotId, (doneBySlot.get(l.slotId) ?? 0) + 1)
  }

  useEffect(() => {
    if (!slot) return
    let cancelled = false
    void lastSetsForSlot(slot.id, exId, sessionId).then((res) => {
      if (!cancelled) setLastTime(res)
    })
    return () => {
      cancelled = true
    }
  }, [slot?.id, exId, sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!slot) return
    const prevInSession = workingLogs[workingLogs.length - 1]
    const fromLastTime = lastTime?.log.find((l) => l.setIndex === nextSetIndex)
    const rpeDefault = defaultRpe(nextSetIndex, setsToday, slot.technique, isDeload)
    if (prevInSession) {
      // Load and reps carry over from the previous set, but RPE must not — the
      // program escalates effort across a slot (early sets ~9, last set to failure),
      // so inheriting the previous set's RPE would flatten that.
      setWeightKg(prevInSession.weightKg)
      setReps(prevInSession.reps)
      setRpe(rpeDefault)
    } else if (fromLastTime) {
      setWeightKg(fromLastTime.weightKg)
      setReps(fromLastTime.reps)
      setRpe(rpeDefault)
    } else {
      // No history for this slot: start from zero rather than carrying the previous
      // exercise's load over, which would be wrong for most machines and cables.
      setWeightKg(0)
      setReps(guessRepsNumber(repsTargetForSet(slot.repsLabel, nextSetIndex)))
      setRpe(rpeDefault)
    }
    setIsWarmup(false)
  }, [slot?.id, exId, nextSetIndex, lastTime]) // eslint-disable-line react-hooks/exhaustive-deps

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
      await db.sessions.update(sessionId, {
        restEndsAt: new Date(Date.now() + DEFAULT_REST_SECONDS * 1000).toISOString(),
      })
    }
  }

  async function undoLast() {
    const last = workingLogs[workingLogs.length - 1] ?? slotLogs[slotLogs.length - 1]
    if (last?.id) await db.setLogs.delete(last.id)
  }

  function goTo(delta: number) {
    setCurrentIndex((i) => Math.min(slots.length - 1, Math.max(0, i + delta)))
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    // Require a clearly horizontal gesture so scrolling the page doesn't
    // accidentally skip to another exercise.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(dx < 0 ? 1 : -1)
    }
  }

  async function finishSession() {
    const totalSets = logs.filter((l) => !l.isWarmup).length
    const message =
      totalSets === 0
        ? 'No sets logged yet — finish anyway? This still advances you to the next session in the cycle.'
        : `Finish this workout? ${totalSets} set${totalSets === 1 ? '' : 's'} logged.`
    if (!window.confirm(message)) return
    await db.sessions.update(sessionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      restEndsAt: undefined,
    })
    const next = advance({
      block: enrollment!.block,
      rotation: enrollment!.rotation,
      sessionIndex: enrollment!.sessionIndex,
    })
    if (next === null) {
      await db.enrollment.update(1, { block: 1, rotation: 1, sessionIndex: 0 })
      window.alert('You completed the full 10-week program! Restarting at Block 1 — repeat it, or pick a new split.')
    } else {
      await db.enrollment.update(1, next)
    }
    navigate('/')
  }

  const extraSets = workingLogs.length - setsToday
  const isIsometric = slot.technique === 'isometricHold'
  const isAmrap = slot.technique === 'amrap'
  const subOptions = slotSubstituteOptions(slot, exId)
  const slotComplete = workingLogs.length >= setsToday
  const nextSlot = slots[currentIndex + 1]
  const unit = settings.units

  return (
    <div className="screen" style={{ paddingBottom: 8 }}>
      <div className="spread" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => navigate('/')}>
          ← Home
        </button>
        <span className="muted" style={{ fontSize: 13 }}>
          {SESSION_NAMES[session.sessionKey]}
          {session.isDeload ? ' · Deload' : ''}
        </span>
        <button className="btn btn-secondary" style={{ padding: '6px 14px' }} onClick={finishSession}>
          Finish
        </button>
      </div>

      <RestTimer sessionId={sessionId} restEndsAt={session.restEndsAt} />

      {/* Progress strip — see at a glance what's done, tap to jump */}
      <div className="progress-strip" role="tablist" aria-label="Exercises">
        {slots.map((s, i) => {
          const exercise = exerciseOverrides[s.id] ?? resolveSlotExercise(s, settings)
          const target = isDeload ? Math.min(2, s.sets) : s.sets
          const done = doneBySlot.get(s.id) ?? 0
          const state = done >= target ? 'done' : done > 0 ? 'partial' : 'todo'
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`${exerciseName(exercise)}, ${done} of ${target} sets`}
              className={`chip chip-${state}${i === currentIndex ? ' chip-current' : ''}`}
              onClick={() => setCurrentIndex(i)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ marginTop: 12 }}>
        <div className="spread" style={{ marginBottom: 8 }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 12px', opacity: currentIndex === 0 ? 0.3 : 1 }}
            disabled={currentIndex === 0}
            onClick={() => goTo(-1)}
            aria-label="Previous exercise"
          >
            ‹
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            Exercise {currentIndex + 1} / {slots.length}
            {slot.supersetGroup && ` · Superset ${slot.supersetGroup}`}
          </span>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 12px', opacity: currentIndex === slots.length - 1 ? 0.3 : 1 }}
            disabled={currentIndex === slots.length - 1}
            onClick={() => goTo(1)}
            aria-label="Next exercise"
          >
            ›
          </button>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <button className="exercise-title" onClick={() => setShowSubSheet(true)}>
            <span>{exerciseName(exId)}</span>
            <span className="swap-hint" aria-hidden="true">
              ⇄
            </span>
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
          {exerciseCue(exId) && (
            <p className="cue-line">
              <span aria-hidden="true">💡</span> {exerciseCue(exId)}
            </p>
          )}
          {exerciseVideoId(exId) && (
            <button className="watch-form-btn" onClick={() => setShowVideoSheet(true)}>
              ▶ Watch form
            </button>
          )}
          {slot.note && (
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              {slot.note}
            </p>
          )}
          {slot.inferred && (
            <p style={{ fontSize: 11, marginTop: 4, color: 'var(--warning)' }}>
              ≈ estimated for Block 2 — verify against your program
            </p>
          )}

          {/* Beating the logbook is the program's stated day-to-day goal, so last
              session's numbers for this slot are shown right where you log. */}
          {lastTime && (
            <div className="last-time">
              <span className="last-time-label">Last time</span>
              <span className="last-time-sets">
                {lastTime.log.map((l, i) => (
                  <span key={l.id ?? i} className="pill">
                    {displayWeight(l.weightKg, unit)}×{l.reps}
                  </span>
                ))}
              </span>
              {!lastTime.sameExercise && (
                <span className="muted" style={{ fontSize: 11 }}>
                  (different exercise)
                </span>
              )}
            </div>
          )}

          {extraSets > 0 && (
            <p style={{ fontSize: 12, marginTop: 6, color: 'var(--warning)' }}>
              +{extraSets} extra set{extraSets > 1 ? 's' : ''} beyond the {setsToday} prescribed
            </p>
          )}
          {slot.technique === 'dropset' && extraSets > 0 && (
            <p style={{ fontSize: 12, marginTop: 2, color: 'var(--warning)' }}>
              Multi-drop — program calls for a single drop
            </p>
          )}
        </div>

        {slotLogs.length > 0 && (
          <div className="card" style={{ marginBottom: 12, padding: 12 }}>
            {slotLogs.map((l) => (
              <div key={l.id} className="set-row">
                <span className="set-index">{l.isWarmup ? 'W' : l.setIndex}</span>
                <span style={{ flex: 1 }}>
                  {displayWeight(l.weightKg, unit)} {unit} × {l.reps}
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
              {!isWarmup && ` · target ${repsTargetForSet(slot.repsLabel, nextSetIndex)}`}
            </span>
            <button
              className={`pill ${isWarmup ? 'pill-accent' : ''}`}
              style={{ padding: '6px 10px' }}
              aria-pressed={isWarmup}
              onClick={() => setIsWarmup((w) => !w)}
            >
              {isWarmup ? 'Warm-up ✓' : 'Warm-up'}
            </button>
          </div>

          <div className="entry-row">
            <span className="entry-label">Weight</span>
            <div className="stepper">
              <button onClick={() => setWeightKg((w) => Math.max(0, w - weightIncKg))} aria-label="Decrease weight">
                −
              </button>
              <NumberField
                value={weightKg}
                onChange={(n) => setWeightKg(unit === 'kg' ? n : lbToKg(n))}
                format={(kg) => displayWeight(kg, unit)}
                parse={(s) => (unit === 'kg' ? Number(s) : lbToKg(Number(s)))}
                ariaLabel={`Weight in ${unit}`}
              />
              <button onClick={() => setWeightKg((w) => w + weightIncKg)} aria-label="Increase weight">
                +
              </button>
            </div>
            <span className="entry-trailing">
              <button onClick={() => setShowPlateSheet(true)} aria-label="Plate calculator">
                🏋️
              </button>
            </span>
          </div>

          <div className="entry-row">
            <span className="entry-label">{isIsometric ? 'Seconds' : 'Reps'}</span>
            <div className="stepper">
              <button onClick={() => setReps((r) => Math.max(0, r - 1))} aria-label="Decrease reps">
                −
              </button>
              <NumberField
                value={reps}
                onChange={setReps}
                format={(n) => String(Math.round(n))}
                parse={(s) => Math.round(Number(s))}
                inputMode="numeric"
                ariaLabel={isIsometric ? 'Seconds' : 'Reps'}
              />
              <button onClick={() => setReps((r) => r + 1)} aria-label="Increase reps">
                +
              </button>
            </div>
            <span className="entry-trailing muted" style={{ fontSize: 11 }}>
              {isAmrap ? 'AMRAP' : ''}
            </span>
          </div>

          {!isWarmup && (
            <div className="entry-row">
              <span className="entry-label">RPE</span>
              <div className="stepper">
                <button onClick={() => setRpe((r) => Math.max(5, r - 0.5))} aria-label="Decrease RPE">
                  −
                </button>
                <span className="stepper-value" aria-label={`RPE ${rpe}`}>
                  {rpe}
                </span>
                <button onClick={() => setRpe((r) => Math.min(10, r + 0.5))} aria-label="Increase RPE">
                  +
                </button>
              </div>
              <span className="entry-trailing" />
            </div>
          )}

          <button className="btn btn-primary btn-block" style={{ marginTop: 4 }} onClick={logSet}>
            Log set
          </button>
        </div>

        {slotComplete && nextSlot && (
          <button className="btn btn-secondary btn-block next-cta" onClick={() => goTo(1)}>
            Next: {exerciseName(exerciseOverrides[nextSlot.id] ?? resolveSlotExercise(nextSlot, settings))} →
          </button>
        )}
        {slotComplete && !nextSlot && (
          <button className="btn btn-primary btn-block next-cta" onClick={finishSession}>
            Finish workout
          </button>
        )}
      </div>

      {showPlateSheet && (
        <PlateSheet
          targetKg={weightKg}
          barKg={settings.barWeightKg}
          inventoryKg={settings.plateInventoryKg}
          units={unit}
          onClose={() => setShowPlateSheet(false)}
        />
      )}
      {showSubSheet && (
        <SubstitutionSheet
          options={subOptions}
          currentExerciseId={exId}
          onSelect={(newId) => setExerciseOverrides((o) => ({ ...o, [slot.id]: newId }))}
          onClose={() => setShowSubSheet(false)}
        />
      )}
      {showVideoSheet && exerciseVideoId(exId) && (
        <VideoSheet videoId={exerciseVideoId(exId)!} title={exerciseName(exId)} onClose={() => setShowVideoSheet(false)} />
      )}
    </div>
  )
}
