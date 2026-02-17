import type { MealListItem } from './types';

/**
 * 식단 모달 컴포넌트에 전달되는 props 타입 정의
 */
export type MealModalProps = {
  visible: boolean;
  formattedDate: string;
  selectedMeals: MealListItem[];
  mealTitle: string;
  mealCalories: string;
  totalCalories: number;
  onClose: () => void;
  onSave: () => void;
  onChangeMealTitle: (value: string) => void;
  onChangeMealCalories: (value: string) => void;
  isLoadingMeals: boolean;
  isSaving: boolean;
  isFutureDate: boolean;
  disableSave: boolean;
  disableInputs: boolean;
  deletingMealId: string | null;
  onDeleteMeal?: (mealId: string) => void;
  errorMessage?: string | null;
  pendingImageUri: string | null;
  onPickImage: () => void;
  onEditMeal: (meal: MealListItem) => void;
  editingMealId: string | null;
  editingMealTitle: string;
  editingMealCalories: string;
  onChangeEditingMealTitle: (value: string) => void;
  onChangeEditingMealCalories: (value: string) => void;
  onCancelEditMeal: () => void;
  onSubmitEditMeal: () => void;
  onPickEditingImage: () => void;
  editingMealImageUri: string | null;
  isUpdatingMeal: boolean;
};
