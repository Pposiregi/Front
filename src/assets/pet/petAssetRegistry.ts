import type { ImageSourcePropType } from 'react-native';

export type PetTemplateId = 'browncat_v1' | 'browncat_v1_run';

export type PetAssetRegistryEntry = {
  version: string;
  // Runtime validator in petTemplate.ts verifies the loaded JSON shape.
  // Keep this as unknown at registry boundary to enforce explicit validation downstream.
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
  'browncat_v1_01_arm_left.png': require('./brown_cat/run/browncat_v1_01_arm_left.png'),
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

/**
 * 템플릿 ID로 레지스트리 엔트리를 조회한다.
 * 유효하지 않은 문자열 입력을 허용하기 위해 파라미터는 string으로 받고,
 * 내부에서 안전하게 narrowing하여 없으면 null을 반환한다.
 */
export function getPetAssetRegistryEntry(
  templateId: string
): PetAssetRegistryEntry | null {
  return petAssetRegistry[templateId as PetTemplateId] ?? null;
}
