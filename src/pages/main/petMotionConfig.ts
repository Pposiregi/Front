export const MAIN_PET_TEMPLATE_ID = 'browncat_v1' as const;

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
  phase: [0, 0.5, 1],
  limbLeftX: [-10, 10, -10],
  limbRightX: [10, -10, 10],
  torsoX: [-2, 2, -2],
  torsoY: [0, -1.5, 0],
  faceX: [-3, 3, -3],
  faceY: [0, -1, 0],
  armLeftRotate: ['-10deg', '10deg', '-10deg'],
  armRightRotate: ['10deg', '-10deg', '10deg'],
  legLeftRotate: ['18deg', '-18deg', '18deg'],
  legRightRotate: ['-18deg', '18deg', '-18deg'],
  tailRotate: ['-14deg', '14deg', '-14deg'],
  tailX: [-1.5, 1.5, -1.5],
  neckRuffX: [-2, 2, -2],
  neckRuffRotate: ['-2deg', '2deg', '-2deg'],
} as const satisfies PetRunMotionConfig;
