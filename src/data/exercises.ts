export interface Exercise {
  id: string
  name: string
  cue?: string
}

const list: Exercise[] = [
  // Pull #1
  { id: 'cross-body-lat-pull-around', name: 'Cross-Body Lat Pull-Around', cue: 'Pull the handle down and across toward the opposite hip — think "elbow to hip," not just down.' },
  { id: 'snatch-grip-rdl', name: 'Snatch-Grip RDL', cue: 'Low RPE intentional (6–7) — high muscle damage. 1s pause at the bottom, stay in the bottom 75% of ROM.' },
  { id: 'cs-machine-row', name: 'Chest-Supported Machine Row', cue: 'Keep chest pinned to the pad; drive elbows back and squeeze shoulder blades together at the top.' },
  { id: 'straight-bar-lat-prayer', name: 'Straight-Bar Lat Prayer', cue: 'Start with arms overhead, pull down in an arc with a slight elbow bend — feel the stretch at the top of each rep.' },
  { id: 'hammer-preacher-curl', name: 'Hammer Preacher Curl', cue: 'Neutral (hammer) grip; keep the elbows glued to the pad between reps.' },
  { id: 'lying-paused-rope-face-pull', name: 'Lying Paused Rope Face Pull', cue: 'Pull the rope toward your forehead, pause and squeeze the rear delts/upper back for 1s at the peak.' },

  // Push #1
  { id: 'cuffed-btb-lateral-raise', name: 'Cuffed Behind-The-Back Lateral Raise', cue: 'Raise from behind the body line, leading with the elbow rather than the hand; stop around shoulder height.' },
  { id: 'low-incline-smith-press', name: 'Low Incline Smith Machine Press', cue: '15° incline, 1s pause on the chest.' },
  { id: 'pec-deck-integrated-partials', name: 'Pec Deck', cue: 'Alternate full-ROM and half-ROM every rep.' },
  { id: 'overhead-cable-tri-ext-bar', name: 'Overhead Cable Triceps Extension (Bar)', cue: 'Elbows fixed and close to the head; extend through the full range, feeling the stretch overhead.' },
  { id: 'triceps-pressdown-bar', name: 'Triceps Pressdown (Bar)', cue: 'Elbows pinned to your sides; extend without letting the shoulders roll forward.' },
  { id: 'cable-crunch', name: 'Cable Crunch', cue: 'Crunch by flexing the spine, not by pulling with the hips — let the lower back round.' },

  // Legs #1
  { id: 'seated-leg-curl', name: 'Seated Leg Curl', cue: 'Point toes toward the shins to bias hamstrings over calves; squeeze hard at full contraction.' },
  { id: 'machine-hip-adduction', name: 'Machine Hip Adduction', cue: 'Controlled, moderate ROM — avoid using momentum to swing the legs together.' },
  { id: 'hack-squat', name: 'Hack Squat', cue: 'Reverse pyramid 4/6/8. Heaviest first, drop 10–15% each set.' },
  { id: 'leg-extension', name: 'Leg Extension', cue: 'Control the negative and pause briefly at full extension; avoid swinging up from the bottom.' },
  { id: 'leg-press-calf-press', name: 'Leg Press Calf Press', cue: 'Full ROM — deep stretch at the bottom, pause and squeeze at the top.' },

  // Arms & Weak Points #1
  { id: 'bayesian-cable-curl', name: 'Bayesian Cable Curl', cue: 'Arm behind the body, emphasize the long-length stretch.' },
  { id: 'seated-db-french-press', name: 'Seated DB French Press', cue: 'Keep upper arms vertical and stationary; lower the dumbbell behind the head for a deep triceps stretch.' },
  { id: 'bottom23-ct-preacher-curl', name: 'Bottom-2/3 Constant Tension Preacher Curl', cue: 'Only work the bottom two-thirds of the range to keep tension off the top lockout.' },
  { id: 'cable-triceps-kickback', name: 'Cable Triceps Kickback', cue: 'Upper arm parallel to the floor and stationary; extend only from the elbow.' },
  { id: 'roman-chair-leg-raise', name: 'Roman Chair Leg Raise', cue: 'Curl the pelvis up at the top rather than just swinging the legs; control the descent.' },

  // Pull #2
  { id: 'super-rom-overhand-cable-row', name: 'Super-ROM Overhand Cable Row', cue: 'Row to the torso, then continue the arc back as far as shoulder mobility allows for extra ROM.' },
  { id: 'arms-extended-45-hyperextension', name: 'Arms-Extended 45° Hyperextension', cue: 'Hinge from the hips with a flat back; let the arms hang or hold weight extended in front.' },
  { id: 'lean-back-lat-pulldown', name: 'Lean-Back Lat Pulldown', cue: 'Lean back 15–30°, softly touch the bar to the chest.' },
  { id: 'inverse-db-zottman-curl', name: 'Inverse DB Zottman Curl', cue: 'Curl with palms up, rotate to palms down for the lowering phase.' },
  { id: 'cable-reverse-flye-mech-ds', name: 'Cable Reverse Flye (Mechanical Dropset)', cue: '3 steps back → 5 reps, 1 step forward → 4 reps, 1 step forward → 3+ reps. No rest between.' },
  { id: 'cable-paused-shrug-in', name: 'Cable Paused Shrug-In', cue: 'Shrug up to your ears. Pause 1–2s at top and bottom.' },

  // Push #2
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', cue: 'Elbow break at least 90°.' },
  { id: 'cross-body-cable-y-raise', name: 'Cross-Body Cable Y-Raise', cue: 'Raise the cable up and across the body in a "Y" path, leading with the elbow, not the wrist.' },
  { id: 'paused-assisted-dip', name: 'Paused Assisted Dip', cue: 'Elbow break at least 90°.' },
  { id: 'low-incline-db-flye', name: 'Low-Incline Dumbbell Flye', cue: 'Slight bend in the elbows throughout; lower to a stretch across the chest, not past comfortable shoulder range.' },
  { id: 'katana-triceps-extension', name: 'Katana Triceps Extension', cue: 'Diagonal "katana" path across the body; keep the elbow high and stationary.' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', cue: 'Brace the core hard; roll out only as far as you can keep the lower back from arching.' },

  // Legs #2
  { id: 'lying-leg-curl', name: 'Lying Leg Curl', cue: 'Squeeze the glutes slightly to lock the hips down; curl through a full range without the hips lifting.' },
  { id: 'leg-press', name: 'Leg Press', cue: 'Feet lower = more quad focus. Control negative, slight pause at bottom.' },
  { id: 'smith-machine-lunge', name: 'Smith Machine Lunge', cue: 'Front knee tracks over the toes, not past them; drive through the front heel.' },
  { id: 'sissy-squat', name: 'Sissy Squat', cue: 'RPE ~7–8.' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', cue: 'Full stretch at the bottom, pause, then drive up onto the balls of the feet.' },

  // Arms & Weak Points #2
  { id: 'cable-skull-crusher', name: 'Cable Skull Crusher', cue: 'Elbows pointed forward and stationary; lower behind the head, extend without flaring the elbows.' },
  { id: 'kneeling-overhead-cable-curl', name: 'Kneeling Overhead Cable Curl', cue: 'Kneeling keeps the torso from swinging; curl with elbows fixed, pointing up and back.' },
  { id: 'triceps-diverging-pressdown', name: 'Triceps Diverging Pressdown', cue: 'Handles diverge apart at the bottom for extra stretch; keep elbows tucked.' },
  { id: 'incline-db-stretch-curl', name: 'Incline DB Stretch-Curl', cue: 'Let the arm hang behind the torso on the incline bench for a deep bicep stretch at the bottom.' },

  // Block 2 replacements / additions
  { id: 'lat-focused-cable-row', name: 'Lat-Focused Cable Row', cue: 'Pull with elbows close to the torso, driving them back and down (not out) to bias lats over mid-back.' },
  { id: 'paused-barbell-rdl', name: 'Paused Barbell RDL', cue: 'Hinge at the hips with a soft knee bend, pause 1s at the bottom, keep the bar close to the legs.' },
  { id: 'cs-t-bar-row', name: 'Chest-Supported T-Bar Row', cue: 'Chest pinned to the pad; row by driving elbows back, squeeze shoulder blades at the top.' },
  { id: 'kelso-shrug', name: 'Kelso Shrug', cue: 'Shrug up and back (not just straight up) to target the traps and rear delts together.' },
  { id: '1-arm-lat-pull-in', name: '1-Arm Lat Pull-In', cue: 'Pull the handle in and down toward the hip, rotating slightly to increase lat contraction.' },
  { id: 'n1-style-short-head-curl', name: 'N1-Style Short-Head Curl', cue: 'Arms out to the sides during the curl to bias the short head of the biceps.' },
  { id: 'reverse-cable-flye-integrated-partials', name: 'Reverse Cable Flye', cue: 'Integrated Partials — alternate full-ROM and half-ROM.' },
  { id: 'low-incline-db-press', name: 'Low Incline Dumbbell Press', cue: 'Slight incline keeps tension on the upper chest; lower to a stretch, press up without locking out hard.' },
  { id: 'dual-cable-triceps-press', name: 'Dual-Cable Triceps Press', cue: 'Press both handles down and slightly forward together; keep elbows fixed at your sides.' },
  { id: 'bent-over-cable-pec-flye-integrated-partials', name: 'Bent-Over Cable Pec Flye', cue: 'Integrated Partials — alternate full-ROM and half-ROM.' },
  { id: 'deficit-push-up-amrap', name: 'Deficit Push-Up', cue: 'AMRAP — slow negative, deep stretch.' },
  { id: 'smith-machine-squat', name: 'Smith Machine Squat', cue: 'Reverse pyramid 4/6/8. Heaviest first, drop 10–15% each set.' },
  { id: 'db-calf-jumps', name: 'DB Calf Jumps', cue: 'Jump without leaving the floor — slight knee bend, drive with calves/ankles.' },
  { id: 'dual-handle-lat-pulldown', name: 'Dual-Handle Lat Pulldown', cue: 'Pull the handles down and slightly back, driving elbows down; avoid leaning back excessively.' },
  { id: 'concentration-cable-curl', name: 'Concentration Cable Curl', cue: 'Brace the elbow against the inner thigh or a fixed point; curl strictly without swinging.' },
  { id: 'rear-delt-45-cable-flye', name: 'Rear Delt 45° Cable Flye', cue: 'Hinge forward ~45°, sweep the cables out and back, squeezing rear delts at the top.' },
  { id: 'seated-db-shoulder-press', name: 'Seated DB Shoulder Press', cue: 'Press the dumbbells up and slightly in, stopping just short of locking the elbows out.' },
  { id: 'decline-machine-chest-press', name: 'Decline Machine Chest Press', cue: 'Press through the lower chest; keep the shoulder blades pinned back throughout.' },
  { id: 'stomach-vacuums', name: 'Stomach Vacuums', cue: 'Suck stomach in, hold 10–15s.' },
  { id: 'super-rom-db-lateral-raise', name: 'Super-ROM DB Lateral Raise', cue: 'Lead with the elbows; let the dumbbells drop slightly below the hips at the bottom for extra stretch.' },
  { id: 'smith-machine-reverse-lunge', name: 'Smith Machine Reverse Lunge', cue: 'Step back under control, front knee tracks over the toes; drive through the front heel to return.' },
  { id: 'machine-hip-abduction', name: 'Machine Hip Abduction', cue: 'Lean slightly forward to bias glute med; controlled ROM, avoid momentum.' },
  { id: 'slow-eccentric-ez-bar-skull-crusher', name: 'Slow-Eccentric EZ-Bar Skull Crusher', cue: '3–4 second negative.' },
  { id: 'slow-eccentric-bayesian-curl', name: 'Slow-Eccentric Bayesian Curl', cue: '3–4 second negative, long-length stretch.' },
  { id: 'reverse-grip-cable-curl', name: 'Reverse-Grip Cable Curl', cue: 'Underhand-to-overhand (pronated) grip biases the brachialis and forearms; keep elbows pinned.' },
  { id: 'hammer-curl', name: 'Hammer Curl', cue: 'Neutral grip throughout; curl without swinging the shoulders or elbows forward.' },
  { id: 'medicine-ball-russian-twists', name: 'Medicine Ball Russian Twists', cue: 'Rotate from the torso, not just the arms; controlled tempo, no flinging the ball.' },

  // Weak point options (not in main slots by default, available for selection/substitution)
  { id: 'machine-lateral-raise', name: 'Machine Lateral Raise', cue: 'Lead with the elbow, raise to shoulder height, avoid shrugging the traps up.' },
  { id: 'db-lateral-raise', name: 'DB Lateral Raise', cue: 'Slight bend in the elbows, raise to shoulder height leading with the elbows, avoid swinging the torso.' },
  { id: 'smith-machine-shoulder-press', name: 'Smith Machine Shoulder Press', cue: 'Press straight up, stopping just short of elbow lockout; keep the core braced.' },
  { id: 'arnold-press', name: 'Arnold Press', cue: 'Rotate palms from facing you to facing forward as you press, finishing overhead.' },
  { id: 'cable-lat-prayer', name: 'Cable Lat Prayer', cue: 'Arc the arms down from overhead with a slight elbow bend; feel the stretch at the top.' },
  { id: 'db-lat-pullover', name: 'DB Lat Pullover', cue: 'Lie on a bench, lower the dumbbell behind the head with a slight elbow bend for a lat stretch, pull back over the chest.' },
  { id: 'machine-lat-pullover', name: 'Machine Lat Pullover', cue: 'Pull the handles down and back in an arc, driving elbows down; feel the lats stretch at the start.' },
  { id: 'elbows-in-1-arm-db-row', name: 'Elbows-In 1-Arm DB Row', cue: 'Row with the elbow tracking close to the body to bias lats; avoid rotating the torso.' },
  { id: 'half-kneeling-lat-pulldown', name: 'Half-Kneeling Lat Pulldown', cue: 'Half-kneeling stabilizes the torso; pull the handle down and back without leaning back.' },
  { id: 'reverse-nordics', name: 'Reverse Nordics', cue: 'Kneel, lean back from the knees keeping hips extended; control the descent to load the quads.' },
  { id: 'single-leg-leg-press', name: 'Single-Leg Leg Press', cue: 'One foot on the platform at a time; control the negative, don’t let the knee cave in.' },
  { id: 'cable-hip-abduction', name: 'Cable Hip Abduction', cue: 'Cuff at the ankle, kick the leg out to the side keeping the torso still; controlled tempo.' },
  { id: 'lateral-band-walk', name: 'Lateral Band Walk', cue: 'Stay low with tension on the band throughout; step sideways without letting the knees collapse in.' },
  { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', cue: 'Drive through the heels, squeeze glutes hard at the top, chin tucked, avoid overextending the lower back.' },
  { id: 'single-leg-db-hip-thrust', name: 'Single-Leg DB Hip Thrust', cue: 'Same hip-thrust pattern on one leg; keep hips square, don’t let the working-side hip drop.' },
  { id: 'low-incline-db-flye-weakpoint', name: 'Low Incline DB Flye', cue: 'Slight elbow bend, lower to a stretch across the chest, bring the dumbbells together without locking out.' },
  { id: 'low-to-high-cable-crossover', name: 'Low-to-High Cable Crossover', cue: 'Cables set low, cross the hands up and in front of the chest, squeeze at the top.' },
  { id: 'chest-press-machine', name: 'Chest Press Machine', cue: 'Press through a full range, pause briefly at full stretch, avoid locking the elbows out hard.' },
  { id: 'db-chest-press', name: 'DB Chest Press', cue: 'Lower the dumbbells to a stretch at chest level, press up without banging them together at lockout.' },
  { id: 'plate-loaded-neck-curls', name: 'Plate-Loaded Neck Curls', cue: 'Slow, controlled flexion of the neck against resistance; avoid jerking the head.' },
  { id: 'head-harness-neck-extension', name: 'Head Harness Neck Extension', cue: 'Slow, controlled extension of the neck against resistance; small range, avoid hyperextending.' },
  { id: 'plate-loaded-neck-extension', name: 'Plate-Loaded Neck Extension', cue: 'Slow and controlled, small range of motion — avoid hyperextending.' },

  // Substitution-only exercises (referenced by the substitution quick reference)
  { id: 'half-kneeling-1-arm-lat-pulldown', name: 'Half-Kneeling 1-Arm Lat Pulldown', cue: 'Half-kneeling stance stabilizes the torso; pull the handle down and back to the hip.' },
  { id: 'neutral-grip-pull-up', name: 'Neutral-Grip Pull-Up', cue: 'Neutral (palms facing) grip; pull chest toward the bar, control the descent to a full stretch.' },
  { id: 'db-rdl', name: 'DB RDL', cue: 'Hinge at the hips with dumbbells close to the legs, soft knees, flat back throughout.' },
  { id: 'nordic-ham-curl', name: 'Nordic Ham Curl', cue: 'Anchor the ankles, lower the torso under control using the hamstrings for as long as possible.' },
  { id: 'helms-row', name: 'Helms Row', cue: 'Chest-supported row variant; drive elbows back, squeeze shoulder blades, avoid using momentum.' },
  { id: 'machine-squat', name: 'Machine Squat', cue: 'Controlled descent to depth, drive through the whole foot to stand.' },
  { id: 'front-squat', name: 'Front Squat', cue: 'Bar racked on the front delts, elbows high, sit down between the hips keeping the torso upright.' },
  { id: 'db-step-up', name: 'DB Step-Up', cue: 'Drive through the lead leg to stand on the box; avoid pushing off the trailing leg.' },
  { id: 'low-incline-machine-press', name: 'Low Incline Machine Press', cue: 'Press through the upper chest at a shallow incline; control the negative to a stretch.' },
  { id: 'overhead-cable-tri-ext-rope', name: 'Overhead Cable Triceps Extension (Rope)', cue: 'Same path as the bar version, but let the rope ends split apart at the bottom for extra stretch.' },
  { id: 'db-skull-crusher', name: 'DB Skull Crusher', cue: 'Lower the dumbbells toward the forehead/behind the head with elbows fixed, extend back up.' },
  { id: 'cable-shoulder-press', name: 'Cable Shoulder Press', cue: 'Press up and slightly in, keep the core braced, avoid arching the lower back.' },
  { id: 'decline-machine-press', name: 'Decline Machine Press', cue: 'Press through the lower chest, keep shoulder blades pinned back.' },
  { id: 'decline-barbell-press', name: 'Decline Barbell Press', cue: 'Lower the bar to the lower chest under control, press up without bouncing off the chest.' },
  { id: 'belt-squat', name: 'Belt Squat', cue: 'Squat pattern with load hung from a belt, removing spinal loading; sit back and down to depth.' },
  { id: 'high-bar-back-squat', name: 'High-Bar Back Squat', cue: 'Bar sits high on the traps, torso more upright, squat to at least parallel.' },
  { id: 'barbell-lunge', name: 'Barbell Lunge', cue: 'Step under control, front knee tracks over the toes, drive through the front heel.' },
  { id: 'lean-back-machine-pulldown', name: 'Lean-Back Machine Pulldown', cue: 'Lean back slightly, pull the handle to the chest driving elbows down and back.' },
  { id: 'medium-grip-pull-up', name: 'Medium-Grip Pull-Up', cue: 'Shoulder-width overhand grip; pull chest to the bar, control the descent.' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', cue: 'Arms slightly bent, sweep the handles back and out, squeeze the rear delts together.' },
  { id: 'bent-over-reverse-db-flye', name: 'Bent-Over Reverse DB Flye', cue: 'Hinge forward, sweep the dumbbells out and up, squeeze shoulder blades at the top.' },
  { id: 'swiss-ball-rollout', name: 'Swiss Ball Rollout', cue: 'Brace the core, roll out from the forearms only as far as you can keep the lower back flat.' },
  { id: 'llpt-plank', name: 'LLPT Plank', cue: 'Long-lever, posterior-pelvic-tilt plank — tuck the pelvis under and hold to maximize ab tension.' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', cue: 'Hang from the bar, curl the pelvis to raise the legs rather than swinging them up.' },
  { id: 'reverse-crunch', name: 'Reverse Crunch', cue: 'Curl the hips up toward the ribcage using the lower abs; avoid using leg momentum.' },
]

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(list.map((e) => [e.id, e]))

export function exerciseName(id: string): string {
  return EXERCISES[id]?.name ?? id
}

export function exerciseCue(id: string): string | undefined {
  return EXERCISES[id]?.cue
}
