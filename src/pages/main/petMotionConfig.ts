export const FAT_MORPH_FOLLOW_RATIOS = {
  arm: 0.018,
  leg: 0.022,
  tail: 0.012,
} as const;

type NumberPhase = readonly [number, number, number];
type DegreePhase = readonly [string, string, string];

type PetRunMotionConfig = {
  phase: NumberPhase;
  limbLeftX: NumberPhase;
  limbRightX: NumberPhase;
  torsoX: NumberPhase;
  torsoY: NumberPhase;
  faceX: NumberPhase;
  faceY: NumberPhase;
  armLeftRotate: DegreePhase;
  armRightRotate: DegreePhase;
  legLeftRotate: DegreePhase;
  legRightRotate: DegreePhase;
  tailRotate: DegreePhase;
  tailX: NumberPhase;
  neckRuffX: NumberPhase;
  neckRuffRotate: DegreePhase;
};

export const PET_RUN_MOTION = {
  phase: [0, 0.5, 1] as const,
  limbLeftX: [-3, 3, -3] as const,
  limbRightX: [3, -3, 3] as const,
  torsoX: [-0.5, 0.5, -0.5] as const,
  torsoY: [0, -0.5, 0] as const,
  faceX: [-0.5, 0.5, -0.5] as const,
  faceY: [0, -0.2, 0] as const,
  armLeftRotate: ['-22deg', '18deg', '-22deg'] as const,
  armRightRotate: ['18deg', '-22deg', '18deg'] as const,
  legLeftRotate: ['0deg', '0deg', '0deg'] as const,
  legRightRotate: ['0deg', '0deg', '0deg'] as const,
  tailRotate: ['-6deg', '6deg', '-6deg'] as const,
  tailX: [-0.5, 0.5, -0.5] as const,
  neckRuffX: [-0.3, 0.3, -0.3] as const,
  neckRuffRotate: ['-0.5deg', '0.5deg', '-0.5deg'] as const,
} as const satisfies PetRunMotionConfig;
