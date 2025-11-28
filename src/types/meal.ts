export type MealSequence = number;

/**
 * 식단 생성 요청 타입
 */
export type CreateMealRequest = {
  day: string; // yyyy-mm-dd
  title: string;
  kcal: number;
  sequence: MealSequence;
};

/**
 * 식단 생성 응답 타입
 */
export type CreateMealResponse = {
  mealId: string;
  imageUrl: string;
  uploadUrl: string;
};

/**
 * 식단 수정 요청 타입
 */
export type UpdateMealRequest = {
  title: string;
  kcal: number;
  sequence: MealSequence;
  changeImage: boolean;
};

export type UpdateMealResponse = {
  imageUrl: string | null;
  uploadUrl: string | null;
};

/**
 * 월별 식단 캘린더 조회 요청 타입 (Query)
 */
export type MealCalendarQuery = {
  year: number;
  month: number;
};

/**
 * 월별 식단 캘린더 조회 응답 타입 - 일자별 상세 정보 상세 타입
 */
export type MealCalendarDetail = {
  date: string;
  count: number;
  imageUrls: string[];
};

/**
 * 월별 식단 캘린더 조회 응답 타입
 */
export type MealCalendarApiResponse = {
  year: number;
  month: number;
  days: MealCalendarDetail[];
};

/**
 * 일별 식단 캘린더 조회 요청 타입 (Query)
 */
export type MealCalendarDayQuery = {
  day: string; // yyyy-mm-dd
};

/**
 * 일별 식단 캘린더 조회 응답 타입 - 일자별 상세 정보 상세 타입
 */
export type MealCalendarDayDetail = {
  mealId: number;
  title: string;
  kcal: number;
  imageUri: string | null;
  imageUpdatedAt?: number;
  sequence: MealSequence;
};

/**
 * 일별 식단 캘린더 조회 응답 타입
 */
export type MealCalendarDayApiResponse = {
  day: string; // yyyy-mm-dd
  totalKcal: number;
  meals: MealCalendarDayDetail[];
};

/**
 * 공통 식별자 타입
 */
export type MealIdentifier = {
  mealId: string;
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

export type MealDetailItem = {
  mealId: string;
  title: string;
  kcal: number;
  imageUri: string | null;
  sequence: MealSequence;
};

export type MealDayDetailResponse = {
  date: string;
  totalKcal: number;
  mealList: MealDetailItem[];
};
