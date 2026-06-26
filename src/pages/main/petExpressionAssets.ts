import type { ImageSourcePropType } from 'react-native';
import type { PetType } from 'types/profile';
import bagicCatAmazedEye from '@assets/pet/bagic_cat/faces/bagic_cat_amazedEye.png';
import bagicCatAmazedEyebrow from '@assets/pet/bagic_cat/faces/bagic_cat_amazedEyebrow.png';
import bagicCatAmazedMouse from '@assets/pet/bagic_cat/faces/bagic_cat_amazedMouse.png';
import bagicCatDeadEye from '@assets/pet/bagic_cat/faces/bagic_cat_deadEye.png';
import bagicCatDeadMouse from '@assets/pet/bagic_cat/faces/bagic_cat_deadMouse.png';
import bagicCatExcitedEye from '@assets/pet/bagic_cat/faces/bagic_cat_excitedEye.png';
import bagicCatExcitedMouse from '@assets/pet/bagic_cat/faces/bagic_cat_excitedMouse.png';
import bagicCatFace from '@assets/pet/bagic_cat/faces/bagic_cat_face.png';
import bagicCatSadEye from '@assets/pet/bagic_cat/faces/bagic_cat_sadEye.png';
import bagicCatSadEyebrow from '@assets/pet/bagic_cat/faces/bagic_cat_sadEyebrow.png';
import bagicCatSadMouse from '@assets/pet/bagic_cat/faces/bagic_cat_sadMouse.png';
import bagicCatSmailEye from '@assets/pet/bagic_cat/faces/bagic_cat_smailEye.png';
import bagicCatSmailEyebrow from '@assets/pet/bagic_cat/faces/bagic_cat_smailEyebrow.png';
import bagicCatSmailMouse from '@assets/pet/bagic_cat/faces/bagic_cat_smailMouse.png';
import bagicCatTiredEye from '@assets/pet/bagic_cat/faces/bagic_cat_tiredEye.png';
import bagicCatTiredMouse from '@assets/pet/bagic_cat/faces/bagic_cat_tiredMouse.png';
import sibaDogAmazedEye from '@assets/pet/siba_dog/faces/siba_dog_amazedEye.png';
import sibaDogAmazedEyebrow from '@assets/pet/siba_dog/faces/siba_dog_amazedEyebrow.png';
import sibaDogAmazedMouse from '@assets/pet/siba_dog/faces/siba_dog_amazedMouse.png';
import sibaDogDeadEye from '@assets/pet/siba_dog/faces/sibadog_v1_05_DeadEyes.png';
import sibaDogDeadMouse from '@assets/pet/siba_dog/faces/sibadog_v1_05_deadMouse.png';
import sibaDogExcitedEye from '@assets/pet/siba_dog/faces/sibadog_v1_05_excitedEye.png';
import sibaDogExcitedMouse from '@assets/pet/siba_dog/faces/sibadog_v1_05_excitedMouse.png';
import sibaDogFace from '@assets/pet/siba_dog/faces/siba_dog_face.png';
import sibaDogSadEye from '@assets/pet/siba_dog/faces/siba_dog_sadEye.png';
import sibaDogSadEyebrow from '@assets/pet/siba_dog/faces/siba_dog_sadEyebrow.png';
import sibaDogSadMouse from '@assets/pet/siba_dog/faces/siba_dog_sadMouse.png';
import sibaDogSmailEye from '@assets/pet/siba_dog/faces/siba_dog_smailEye.png';
import sibaDogSmailEyebrow from '@assets/pet/siba_dog/faces/siba_dog_smailEyebrow.png';
import sibaDogSmailMouse from '@assets/pet/siba_dog/faces/siba_dog_smailMouse.png';
import sibaDogTiredEye from '@assets/pet/siba_dog/faces/siba_dog_tiredEye.png';
import sibaDogTiredMouse from '@assets/pet/siba_dog/faces/siba_dog_tiredMouse.png';

export type PetExpression =
  | 'neutral'
  | 'amazed'
  | 'smile'
  | 'sad'
  | 'tired'
  | 'dead'
  | 'excited';

export type PetExpressionOverlays = {
  baseFace?: ImageSourcePropType;
  eyes?: ImageSourcePropType;
  eyebrows?: ImageSourcePropType;
  mouth?: ImageSourcePropType;
};

// 종별로 "빈 얼굴판 + 표정 파츠" 조합을 정의해 MainPage에서 직접 자산을 알 필요 없게 한다.
export const PET_EXPRESSION_ASSETS: Record<
  PetType,
  Record<Exclude<PetExpression, 'neutral'>, PetExpressionOverlays>
> = {
  CAT: {
    amazed: {
      baseFace: bagicCatFace,
      eyes: bagicCatAmazedEye,
      eyebrows: bagicCatAmazedEyebrow,
      mouth: bagicCatAmazedMouse,
    },
    smile: {
      baseFace: bagicCatFace,
      eyes: bagicCatSmailEye,
      eyebrows: bagicCatSmailEyebrow,
      mouth: bagicCatSmailMouse,
    },
    sad: {
      baseFace: bagicCatFace,
      eyes: bagicCatSadEye,
      eyebrows: bagicCatSadEyebrow,
      mouth: bagicCatSadMouse,
    },
    tired: {
      baseFace: bagicCatFace,
      eyes: bagicCatTiredEye,
      mouth: bagicCatTiredMouse,
    },
    dead: {
      baseFace: bagicCatFace,
      eyes: bagicCatDeadEye,
      mouth: bagicCatDeadMouse,
    },
    excited: {
      baseFace: bagicCatFace,
      eyes: bagicCatExcitedEye,
      mouth: bagicCatExcitedMouse,
    },
  },
  DOG: {
    amazed: {
      baseFace: sibaDogFace,
      eyes: sibaDogAmazedEye,
      eyebrows: sibaDogAmazedEyebrow,
      mouth: sibaDogAmazedMouse,
    },
    smile: {
      baseFace: sibaDogFace,
      eyes: sibaDogSmailEye,
      eyebrows: sibaDogSmailEyebrow,
      mouth: sibaDogSmailMouse,
    },
    sad: {
      baseFace: sibaDogFace,
      eyes: sibaDogSadEye,
      eyebrows: sibaDogSadEyebrow,
      mouth: sibaDogSadMouse,
    },
    tired: {
      baseFace: sibaDogFace,
      eyes: sibaDogTiredEye,
      mouth: sibaDogTiredMouse,
    },
    dead: {
      baseFace: sibaDogFace,
      eyes: sibaDogDeadEye,
      mouth: sibaDogDeadMouse,
    },
    excited: {
      baseFace: sibaDogFace,
      eyes: sibaDogExcitedEye,
      mouth: sibaDogExcitedMouse,
    },
  },
};
