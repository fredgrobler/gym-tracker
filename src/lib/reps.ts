/** Some rep labels encode a per-set target (e.g. reverse pyramid "4, 6, 8").
 *  Returns the target string to show for a specific 1-based set index. */
export function repsTargetForSet(repsLabel: string, setIndex: number): string {
  const parts = repsLabel.split(',').map((p) => p.trim())
  if (parts.length > 1 && parts.every((p) => /^\d+\+?$/.test(p))) {
    return parts[Math.min(setIndex, parts.length) - 1] ?? parts[parts.length - 1]
  }
  return repsLabel
}

/** Midpoint-ish numeric guess for a rep range label, used only as a last-resort
 *  default when there's no history to pull a ghost value from. */
export function guessRepsNumber(repsLabel: string): number {
  const nums = repsLabel.match(/\d+/g)
  if (!nums || nums.length === 0) return 10
  const values = nums.map(Number)
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}
