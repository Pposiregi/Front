import type { MealLog } from './types';
/**
 * Mock Meal Log Data
 */
export const MOCK_MEAL_LOG: MealLog = {
  '2025-10-02': [
    {
      mealId: '2025-10-02-breakfast',
      title: '포케 샐러드',
      kcal: 398,
      sequence: 1,
      imageUri: '',
    },
    {
      mealId: '2025-10-02-lunch',
      title: '참치 샐러드',
      kcal: 412,
      sequence: 2,
      imageUri: '',
    },
  ],
  '2025-10-05': [
    {
      mealId: '2025-10-05-breakfast',
      title: '포케 샐러드',
      kcal: 400,
      sequence: 1,
      imageUri: '',
    },
    {
      mealId: '2025-10-05-lunch',
      title: '날치알 포케 샐러드',
      kcal: 434,
      sequence: 2,
      imageUri: '',
    },
  ],
  '2025-10-08': [
    {
      mealId: '2025-10-08-lunch',
      title: '연어 포케',
      kcal: 420,
      sequence: 1,
      imageUri: '',
    },
  ],
};
