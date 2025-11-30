import stand_dog from '@assets/images/pet/stand_dog.png';
import stand_dog_smile from '@assets/images/pet/stand_dog_smile.png';
import { PetStates } from './petState';

// 펫 감정 이미지 매핑
export const petImageByState: Record<keyof typeof PetStates, any> = {
  IDLE: stand_dog,
  HAPPY: stand_dog_smile,
};
