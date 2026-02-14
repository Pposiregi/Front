import type { ImageSourcePropType } from 'react-native';

export type PetTemplateId = 'browncat_v1' | 'browncat_v1_run';

export type PetAssetRegistryEntry = {
  version: string;
  template: unknown;
  partAssets: Record<string, ImageSourcePropType>;
};

const browncatV1MainPartAssets: Record<string, ImageSourcePropType> = {
  'browncat_v1_00_tail_none.png': require('./brown_cat/main/browncat_v1_00_tail_none.png'),
  'browncat_v1_01_leg_left.png': require('./brown_cat/main/browncat_v1_01_leg_left.png'),
  'browncat_v1_01_leg_right.png': require('./brown_cat/main/browncat_v1_01_leg_right.png'),
  'browncat_v1_02_torso_none.png': require('./brown_cat/main/browncat_v1_02_torso_none.png'),
  'browncat_v1_03_arm_left.png': require('./brown_cat/main/browncat_v1_03_arm_left.png'),
  'browncat_v1_03_arm_right.png': require('./brown_cat/main/browncat_v1_03_arm_right.png'),
  'browncat_v1_04_ear_left.png': require('./brown_cat/main/browncat_v1_04_ear_left.png'),
  'browncat_v1_04_ear_right.png': require('./brown_cat/main/browncat_v1_04_ear_right.png'),
  'browncat_v1_05_face_none.png': require('./brown_cat/main/browncat_v1_05_face_none.png'),
  'browncat_v1_06_flushing_left.png': require('./brown_cat/main/browncat_v1_06_flushing_left.png'),
  'browncat_v1_06_flushing_right.png': require('./brown_cat/main/browncat_v1_06_flushing_right.png'),
  'browncat_v1_07_beard_leftDown.png': require('./brown_cat/main/browncat_v1_07_beard_leftDown.png'),
  'browncat_v1_07_beard_leftUp.png': require('./brown_cat/main/browncat_v1_07_beard_leftUp.png'),
  'browncat_v1_07_beard_rightDown.png': require('./brown_cat/main/browncat_v1_07_beard_rightDown.png'),
  'browncat_v1_07_beard_rightUp.png': require('./brown_cat/main/browncat_v1_07_beard_rightUp.png'),
  'browncat_v1_08_eye_left.png': require('./brown_cat/main/browncat_v1_08_eye_left.png'),
  'browncat_v1_08_eye_right.png': require('./brown_cat/main/browncat_v1_08_eye_right.png'),
  'browncat_v1_09_eyebrow_left.png': require('./brown_cat/main/browncat_v1_09_eyebrow_left.png'),
  'browncat_v1_09_eyebrow_right.png': require('./brown_cat/main/browncat_v1_09_eyebrow_right.png'),
  'browncat_v1_10_mouth_none.png': require('./brown_cat/main/browncat_v1_10_mouth_none.png'),
  'browncat_v1_11_neckRuff_none.png': require('./brown_cat/main/browncat_v1_11_neckRuff_none.png'),
};

const browncatV1RunPartAssets: Record<string, ImageSourcePropType> = {
  'browncat_v1_00_tail_none.png': require('./brown_cat/run/browncat_v1_00_tail_none.png'),
  'browncat_v1_01_leg_left.png': require('./brown_cat/run/browncat_v1_01_leg_left.png'),
  'browncat_v1_02_torso_none.png': require('./brown_cat/run/browncat_v1_02_torso_none.png'),
  'browncat_v1_03_leg_right.png': require('./brown_cat/run/browncat_v1_03_leg_right.png'),
  'browncat_v1_05_arm_left.png': require('./brown_cat/run/browncat_v1_05_arm_left.png'),
  'browncat_v1_05_arm_right.png': require('./brown_cat/run/browncat_v1_05_arm_right.png'),
  'browncat_v1_06_neckRuff_none.png': require('./brown_cat/run/browncat_v1_06_neckRuff_none.png'),
  'browncat_v1_07_face_none.png': require('./brown_cat/run/browncat_v1_07_face_none.png'),
  'browncat_v1_08_eye_left.png': require('./brown_cat/run/browncat_v1_08_eye_left.png'),
  'browncat_v1_08_eye_right.png': require('./brown_cat/run/browncat_v1_08_eye_right.png'),
  'browncat_v1_09_mouth_none.png': require('./brown_cat/run/browncat_v1_09_mouth_none.png'),
};

const petAssetRegistry: Record<PetTemplateId, PetAssetRegistryEntry> = {
  browncat_v1: {
    version: 'v1',
    template: require('./template.json'),
    partAssets: browncatV1MainPartAssets,
  },
  browncat_v1_run: {
    version: 'v1_run',
    template: require('./template_run.json'),
    partAssets: browncatV1RunPartAssets,
  },
};

export function getPetAssetRegistryEntry(templateId: string): PetAssetRegistryEntry | null {
  return petAssetRegistry[templateId as PetTemplateId] ?? null;
}
