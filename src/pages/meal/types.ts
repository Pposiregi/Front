import type { ImageSourcePropType } from 'react-native';
import type { MealDetailItem } from 'types/meal';

export type MealListItem = MealDetailItem & {
  imageSource?: ImageSourcePropType;
};

export type MealLog = Record<string, MealListItem[]>;

export type MealCalendarCell = {
  key: string;
  label: number | null;
  dateKey: string | null;
  isCurrentMonth: boolean;
  previewImage: ImageSourcePropType | null;
};
