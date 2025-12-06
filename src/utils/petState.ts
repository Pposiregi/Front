// 펫 감정
export const PetStates = {
  IDLE: 'IDLE',
  HAPPY: 'HAPPY',
} as const;

export type PetState = keyof typeof PetStates;
