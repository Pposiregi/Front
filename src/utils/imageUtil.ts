import type { MealListItem } from '@pages/meal/types';
import type { ImageSourcePropType } from 'react-native';

import mealPlaceholderImage from '@assets/images/meal.png';

/**
 * Meal페이지에서 사용할 이미지 정보를 가져옵니다.
 * @param mealList 이미지 객체 리스트
 * @returns
 */
export const resolveMealImageSources = (
  mealList: MealListItem[]
): ImageSourcePropType[] => {
  return mealList.map((meal) => {
    if (meal.imageSource) {
      return meal.imageSource;
    }
    if (meal.imageUri) {
      return { uri: meal.imageUri };
    }
    return mealPlaceholderImage;
  });
};

/**
 * Meal의 이미지 소스를 반환합니다.
 * @param meal 이미지 객체
 * @returns 이미지 소스
 */
export const resolveMealImageSource = (
  meal: MealListItem
): ImageSourcePropType => {
  if (meal.imageSource) {
    return meal.imageSource;
  }
  if (meal.imageUri) {
    return { uri: meal.imageUri };
  }
  return mealPlaceholderImage;
};
