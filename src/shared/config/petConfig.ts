import type { PetType } from 'types/profile';

/**
 * 사용자 펫 타입 저장 키.
 * - ProfileSettingPage: 저장
 * - MainPage: 화면 포커스 시 로드
 * 공통 상수로 두어 화면 간 키 불일치를 방지한다.
 */
export const PET_TYPE_STORAGE_KEY = 'fitpet:profile:petType';

/**
 * 펫 타입 -> 렌더 템플릿 ID 매핑.
 *
 * main/run을 분리한 이유:
 * - 메인 대기 화면과 러닝 화면의 파츠 구성/레이어가 다를 수 있기 때문.
 * - 호출부(MainPage)는 petType만 알면 되고, 실제 템플릿 선택 규칙은 여기서 단일 관리.
 */
export const PET_TEMPLATE_ID_BY_TYPE: Record<
  PetType,
  { main: 'browncat_v1' | 'sibadog_v1'; run: 'browncat_v1_run' | 'sibadog_v1_run' }
> = {
  CAT: { main: 'browncat_v1', run: 'browncat_v1_run' },
  DOG: { main: 'sibadog_v1', run: 'sibadog_v1_run' },
} as const;
