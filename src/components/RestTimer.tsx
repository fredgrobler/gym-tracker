import { useEffect, useRef, useState } from 'react'
import { db } from '../db'
import { playChime, unlockAudio } from '../lib/audio'

const PRESETS = [60, 90, 120, 180]

export default function RestTimer({ sessionId, restEndsAt }: { sessionId: number; restEndsAt?: string }) {
  const [now, setNow] = useState(() => Date.now())
  const [flash, setFlash] = useState(false)
  const firedFor = useRef<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [])

  const endsAtMs = restEndsAt ? new Date(restEndsAt).getTime() : null
  const remainingMs = endsAtMs ? endsAtMs - now : null

  useEffect(() => {
    if (!restEndsAt || remainingMs === null) return
    if (remainingMs <= 0 && firedFor.current !== restEndsAt) {
      firedFor.current = restEndsAt
      playChime()
      setFlash(true)
      setTimeout(() => setFlash(false), 700)
      void db.sessions.update(sessionId, { restEndsAt: undefined })
    }
  }, [remainingMs, restEndsAt, sessionId])

  async function start(seconds: number) {
    // Starting a timer manually may be the first tap of the session, and iOS Safari
    // only unlocks AudioContext inside a user gesture — without this the end-of-rest
    // chime would silently never play.
    unlockAudio()
    await db.sessions.update(sessionId, { restEndsAt: new Date(Date.now() + seconds * 1000).toISOString() })
  }

  async function adjust(deltaSeconds: number) {
    const base = endsAtMs && endsAtMs > now ? endsAtMs : now
    await db.sessions.update(sessionId, { restEndsAt: new Date(base + deltaSeconds * 1000).toISOString() })
  }

  async function stop() {
    await db.sessions.update(sessionId, { restEndsAt: undefined })
  }

  const active = remainingMs !== null && remainingMs > 0
  const secondsLeft = active ? Math.ceil((remainingMs as number) / 1000) : 0

  return (
    <>
      {flash && <div className="rest-flash" />}
      <div className="card rest-timer">
        {active ? (
          <div className="spread">
            <div className="row">
              <span className="rest-clock">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
              </span>
              <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => adjust(30)}>
                +30s
              </button>
            </div>
            <button className="btn btn-ghost" onClick={stop}>
              Skip
            </button>
          </div>
        ) : (
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <span className="muted" style={{ fontSize: 13, marginRight: 4 }}>
              Rest:
            </span>
            {PRESETS.map((s) => (
              <button key={s} className="btn btn-secondary" style={{ padding: '6px 12px', minHeight: 36 }} onClick={() => start(s)}>
                {s}s
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
