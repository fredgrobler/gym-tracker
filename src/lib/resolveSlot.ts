import { WEAK_POINTS, type Slot } from '../data/program'
import type { Settings } from '../db'

/** Weak-point slots don't have a fixed exerciseId in the program data — they resolve
 *  based on the user's chosen weak point category, defaulting to that category's first
 *  listed option. */
export function resolveSlotExercise(slot: Slot, settings: Settings): string {
  if (slot.isWeakPointSlot) {
    const key = slot.isWeakPointSlot === 1 ? settings.weakPointArms1 : settings.weakPointArms2
    const wp = WEAK_POINTS.find((w) => w.key === key)
    if (!wp) return slot.exerciseId
    const options = slot.isWeakPointSlot === 1 ? wp.exercise1Options : wp.exercise2Options
    return options[0] ?? slot.exerciseId
  }
  return slot.exerciseId
}
