export type Technique =
  | 'none'
  | 'lowRPE'
  | 'myoReps'
  | 'longLengthPartials'
  | 'integratedPartials'
  | 'dropset'
  | 'mechanicalDropset'
  | 'pecStretch'
  | 'calfStretch'
  | 'reversePyramid'
  | 'isometricHold'
  | 'amrap'

export const TECHNIQUE_LABEL: Record<Technique, string> = {
  none: '',
  lowRPE: 'Low RPE (6–7) — intentional',
  myoReps: 'Myo-reps on last set',
  longLengthPartials: 'Long-length partials on last set',
  integratedPartials: 'Integrated partials — every set',
  dropset: 'Dropset on last set',
  mechanicalDropset: 'Mechanical dropset — every set',
  pecStretch: '30s pec stretch after last set',
  calfStretch: '30s calf stretch after last set',
  reversePyramid: 'Reverse pyramid — heaviest first',
  isometricHold: 'Isometric hold',
  amrap: 'AMRAP',
}

export type SessionKey = 'pull1' | 'push1' | 'legs1' | 'arms1' | 'pull2' | 'push2' | 'legs2' | 'arms2'

export const SESSION_ORDER: SessionKey[] = ['pull1', 'push1', 'legs1', 'arms1', 'pull2', 'push2', 'legs2', 'arms2']

export const SESSION_NAMES: Record<SessionKey, string> = {
  pull1: 'Pull #1 (Lat Focused)',
  push1: 'Push #1',
  legs1: 'Legs #1',
  arms1: 'Arms & Weak Points #1',
  pull2: 'Pull #2 (Mid-Back Focused)',
  push2: 'Push #2',
  legs2: 'Legs #2',
  arms2: 'Arms & Weak Points #2',
}

export interface Slot {
  id: string
  exerciseId: string
  sets: number
  repsLabel: string
  technique: Technique
  supersetGroup?: string
  isWeakPointSlot?: 1 | 2
  optional?: boolean
  note?: string
  /** true if sets/reps/technique were not explicitly stated in the source summary
   *  for Block 2 and were inherited from the Block 1 slot it replaces, or estimated. */
  inferred?: boolean
}

type BlockPrograms = Record<SessionKey, Slot[]>

// ---------------------------------------------------------------------------
// BLOCK 1 — Build Phase (weeks 1-4, week 5 = semi-deload)
// ---------------------------------------------------------------------------
export const BLOCK_1: BlockPrograms = {
  pull1: [
    { id: 'b1-pull1-1', exerciseId: 'cross-body-lat-pull-around', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials' },
    { id: 'b1-pull1-2', exerciseId: 'snatch-grip-rdl', sets: 2, repsLabel: '8', technique: 'lowRPE' },
    { id: 'b1-pull1-3', exerciseId: 'cs-machine-row', sets: 3, repsLabel: '8–10', technique: 'longLengthPartials' },
    { id: 'b1-pull1-4', exerciseId: 'straight-bar-lat-prayer', sets: 3, repsLabel: '12–15', technique: 'longLengthPartials' },
    { id: 'b1-pull1-5', exerciseId: 'hammer-preacher-curl', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-pull1-6', exerciseId: 'lying-paused-rope-face-pull', sets: 3, repsLabel: '10–12', technique: 'none' },
  ],
  push1: [
    { id: 'b1-push1-1', exerciseId: 'cuffed-btb-lateral-raise', sets: 3, repsLabel: '10–12', technique: 'myoReps' },
    { id: 'b1-push1-2', exerciseId: 'low-incline-smith-press', sets: 4, repsLabel: '8–10', technique: 'pecStretch' },
    { id: 'b1-push1-3', exerciseId: 'pec-deck-integrated-partials', sets: 3, repsLabel: '12–15', technique: 'integratedPartials' },
    { id: 'b1-push1-4', exerciseId: 'overhead-cable-tri-ext-bar', sets: 3, repsLabel: '8', technique: 'dropset' },
    { id: 'b1-push1-5', exerciseId: 'triceps-pressdown-bar', sets: 2, repsLabel: '8–10', technique: 'dropset' },
    { id: 'b1-push1-6', exerciseId: 'cable-crunch', sets: 3, repsLabel: '10–12', technique: 'myoReps' },
  ],
  legs1: [
    { id: 'b1-legs1-1', exerciseId: 'seated-leg-curl', sets: 3, repsLabel: '8–10', technique: 'none' },
    { id: 'b1-legs1-2', exerciseId: 'machine-hip-adduction', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-legs1-3', exerciseId: 'hack-squat', sets: 3, repsLabel: '4, 6, 8', technique: 'reversePyramid' },
    { id: 'b1-legs1-4', exerciseId: 'leg-extension', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials' },
    { id: 'b1-legs1-5', exerciseId: 'leg-press-calf-press', sets: 3, repsLabel: '12–15', technique: 'calfStretch' },
  ],
  arms1: [
    { id: 'b1-arms1-wp1', exerciseId: '', sets: 3, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 1 },
    { id: 'b1-arms1-wp2', exerciseId: '', sets: 2, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 2, optional: true },
    { id: 'b1-arms1-3', exerciseId: 'bayesian-cable-curl', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials' },
    { id: 'b1-arms1-4', exerciseId: 'seated-db-french-press', sets: 3, repsLabel: '10', technique: 'none' },
    { id: 'b1-arms1-5', exerciseId: 'bottom23-ct-preacher-curl', sets: 2, repsLabel: '12–15', technique: 'none' },
    { id: 'b1-arms1-6', exerciseId: 'cable-triceps-kickback', sets: 2, repsLabel: '12–15', technique: 'none' },
    { id: 'b1-arms1-7', exerciseId: 'roman-chair-leg-raise', sets: 3, repsLabel: '10–20', technique: 'none' },
  ],
  pull2: [
    { id: 'b1-pull2-1', exerciseId: 'super-rom-overhand-cable-row', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-pull2-2', exerciseId: 'arms-extended-45-hyperextension', sets: 2, repsLabel: '10–20', technique: 'none' },
    { id: 'b1-pull2-3', exerciseId: 'lean-back-lat-pulldown', sets: 3, repsLabel: '10–12', technique: 'dropset' },
    { id: 'b1-pull2-4', exerciseId: 'inverse-db-zottman-curl', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-pull2-5', exerciseId: 'cable-reverse-flye-mech-ds', sets: 3, repsLabel: '5, 4, 3+', technique: 'mechanicalDropset' },
    { id: 'b1-pull2-6', exerciseId: 'cable-paused-shrug-in', sets: 3, repsLabel: '10–12', technique: 'none' },
  ],
  push2: [
    { id: 'b1-push2-1', exerciseId: 'machine-shoulder-press', sets: 3, repsLabel: '10–12', technique: 'dropset' },
    { id: 'b1-push2-2', exerciseId: 'cross-body-cable-y-raise', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-push2-3', exerciseId: 'paused-assisted-dip', sets: 3, repsLabel: '8–10', technique: 'none' },
    { id: 'b1-push2-4', exerciseId: 'low-incline-db-flye', sets: 2, repsLabel: '15–20', technique: 'longLengthPartials' },
    { id: 'b1-push2-5', exerciseId: 'katana-triceps-extension', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-push2-6', exerciseId: 'ab-wheel-rollout', sets: 3, repsLabel: '10–20', technique: 'none' },
  ],
  legs2: [
    { id: 'b1-legs2-1', exerciseId: 'lying-leg-curl', sets: 3, repsLabel: '8–10', technique: 'longLengthPartials' },
    { id: 'b1-legs2-2', exerciseId: 'leg-press', sets: 3, repsLabel: '8', technique: 'none' },
    { id: 'b1-legs2-3', exerciseId: 'smith-machine-lunge', sets: 2, repsLabel: '8', technique: 'none' },
    { id: 'b1-legs2-4', exerciseId: 'machine-hip-adduction', sets: 3, repsLabel: '10–12', technique: 'none', supersetGroup: 'A' },
    { id: 'b1-legs2-5', exerciseId: 'sissy-squat', sets: 3, repsLabel: '10–12', technique: 'none', supersetGroup: 'A' },
    { id: 'b1-legs2-6', exerciseId: 'standing-calf-raise', sets: 3, repsLabel: '10–12', technique: 'calfStretch' },
  ],
  arms2: [
    { id: 'b1-arms2-wp1', exerciseId: '', sets: 3, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 1 },
    { id: 'b1-arms2-wp2', exerciseId: '', sets: 2, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 2, optional: true },
    { id: 'b1-arms2-3', exerciseId: 'cable-skull-crusher', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-arms2-4', exerciseId: 'kneeling-overhead-cable-curl', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b1-arms2-5', exerciseId: 'triceps-diverging-pressdown', sets: 2, repsLabel: '12–15', technique: 'none' },
    { id: 'b1-arms2-6', exerciseId: 'incline-db-stretch-curl', sets: 2, repsLabel: '12–15', technique: 'none' },
    { id: 'b1-arms2-7', exerciseId: 'cable-crunch', sets: 3, repsLabel: '10–12', technique: 'none' },
  ],
}

// ---------------------------------------------------------------------------
// BLOCK 2 — Novelty Phase (weeks 6-9, week 10 = semi-deload)
// Exercise swaps as stated in the source. Where the source didn't give explicit
// sets/reps for a Block 2 exercise, the Block 1 slot's numbers are inherited
// and the slot is flagged `inferred: true`.
// ---------------------------------------------------------------------------
export const BLOCK_2: BlockPrograms = {
  pull1: [
    { id: 'b2-pull1-1', exerciseId: 'lat-focused-cable-row', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials', inferred: true },
    { id: 'b2-pull1-2', exerciseId: 'paused-barbell-rdl', sets: 2, repsLabel: '8', technique: 'lowRPE', inferred: true },
    { id: 'b2-pull1-3', exerciseId: 'cs-t-bar-row', sets: 3, repsLabel: '8–10', technique: 'longLengthPartials', inferred: true },
    { id: 'b2-pull1-4', exerciseId: 'kelso-shrug', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true, note: 'Paired with CS T-Bar Row in the source; sets/reps estimated.' },
    { id: 'b2-pull1-5', exerciseId: 'straight-bar-lat-prayer', sets: 3, repsLabel: '12–15', technique: 'longLengthPartials' },
    { id: 'b2-pull1-6', exerciseId: '1-arm-lat-pull-in', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true, note: 'New in Block 2; sets/reps estimated.' },
    { id: 'b2-pull1-7', exerciseId: 'n1-style-short-head-curl', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true },
    { id: 'b2-pull1-8', exerciseId: 'reverse-cable-flye-integrated-partials', sets: 3, repsLabel: '10–12', technique: 'integratedPartials', inferred: true },
  ],
  push1: [
    { id: 'b2-push1-1', exerciseId: 'cuffed-btb-lateral-raise', sets: 3, repsLabel: '10–12', technique: 'myoReps' },
    { id: 'b2-push1-2', exerciseId: 'low-incline-db-press', sets: 4, repsLabel: '8–10', technique: 'pecStretch', inferred: true },
    { id: 'b2-push1-3', exerciseId: 'bent-over-cable-pec-flye-integrated-partials', sets: 3, repsLabel: '12–15', technique: 'integratedPartials', inferred: true },
    { id: 'b2-push1-4', exerciseId: 'overhead-cable-tri-ext-bar', sets: 3, repsLabel: '8', technique: 'dropset' },
    { id: 'b2-push1-5', exerciseId: 'dual-cable-triceps-press', sets: 2, repsLabel: '8–10', technique: 'dropset', inferred: true },
    { id: 'b2-push1-6', exerciseId: 'cable-crunch', sets: 3, repsLabel: '10–12', technique: 'myoReps' },
    { id: 'b2-push1-7', exerciseId: 'deficit-push-up-amrap', sets: 2, repsLabel: 'AMRAP', technique: 'amrap', inferred: true, note: 'New Block 2 finisher.' },
  ],
  legs1: [
    { id: 'b2-legs1-1', exerciseId: 'seated-leg-curl', sets: 3, repsLabel: '8–10', technique: 'none' },
    { id: 'b2-legs1-2', exerciseId: 'machine-hip-adduction', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b2-legs1-3', exerciseId: 'smith-machine-squat', sets: 3, repsLabel: '4, 6, 8', technique: 'reversePyramid' },
    { id: 'b2-legs1-4', exerciseId: 'leg-extension', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials' },
    { id: 'b2-legs1-5', exerciseId: 'db-calf-jumps', sets: 3, repsLabel: '12–15', technique: 'calfStretch', inferred: true },
  ],
  arms1: [
    { id: 'b2-arms1-wp1', exerciseId: '', sets: 3, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 1 },
    { id: 'b2-arms1-wp2', exerciseId: '', sets: 2, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 2, optional: true },
    { id: 'b2-arms1-3', exerciseId: 'slow-eccentric-bayesian-curl', sets: 3, repsLabel: '10–12', technique: 'longLengthPartials', inferred: true },
    { id: 'b2-arms1-4', exerciseId: 'seated-db-french-press', sets: 3, repsLabel: '10', technique: 'none' },
    { id: 'b2-arms1-5', exerciseId: 'reverse-grip-cable-curl', sets: 2, repsLabel: '12–15', technique: 'none', inferred: true },
    { id: 'b2-arms1-6', exerciseId: 'cable-triceps-kickback', sets: 2, repsLabel: '12–15', technique: 'none' },
    { id: 'b2-arms1-7', exerciseId: 'medicine-ball-russian-twists', sets: 3, repsLabel: '10–20', technique: 'none', inferred: true },
  ],
  pull2: [
    { id: 'b2-pull2-1', exerciseId: 'dual-handle-lat-pulldown', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true },
    { id: 'b2-pull2-2', exerciseId: 'arms-extended-45-hyperextension', sets: 2, repsLabel: '10–20', technique: 'none' },
    { id: 'b2-pull2-3', exerciseId: 'cs-machine-row', sets: 3, repsLabel: '10–12', technique: 'dropset', inferred: true },
    { id: 'b2-pull2-4', exerciseId: 'inverse-db-zottman-curl', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b2-pull2-5', exerciseId: 'concentration-cable-curl', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true, note: 'New in Block 2; sets/reps estimated.' },
    { id: 'b2-pull2-6', exerciseId: 'rear-delt-45-cable-flye', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true, note: 'Replaces Shrug-In and Reverse Flye combined.' },
  ],
  push2: [
    { id: 'b2-push2-1', exerciseId: 'seated-db-shoulder-press', sets: 3, repsLabel: '10–12', technique: 'dropset', inferred: true },
    { id: 'b2-push2-2', exerciseId: 'cross-body-cable-y-raise', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b2-push2-3', exerciseId: 'decline-machine-chest-press', sets: 3, repsLabel: '8–10', technique: 'none', inferred: true },
    { id: 'b2-push2-4', exerciseId: 'low-incline-db-flye', sets: 2, repsLabel: '15–20', technique: 'longLengthPartials' },
    { id: 'b2-push2-5', exerciseId: 'katana-triceps-extension', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b2-push2-6', exerciseId: 'stomach-vacuums', sets: 2, repsLabel: '10–15s hold', technique: 'isometricHold', inferred: true },
    { id: 'b2-push2-7', exerciseId: 'super-rom-db-lateral-raise', sets: 3, repsLabel: '12–15', technique: 'none', note: 'New Block 2 finisher.' },
  ],
  legs2: [
    { id: 'b2-legs2-1', exerciseId: 'lying-leg-curl', sets: 3, repsLabel: '8–10', technique: 'longLengthPartials' },
    { id: 'b2-legs2-2', exerciseId: 'smith-machine-reverse-lunge', sets: 3, repsLabel: '8', technique: 'none', inferred: true },
    { id: 'b2-legs2-3', exerciseId: 'smith-machine-lunge', sets: 2, repsLabel: '8', technique: 'none' },
    { id: 'b2-legs2-4', exerciseId: 'leg-extension', sets: 4, repsLabel: '15–20', technique: 'none', note: 'Higher-volume addition in Block 2.' },
    { id: 'b2-legs2-5', exerciseId: 'machine-hip-adduction', sets: 3, repsLabel: '10–12', technique: 'none', supersetGroup: 'A' },
    { id: 'b2-legs2-6', exerciseId: 'machine-hip-abduction', sets: 3, repsLabel: '10–12', technique: 'none', supersetGroup: 'A', inferred: true, note: 'Added to the superset in Block 2.' },
    { id: 'b2-legs2-7', exerciseId: 'sissy-squat', sets: 3, repsLabel: '10–12', technique: 'none', supersetGroup: 'A' },
    { id: 'b2-legs2-8', exerciseId: 'standing-calf-raise', sets: 3, repsLabel: '10–12', technique: 'calfStretch' },
  ],
  arms2: [
    { id: 'b2-arms2-wp1', exerciseId: '', sets: 3, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 1 },
    { id: 'b2-arms2-wp2', exerciseId: '', sets: 2, repsLabel: '8–12', technique: 'none', isWeakPointSlot: 2, optional: true },
    { id: 'b2-arms2-3', exerciseId: 'slow-eccentric-ez-bar-skull-crusher', sets: 3, repsLabel: '10–12', technique: 'none', inferred: true },
    { id: 'b2-arms2-4', exerciseId: 'kneeling-overhead-cable-curl', sets: 3, repsLabel: '10–12', technique: 'none' },
    { id: 'b2-arms2-5', exerciseId: 'triceps-pressdown-bar', sets: 2, repsLabel: '12–15', technique: 'none', inferred: true },
    { id: 'b2-arms2-6', exerciseId: 'hammer-curl', sets: 2, repsLabel: '12–15', technique: 'none', inferred: true },
    { id: 'b2-arms2-7', exerciseId: 'cable-crunch', sets: 3, repsLabel: '10–12', technique: 'none' },
  ],
}

export const BLOCKS: Record<1 | 2, BlockPrograms> = { 1: BLOCK_1, 2: BLOCK_2 }

// ---------------------------------------------------------------------------
// Weak points
// ---------------------------------------------------------------------------
export interface WeakPointOption {
  key: string
  label: string
  exercise1Options: string[] // exercise ids
  exercise2Options: string[]
}

export const WEAK_POINTS: WeakPointOption[] = [
  { key: 'shoulders', label: 'Shoulders', exercise1Options: ['cuffed-btb-lateral-raise', 'machine-lateral-raise', 'db-lateral-raise'], exercise2Options: ['machine-shoulder-press', 'smith-machine-shoulder-press', 'arnold-press'] },
  { key: 'lats', label: 'Lats (Back Width)', exercise1Options: ['cable-lat-prayer', 'db-lat-pullover', 'machine-lat-pullover'], exercise2Options: ['lat-focused-cable-row', 'elbows-in-1-arm-db-row', 'half-kneeling-lat-pulldown'] },
  { key: 'quads', label: 'Quads', exercise1Options: ['leg-extension', 'reverse-nordics'], exercise2Options: ['single-leg-leg-press', 'sissy-squat'] },
  { key: 'glutes', label: 'Glutes', exercise1Options: ['machine-hip-abduction', 'cable-hip-abduction', 'lateral-band-walk'], exercise2Options: ['barbell-hip-thrust', 'single-leg-db-hip-thrust'] },
  { key: 'chest', label: 'Chest', exercise1Options: ['low-incline-db-flye-weakpoint', 'low-to-high-cable-crossover'], exercise2Options: ['chest-press-machine', 'db-chest-press'] },
  { key: 'neck', label: 'Neck', exercise1Options: ['plate-loaded-neck-curls'], exercise2Options: ['head-harness-neck-extension', 'plate-loaded-neck-extension'] },
]

// Defaults per the user's current program memory:
// Arms & Weak Points #1 prioritises shoulders; Arms & Weak Points #2 prioritises glutes;
// quads are already addressed by two dedicated Legs sessions per cycle.
export const DEFAULT_WEAK_POINT_ARMS1 = 'shoulders'
export const DEFAULT_WEAK_POINT_ARMS2 = 'glutes'

// ---------------------------------------------------------------------------
// Substitution quick reference (exercise id -> alternative exercise ids)
// ---------------------------------------------------------------------------
export const SUBSTITUTIONS: Record<string, string[]> = {
  'cross-body-lat-pull-around': ['half-kneeling-1-arm-lat-pulldown', 'neutral-grip-pull-up'],
  'snatch-grip-rdl': ['db-rdl', 'nordic-ham-curl'],
  'cs-machine-row': ['cs-t-bar-row', 'helms-row'],
  'straight-bar-lat-prayer': ['machine-lat-pullover', 'db-lat-pullover'],
  'hack-squat': ['machine-squat', 'front-squat'],
  'leg-extension': ['db-step-up', 'reverse-nordics'],
  'low-incline-smith-press': ['low-incline-machine-press', 'low-incline-db-press'],
  'overhead-cable-tri-ext-bar': ['overhead-cable-tri-ext-rope', 'db-skull-crusher'],
  'machine-shoulder-press': ['cable-shoulder-press', 'seated-db-shoulder-press'],
  'paused-assisted-dip': ['decline-machine-press', 'decline-barbell-press'],
  'lying-leg-curl': ['seated-leg-curl', 'nordic-ham-curl'],
  'leg-press': ['belt-squat', 'high-bar-back-squat'],
  'smith-machine-lunge': ['barbell-lunge', 'db-step-up'],
  'lean-back-lat-pulldown': ['lean-back-machine-pulldown', 'medium-grip-pull-up'],
  'cable-reverse-flye-mech-ds': ['reverse-pec-deck', 'bent-over-reverse-db-flye'],
  'ab-wheel-rollout': ['swiss-ball-rollout', 'llpt-plank'],
  'roman-chair-leg-raise': ['hanging-leg-raise', 'reverse-crunch'],
}

export function slotsForSession(block: 1 | 2, session: SessionKey): Slot[] {
  return BLOCKS[block][session]
}
