import apiClient from './httpClient';
import type {
  CreateMealRequest,
  CreateMealResponse,
  MealCalendarQuery,
  MealCalendarApiResponse,
  MealCalendarDetail,
  MealCalendarDayQuery,
  MealCalendarDayApiResponse,
  MealCalendarDayDetail,
  MealCalendarResponse,
  MealDetailItem,
  MealDayDetailResponse,
  MealIdentifier,
  UpdateMealRequest,
} from 'types/meal';

const MEAL_BASE_PATH = '/meal'; // POST, PUT, DELETE
const GET_MEAL_DAY_PATH = '/report/meal/day';
const GET_MEAL_MONTH_PATH = '/report/meal/calendar';

/**
 * Meal 식단 생성
 * @param payload
 * @returns
 */
export const createMeal = async (
  payload: CreateMealRequest
): Promise<CreateMealResponse> => {
  const { data } = await apiClient.post<CreateMealResponse>(
    MEAL_BASE_PATH,
    payload
  );
  return data;
};

export const updateMeal = async (
  mealId: MealIdentifier['mealId'],
  payload: UpdateMealRequest
): Promise<void> => {
  await apiClient.put(`${MEAL_BASE_PATH}/${mealId}`, payload);
};

export const deleteMeal = async (
  mealId: MealIdentifier['mealId']
): Promise<void> => {
  await apiClient.delete(`${MEAL_BASE_PATH}/${mealId}`);
};

export const getMealCalendar = async (
  params: MealCalendarQuery
): Promise<MealCalendarApiResponse> => {
  const { data } = await apiClient.get<MealCalendarApiResponse>(
    GET_MEAL_MONTH_PATH,
    { params }
  );
  return data;
};

export const getMealDayDetail = async (
  params: MealCalendarDayQuery
): Promise<MealCalendarDayApiResponse> => {
  const { data } = await apiClient.get<MealCalendarDayApiResponse>(
    GET_MEAL_DAY_PATH,
    { params }
  );
  return data;
};

export const normalizeMealCalendar = (
  response: MealCalendarApiResponse
): MealCalendarResponse => {
  return {
    year: response.year,
    month: response.month,
    days: response.days.map((day: MealCalendarDetail) => ({
      date: day.date,
      count: day.count,
      imageUrls: day.imageUrls,
    })),
  };
};

type LegacyMealCalendarDayDetail = {
  meal_id?: string | number;
  image_uri?: string | null;
};

type LegacyMealCalendarDayResponse = {
  date?: string;
  total_kcal?: number;
  meal_list?: (MealCalendarDayDetail & LegacyMealCalendarDayDetail)[];
  mealList?: (MealCalendarDayDetail & LegacyMealCalendarDayDetail)[];
};

const normalizeMealDetailItem = (
  item: MealCalendarDayDetail & LegacyMealCalendarDayDetail
): MealDetailItem => ({
  mealId: String(item.mealId ?? item.meal_id ?? ''),
  title: item.title,
  kcal: item.kcal,
  imageUri: item.imageUri ?? item.image_uri ?? null,
  sequence: item.sequence,
});

export const normalizeMealDayDetail = (
  response: MealCalendarDayApiResponse & LegacyMealCalendarDayResponse
): MealDayDetailResponse => ({
  date: response.day ?? response.date ?? '',
  totalKcal: response.totalKcal ?? response.total_kcal ?? 0,
  mealList: (
    response.meals ??
    response.meal_list ??
    response.mealList ??
    []
  ).map(normalizeMealDetailItem),
});
