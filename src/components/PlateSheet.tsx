import { calculatePlates } from '../lib/plates'
import { displayWeight } from '../lib/format'

export default function PlateSheet({
  targetKg,
  barKg,
  inventoryKg,
  units,
  onClose,
}: {
  targetKg: number
  barKg: number
  inventoryKg: number[]
  units: 'kg' | 'lb'
  onClose: () => void
}) {
  const { perSide, achievedKg, remainderKg } = calculatePlates(targetKg, barKg, inventoryKg)
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 style={{ fontSize: 17, marginBottom: 12 }}>Plate calculator</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Bar: {displayWeight(barKg, units)} {units} · Target: {displayWeight(targetKg, units)} {units}
        </p>
        {perSide.length === 0 ? (
          <p style={{ fontSize: 15 }}>Bar only — no plates needed.</p>
        ) : (
          <div className="row" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
            {perSide.map((p, i) => (
              <span key={i} className="pill" style={{ fontSize: 15, padding: '6px 12px' }}>
                {displayWeight(p, units)}
              </span>
            ))}
          </div>
        )}
        <p className="muted" style={{ fontSize: 13 }}>per side</p>
        {remainderKg > 0.01 && (
          <p style={{ fontSize: 13, color: 'var(--warning)', marginTop: 8 }}>
            Closest with your plates: {displayWeight(achievedKg, units)} {units} (short by {displayWeight(remainderKg * 2, units)} {units})
          </p>
        )}
        <button className="btn btn-secondary btn-block" style={{ marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
