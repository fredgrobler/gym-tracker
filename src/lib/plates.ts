export interface PlateBreakdown {
  perSide: number[]
  remainderKg: number
  achievedKg: number
}

/** Greedy plate calculator: how many of each plate to load per side to hit targetKg,
 *  given a barbell of barKg and an available plate inventory (kg, one entry per physical plate size). */
export function calculatePlates(targetKg: number, barKg: number, inventoryKg: number[]): PlateBreakdown {
  const perSideNeeded = Math.max(0, (targetKg - barKg) / 2)
  const sorted = [...inventoryKg].sort((a, b) => b - a)
  const perSide: number[] = []
  let remaining = perSideNeeded
  for (const plate of sorted) {
    while (remaining + 1e-6 >= plate) {
      perSide.push(plate)
      remaining -= plate
    }
  }
  const achievedKg = barKg + 2 * (perSideNeeded - remaining)
  return { perSide, remainderKg: Math.max(0, remaining), achievedKg }
}
