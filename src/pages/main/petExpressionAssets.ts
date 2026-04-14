import type { ImageSourcePropType } from 'react-native';
import type { PetType } from 'types/profile';
import bagicCatAmazedEye from '@assets/pet/bagic_cat/faces/bagic_cat_amazedEye.png';
import bagicCatAmazedMouse from '@assets/pet/bagic_cat/faces/bagic_cat_amazedMouse.png';
import bagicCatFace from '@assets/pet/bagic_cat/faces/bagic_cat_face.png';
import bagicCatSadEye from '@assets/pet/bagic_cat/faces/bagic_cat_sadEye.png';
import bagicCatSmailEye from '@assets/pet/bagic_cat/faces/bagic_cat_smailEye.png';
import sibaDogAmazedEye from '@assets/pet/siba_dog/faces/siba_dog_amazedEye.png';
import sibaDogAmazedEyebrow from '@assets/pet/siba_dog/faces/siba_dog_amazedEyebrow.png';
import sibaDogAmazedMouse from '@assets/pet/siba_dog/faces/siba_dog_amazedMouse.png';
import sibaDogFace from '@assets/pet/siba_dog/faces/siba_dog_face.png';
import sibaDogSadEye from '@assets/pet/siba_dog/faces/siba_dog_sadEye.png';
import sibaDogSadEyebrow from '@assets/pet/siba_dog/faces/siba_dog_sadEyebrow.png';
import sibaDogSadMouse from '@assets/pet/siba_dog/faces/siba_dog_sadMouse.png';
import sibaDogSmailEye from '@assets/pet/siba_dog/faces/siba_dog_smailEye.png';
import sibaDogSmailEyebrow from '@assets/pet/siba_dog/faces/siba_dog_smailEyebrow.png';
import sibaDogSmailMouse from '@assets/pet/siba_dog/faces/siba_dog_smailMouse.png';

export type PetExpression = 'neutral' | 'amazed' | 'smile' | 'sad';

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
      mouth: bagicCatAmazedMouse,
    },
    smile: {
      baseFace: bagicCatFace,
      eyes: bagicCatSmailEye,
    },
    sad: {
      baseFace: bagicCatFace,
      eyes: bagicCatSadEye,
      mouth: bagicCatAmazedMouse,
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
  },
};
