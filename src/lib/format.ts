export const KG_PER_LB = 0.45359237

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB
}

export function displayWeight(kg: number, units: 'kg' | 'lb'): string {
  const val = units === 'kg' ? kg : kgToLb(kg)
  const rounded = Math.round(val * 10) / 10
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`
}

export function weightIncrement(units: 'kg' | 'lb'): number {
  return units === 'kg' ? 2.5 : 5
}

export function roundToIncrement(kg: number, incrementKg: number): number {
  return Math.round(kg / incrementKg) * incrementKg
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
