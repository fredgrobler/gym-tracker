import { exerciseName } from '../data/exercises'

export default function SubstitutionSheet({
  options,
  currentExerciseId,
  onSelect,
  onClose,
}: {
  options: string[]
  currentExerciseId: string
  onSelect: (exerciseId: string) => void
  onClose: () => void
}) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 style={{ fontSize: 17, marginBottom: 4 }}>Swap exercise</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Applies to this session only. No equipment, pain, or not feeling it after several weeks — not "someone's using it."
        </p>
        <div className="stack">
          {options.length === 0 && <p className="muted">No listed substitutes for this exercise.</p>}
          {options.map((id) => (
            <button
              key={id}
              className={`btn btn-secondary btn-block`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                onSelect(id)
                onClose()
              }}
            >
              {exerciseName(id)}
            </button>
          ))}
          {currentExerciseId && (
            <button className="btn btn-ghost btn-block" onClick={onClose}>
              Keep {exerciseName(currentExerciseId)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
