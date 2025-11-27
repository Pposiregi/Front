import type { ImageSourcePropType } from 'react-native';
import type { MealCalendarDay, MealDetailItem } from 'types/meal';

export type MealListItem = MealDetailItem & {
  imageSource?: ImageSourcePropType;
};

export type MealLog = Record<string, MealListItem[]>;

export type MealCalendarPreviewMap = Record<string, MealCalendarDay>;

/**
 * 달력 셀 타입
 * - key: 고유 키
 * - dateKey: 날짜 키 (YYYY-MM-DD), 현재 달이 아닌 경우 null
 * - dayNumber: 해당 날짜의 일자 (1-31), 현재 달이 아닌 경우 null
 * - isCurrentMonth: 현재 달 여부
 * - previewImage: 미리보기 이미지 배열, 사진이 없는 경우 null
 */
export type MealCalendarCell = {
  key: string;
  dateKey: string | null;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  previewImage: ImageSourcePropType[] | null;
};
