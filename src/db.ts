import Dexie, { type EntityTable } from 'dexie'
import type { SessionKey } from './data/program'

export interface Enrollment {
  id: 1
  block: 1 | 2
  rotation: number
  sessionIndex: number
  startedAt: string
}

export interface Settings {
  id: 1
  units: 'kg' | 'lb'
  barWeightKg: number
  plateInventoryKg: number[]
  weakPointArms1: string
  weakPointArms2: string
  storagePersisted: boolean
}

export type SessionStatus = 'in_progress' | 'completed'

export interface WorkoutSession {
  id?: number
  sessionKey: SessionKey
  block: 1 | 2
  rotation: number
  isDeload: boolean
  weekNumber: number
  status: SessionStatus
  startedAt: string
  completedAt?: string
  /** ISO timestamp the current rest period ends at. Stored on the session (not just in
   *  React state) so the timer survives navigation, app backgrounding, and even a full
   *  process kill — iOS Safari can suspend a backgrounded PWA tab at any time. */
  restEndsAt?: string
}

export interface SetLog {
  id?: number
  sessionId: number
  slotId: string
  exerciseId: string
  setIndex: number
  weightKg: number
  reps: number
  rpe?: number
  isWarmup: boolean
  createdAt: string
}

export interface BodyMetric {
  id?: number
  date: string // YYYY-MM-DD
  weightKg: number
  note?: string
}

export const db = new Dexie('gym-tracker') as Dexie & {
  enrollment: EntityTable<Enrollment, 'id'>
  settings: EntityTable<Settings, 'id'>
  sessions: EntityTable<WorkoutSession, 'id'>
  setLogs: EntityTable<SetLog, 'id'>
  bodyMetrics: EntityTable<BodyMetric, 'id'>
}

db.version(1).stores({
  enrollment: 'id',
  settings: 'id',
  sessions: '++id, sessionKey, status, startedAt',
  setLogs: '++id, sessionId, slotId, exerciseId, createdAt',
  bodyMetrics: '++id, date',
})

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  units: 'kg',
  barWeightKg: 20,
  plateInventoryKg: [25, 20, 15, 10, 5, 2.5, 1.25],
  weakPointArms1: 'shoulders',
  weakPointArms2: 'glutes',
  storagePersisted: false,
}

/** Most recent set log for a given slot, preferring an exact exercise match
 *  (handles the case where the slot's exercise was substituted last time). */
export async function lastSetsForSlot(
  slotId: string,
  exerciseId: string,
): Promise<{ log: SetLog[]; sameExercise: boolean } | null> {
  const bySlot = await db.setLogs.where('slotId').equals(slotId).sortBy('createdAt')
  if (bySlot.length === 0) return null
  const lastSessionId = bySlot[bySlot.length - 1].sessionId
  const lastSessionLogs = bySlot.filter((l) => l.sessionId === lastSessionId)
  const sameExercise = lastSessionLogs.every((l) => l.exerciseId === exerciseId)
  return { log: lastSessionLogs.sort((a, b) => a.setIndex - b.setIndex), sameExercise }
}
