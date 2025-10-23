export type MealSequence = number;

export type CreateMealRequest = {
  day: string; // yyyy-mm-dd
  title: string;
  kcal: number;
  sequence: MealSequence;
};

export type CreateMealResponse = {
  mealId: string;
  imageKey: string;
  uploadUrl: string;
};

export type UpdateMealRequest = {
  title: string;
  kcal: number;
  sequence: MealSequence;
};

export type MealCalendarQuery = {
  year: number;
  month: number;
};

export type MealCalendarDayApi = {
  date: string;
  count: number;
  imageUrls: string[];
};

export type MealCalendarApiResponse = {
  year: number;
  month: number;
  days: MealCalendarDayApi[];
};

export type MealCalendarDay = {
  date: string;
  count: number;
  imageUrls: string[];
};

export type MealCalendarResponse = {
  year: number;
  month: number;
  days: MealCalendarDay[];
};

export type MealDayDetailQuery = {
  date: string;
};

export type MealDetailItemApi = {
  meal_id: string;
  title: string;
  kcal: number;
  image_uri: string;
  sequence: MealSequence;
};

export type MealDayDetailApiResponse = {
  date: string;
  total_kcal: number;
  meal_list: MealDetailItemApi[];
};

export type MealDetailItem = {
  mealId: string;
  title: string;
  kcal: number;
  imageUri: string;
  sequence: MealSequence;
};

export type MealDayDetailResponse = {
  date: string;
  totalKcal: number;
  mealList: MealDetailItem[];
};

export type MealIdentifier = {
  mealId: string;
};
