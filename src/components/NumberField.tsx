import { useState } from 'react'

/** Numeric input that holds a raw text draft while focused.
 *  Without this, a controlled `value={format(n)}` rewrites the field on every
 *  keystroke — typing "12.5" collapses to "12" the moment the "." is entered,
 *  and the caret jumps. The draft is released on blur, re-syncing to the
 *  canonical formatted value. */
export default function NumberField({
  value,
  onChange,
  format,
  parse,
  inputMode = 'decimal',
  ariaLabel,
}: {
  value: number
  onChange: (n: number) => void
  format: (n: number) => string
  parse: (s: string) => number
  inputMode?: 'decimal' | 'numeric'
  ariaLabel: string
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <input
      className="stepper-value"
      type="text"
      inputMode={inputMode}
      aria-label={ariaLabel}
      value={draft ?? format(value)}
      onFocus={(e) => {
        setDraft(format(value))
        e.currentTarget.select()
      }}
      onChange={(e) => {
        const raw = e.target.value
        setDraft(raw)
        if (raw.trim() === '') return
        const n = parse(raw)
        if (!Number.isNaN(n) && n >= 0) onChange(n)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}
