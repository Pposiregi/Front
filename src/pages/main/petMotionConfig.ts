export const FAT_MORPH_FOLLOW_RATIOS = {
  arm: 0.018,
  leg: 0.022,
  tail: 0.012,
} as const;

export const PET_RUN_MOTION = {
  phase: [0, 0.5, 1] as const,
  limbLeftX: [-5, 5, -5] as const,
  limbRightX: [5, -5, 5] as const,
  torsoX: [-1, 1, -1] as const,
  torsoY: [0, -1, 0] as const,
  faceX: [-1.5, 1.5, -1.5] as const,
  faceY: [0, -0.5, 0] as const,
  armLeftRotate: ['-8deg', '8deg', '-8deg'] as const,
  armRightRotate: ['8deg', '-8deg', '8deg'] as const,
  legLeftRotate: ['12deg', '-12deg', '12deg'] as const,
  legRightRotate: ['-12deg', '12deg', '-12deg'] as const,
  tailRotate: ['-10deg', '10deg', '-10deg'] as const,
  tailX: [-1, 1, -1] as const,
  neckRuffX: [-1, 1, -1] as const,
  neckRuffRotate: ['-1.5deg', '1.5deg', '-1.5deg'] as const,
} as const;
