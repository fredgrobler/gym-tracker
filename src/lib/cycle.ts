import { SESSION_ORDER, type SessionKey } from '../data/program'

export interface CyclePosition {
  block: 1 | 2
  /** 1-5: which pass through the 10-day cycle within this block. 5 = semi-deload week. */
  rotation: number
  /** index into SESSION_ORDER for the next session to perform */
  sessionIndex: number
}

export interface NextSession {
  block: 1 | 2
  rotation: number
  sessionKey: SessionKey
  isDeload: boolean
  /** overall week number 1-10 across both blocks, matching the source's "Week 5 & 10 = deload" framing */
  weekNumber: number
}

export function initialCyclePosition(): CyclePosition {
  return { block: 1, rotation: 1, sessionIndex: 0 }
}

export function describeNext(pos: CyclePosition): NextSession {
  const sessionKey = SESSION_ORDER[pos.sessionIndex]
  const isDeload = pos.rotation === 5
  const weekNumber = pos.block === 1 ? pos.rotation : 5 + pos.rotation
  return { block: pos.block, rotation: pos.rotation, sessionKey, isDeload, weekNumber }
}

/** Returns the position after completing the currently-next session, or null if the
 *  full 10-week program (both blocks) has just been completed. */
export function advance(pos: CyclePosition): CyclePosition | null {
  const nextIndex = pos.sessionIndex + 1
  if (nextIndex < SESSION_ORDER.length) {
    return { ...pos, sessionIndex: nextIndex }
  }
  // finished a full rotation through the 8 sessions
  const nextRotation = pos.rotation + 1
  if (nextRotation <= 5) {
    return { block: pos.block, rotation: nextRotation, sessionIndex: 0 }
  }
  // finished all 5 rotations of this block
  if (pos.block === 1) {
    return { block: 2, rotation: 1, sessionIndex: 0 }
  }
  return null // full program complete
}
