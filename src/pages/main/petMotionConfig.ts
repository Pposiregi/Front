export const MAIN_PET_TEMPLATE_ID = 'browncat_v1' as const;

export const FAT_MORPH_FOLLOW_RATIOS = {
  arm: 0.018,
  leg: 0.022,
  tail: 0.012,
} as const;

export const PET_RUN_MOTION = {
  phase: [0, 0.5, 1] as const,
  limbLeftX: [-10, 10, -10] as const,
  limbRightX: [10, -10, 10] as const,
  torsoX: [-2, 2, -2] as const,
  torsoY: [0, -1.5, 0] as const,
  faceX: [-3, 3, -3] as const,
  faceY: [0, -1, 0] as const,
  armLeftRotate: ['-10deg', '10deg', '-10deg'] as const,
  armRightRotate: ['10deg', '-10deg', '10deg'] as const,
  legLeftRotate: ['18deg', '-18deg', '18deg'] as const,
  legRightRotate: ['-18deg', '18deg', '-18deg'] as const,
  tailRotate: ['-14deg', '14deg', '-14deg'] as const,
  tailX: [-1.5, 1.5, -1.5] as const,
  neckRuffX: [-2, 2, -2] as const,
  neckRuffRotate: ['-2deg', '2deg', '-2deg'] as const,
} as const;
