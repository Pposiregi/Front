import type { MealListItem } from './types';
import mealPlaceholderImage from '@assets/images/meal.png';

/**
 * 임시 식사 데이터
 */
export const PLACEHOLDER_MEAL: MealListItem = {
  mealId: 'placeholder',
  title: '',
  kcal: 0,
  sequence: 0,
  imageUri: '',
  imageSource: mealPlaceholderImage,
};

export const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];
