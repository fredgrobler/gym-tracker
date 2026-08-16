export interface Exercise {
  id: string
  name: string
  cue?: string
}

const list: Exercise[] = [
  // Pull #1
  { id: 'cross-body-lat-pull-around', name: 'Cross-Body Lat Pull-Around' },
  { id: 'snatch-grip-rdl', name: 'Snatch-Grip RDL', cue: 'Low RPE intentional (6–7) — high muscle damage. 1s pause, stay in bottom 75% of ROM.' },
  { id: 'cs-machine-row', name: 'Chest-Supported Machine Row' },
  { id: 'straight-bar-lat-prayer', name: 'Straight-Bar Lat Prayer' },
  { id: 'hammer-preacher-curl', name: 'Hammer Preacher Curl' },
  { id: 'lying-paused-rope-face-pull', name: 'Lying Paused Rope Face Pull' },

  // Push #1
  { id: 'cuffed-btb-lateral-raise', name: 'Cuffed Behind-The-Back Lateral Raise' },
  { id: 'low-incline-smith-press', name: 'Low Incline Smith Machine Press', cue: '15° incline, 1s pause on chest.' },
  { id: 'pec-deck-integrated-partials', name: 'Pec Deck', cue: 'Alternate full-ROM and half-ROM every rep.' },
  { id: 'overhead-cable-tri-ext-bar', name: 'Overhead Cable Triceps Extension (Bar)' },
  { id: 'triceps-pressdown-bar', name: 'Triceps Pressdown (Bar)' },
  { id: 'cable-crunch', name: 'Cable Crunch' },

  // Legs #1
  { id: 'seated-leg-curl', name: 'Seated Leg Curl' },
  { id: 'machine-hip-adduction', name: 'Machine Hip Adduction' },
  { id: 'hack-squat', name: 'Hack Squat', cue: 'Reverse pyramid 4/6/8. Heaviest first, drop 10–15% each set.' },
  { id: 'leg-extension', name: 'Leg Extension' },
  { id: 'leg-press-calf-press', name: 'Leg Press Calf Press' },

  // Arms & Weak Points #1
  { id: 'bayesian-cable-curl', name: 'Bayesian Cable Curl', cue: 'Arm behind body, emphasize long-length stretch.' },
  { id: 'seated-db-french-press', name: 'Seated DB French Press' },
  { id: 'bottom23-ct-preacher-curl', name: 'Bottom-2/3 Constant Tension Preacher Curl' },
  { id: 'cable-triceps-kickback', name: 'Cable Triceps Kickback' },
  { id: 'roman-chair-leg-raise', name: 'Roman Chair Leg Raise' },

  // Pull #2
  { id: 'super-rom-overhand-cable-row', name: 'Super-ROM Overhand Cable Row' },
  { id: 'arms-extended-45-hyperextension', name: 'Arms-Extended 45° Hyperextension' },
  { id: 'lean-back-lat-pulldown', name: 'Lean-Back Lat Pulldown', cue: 'Lean back 15–30°, softly touch bar to chest.' },
  { id: 'inverse-db-zottman-curl', name: 'Inverse DB Zottman Curl' },
  { id: 'cable-reverse-flye-mech-ds', name: 'Cable Reverse Flye (Mechanical Dropset)', cue: '3 steps back → 5 reps, 1 step forward → 4 reps, 1 step forward → 3+ reps. No rest between.' },
  { id: 'cable-paused-shrug-in', name: 'Cable Paused Shrug-In', cue: 'Shrug up to your ears. Pause 1–2s at top and bottom.' },

  // Push #2
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', cue: 'Elbow break at least 90°.' },
  { id: 'cross-body-cable-y-raise', name: 'Cross-Body Cable Y-Raise' },
  { id: 'paused-assisted-dip', name: 'Paused Assisted Dip', cue: 'Elbow break at least 90°.' },
  { id: 'low-incline-db-flye', name: 'Low-Incline Dumbbell Flye' },
  { id: 'katana-triceps-extension', name: 'Katana Triceps Extension' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout' },

  // Legs #2
  { id: 'lying-leg-curl', name: 'Lying Leg Curl' },
  { id: 'leg-press', name: 'Leg Press', cue: 'Feet lower = more quad focus. Control negative, slight pause at bottom.' },
  { id: 'smith-machine-lunge', name: 'Smith Machine Lunge' },
  { id: 'sissy-squat', name: 'Sissy Squat', cue: 'RPE ~7–8.' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise' },

  // Arms & Weak Points #2
  { id: 'cable-skull-crusher', name: 'Cable Skull Crusher' },
  { id: 'kneeling-overhead-cable-curl', name: 'Kneeling Overhead Cable Curl' },
  { id: 'triceps-diverging-pressdown', name: 'Triceps Diverging Pressdown' },
  { id: 'incline-db-stretch-curl', name: 'Incline DB Stretch-Curl' },

  // Block 2 replacements / additions
  { id: 'lat-focused-cable-row', name: 'Lat-Focused Cable Row' },
  { id: 'paused-barbell-rdl', name: 'Paused Barbell RDL' },
  { id: 'cs-t-bar-row', name: 'Chest-Supported T-Bar Row' },
  { id: 'kelso-shrug', name: 'Kelso Shrug' },
  { id: '1-arm-lat-pull-in', name: '1-Arm Lat Pull-In' },
  { id: 'n1-style-short-head-curl', name: 'N1-Style Short-Head Curl' },
  { id: 'reverse-cable-flye-integrated-partials', name: 'Reverse Cable Flye', cue: 'Integrated Partials — alternate full-ROM and half-ROM.' },
  { id: 'low-incline-db-press', name: 'Low Incline Dumbbell Press' },
  { id: 'dual-cable-triceps-press', name: 'Dual-Cable Triceps Press' },
  { id: 'bent-over-cable-pec-flye-integrated-partials', name: 'Bent-Over Cable Pec Flye', cue: 'Integrated Partials — alternate full-ROM and half-ROM.' },
  { id: 'deficit-push-up-amrap', name: 'Deficit Push-Up', cue: 'AMRAP — slow negative, deep stretch.' },
  { id: 'smith-machine-squat', name: 'Smith Machine Squat', cue: 'Reverse pyramid 4/6/8. Heaviest first, drop 10–15% each set.' },
  { id: 'db-calf-jumps', name: 'DB Calf Jumps', cue: 'Jump without leaving floor — slight knee bend, drive with calves/ankles.' },
  { id: 'dual-handle-lat-pulldown', name: 'Dual-Handle Lat Pulldown' },
  { id: 'concentration-cable-curl', name: 'Concentration Cable Curl' },
  { id: 'rear-delt-45-cable-flye', name: 'Rear Delt 45° Cable Flye' },
  { id: 'seated-db-shoulder-press', name: 'Seated DB Shoulder Press' },
  { id: 'decline-machine-chest-press', name: 'Decline Machine Chest Press' },
  { id: 'stomach-vacuums', name: 'Stomach Vacuums', cue: 'Suck stomach in, hold 10–15s.' },
  { id: 'super-rom-db-lateral-raise', name: 'Super-ROM DB Lateral Raise' },
  { id: 'smith-machine-reverse-lunge', name: 'Smith Machine Reverse Lunge' },
  { id: 'machine-hip-abduction', name: 'Machine Hip Abduction' },
  { id: 'slow-eccentric-ez-bar-skull-crusher', name: 'Slow-Eccentric EZ-Bar Skull Crusher', cue: '3–4 second negative.' },
  { id: 'slow-eccentric-bayesian-curl', name: 'Slow-Eccentric Bayesian Curl', cue: '3–4 second negative, long-length stretch.' },
  { id: 'reverse-grip-cable-curl', name: 'Reverse-Grip Cable Curl' },
  { id: 'hammer-curl', name: 'Hammer Curl' },
  { id: 'medicine-ball-russian-twists', name: 'Medicine Ball Russian Twists' },

  // Weak point options (not in main slots by default, available for selection/substitution)
  { id: 'machine-lateral-raise', name: 'Machine Lateral Raise' },
  { id: 'db-lateral-raise', name: 'DB Lateral Raise' },
  { id: 'smith-machine-shoulder-press', name: 'Smith Machine Shoulder Press' },
  { id: 'arnold-press', name: 'Arnold Press' },
  { id: 'cable-lat-prayer', name: 'Cable Lat Prayer' },
  { id: 'db-lat-pullover', name: 'DB Lat Pullover' },
  { id: 'machine-lat-pullover', name: 'Machine Lat Pullover' },
  { id: 'elbows-in-1-arm-db-row', name: 'Elbows-In 1-Arm DB Row' },
  { id: 'half-kneeling-lat-pulldown', name: 'Half-Kneeling Lat Pulldown' },
  { id: 'reverse-nordics', name: 'Reverse Nordics' },
  { id: 'single-leg-leg-press', name: 'Single-Leg Leg Press' },
  { id: 'cable-hip-abduction', name: 'Cable Hip Abduction' },
  { id: 'lateral-band-walk', name: 'Lateral Band Walk' },
  { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust' },
  { id: 'single-leg-db-hip-thrust', name: 'Single-Leg DB Hip Thrust' },
  { id: 'low-incline-db-flye-weakpoint', name: 'Low Incline DB Flye' },
  { id: 'low-to-high-cable-crossover', name: 'Low-to-High Cable Crossover' },
  { id: 'chest-press-machine', name: 'Chest Press Machine' },
  { id: 'db-chest-press', name: 'DB Chest Press' },
  { id: 'plate-loaded-neck-curls', name: 'Plate-Loaded Neck Curls' },
  { id: 'head-harness-neck-extension', name: 'Head Harness Neck Extension' },
  { id: 'plate-loaded-neck-extension', name: 'Plate-Loaded Neck Extension' },

  // Substitution-only exercises (referenced by the substitution quick reference)
  { id: 'half-kneeling-1-arm-lat-pulldown', name: 'Half-Kneeling 1-Arm Lat Pulldown' },
  { id: 'neutral-grip-pull-up', name: 'Neutral-Grip Pull-Up' },
  { id: 'db-rdl', name: 'DB RDL' },
  { id: 'nordic-ham-curl', name: 'Nordic Ham Curl' },
  { id: 'helms-row', name: 'Helms Row' },
  { id: 'machine-squat', name: 'Machine Squat' },
  { id: 'front-squat', name: 'Front Squat' },
  { id: 'db-step-up', name: 'DB Step-Up' },
  { id: 'low-incline-machine-press', name: 'Low Incline Machine Press' },
  { id: 'overhead-cable-tri-ext-rope', name: 'Overhead Cable Triceps Extension (Rope)' },
  { id: 'db-skull-crusher', name: 'DB Skull Crusher' },
  { id: 'cable-shoulder-press', name: 'Cable Shoulder Press' },
  { id: 'decline-machine-press', name: 'Decline Machine Press' },
  { id: 'decline-barbell-press', name: 'Decline Barbell Press' },
  { id: 'belt-squat', name: 'Belt Squat' },
  { id: 'high-bar-back-squat', name: 'High-Bar Back Squat' },
  { id: 'barbell-lunge', name: 'Barbell Lunge' },
  { id: 'lean-back-machine-pulldown', name: 'Lean-Back Machine Pulldown' },
  { id: 'medium-grip-pull-up', name: 'Medium-Grip Pull-Up' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck' },
  { id: 'bent-over-reverse-db-flye', name: 'Bent-Over Reverse DB Flye' },
  { id: 'swiss-ball-rollout', name: 'Swiss Ball Rollout' },
  { id: 'llpt-plank', name: 'LLPT Plank' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise' },
  { id: 'reverse-crunch', name: 'Reverse Crunch' },
]

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(list.map((e) => [e.id, e]))

export function exerciseName(id: string): string {
  return EXERCISES[id]?.name ?? id
}
