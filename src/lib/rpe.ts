import type { Technique } from '../data/program'

/** Program-aware default RPE for the next set, per the Hypertrophy Handbook's
 *  early-sets-vs-last-set effort framework. */
export function defaultRpe(setIndexTarget: number, totalSets: number, technique: Technique, isDeload: boolean): number {
  if (isDeload) return 7.5
  if (technique === 'lowRPE') return 6.5
  if (setIndexTarget >= totalSets) return 10
  return 9
}
