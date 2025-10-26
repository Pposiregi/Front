import axios from 'axios';
import type {
  CreateMealRequest,
  CreateMealResponse,
  MealCalendarQuery,
  MealCalendarApiResponse,
  MealCalendarResponse,
  MealDayDetailQuery,
  MealDayDetailApiResponse,
  MealDayDetailResponse,
  MealDetailItem,
  MealDetailItemApi,
  MealIdentifier,
  UpdateMealRequest,
} from 'types/meal';

const MEAL_BASE_PATH = '/api/meal';
const MEAL_CALENDAR_PATH = '/meal/calendar';

export const createMeal = async (
  payload: CreateMealRequest
): Promise<CreateMealResponse> => {
  const { data } = await axios.post<CreateMealResponse>(
    MEAL_BASE_PATH,
    payload
  );
  return data;
};

export const updateMeal = async (
  mealId: MealIdentifier['mealId'],
  payload: UpdateMealRequest
): Promise<void> => {
  await axios.put(`${MEAL_BASE_PATH}/${mealId}`, payload);
};

export const deleteMeal = async (
  mealId: MealIdentifier['mealId']
): Promise<void> => {
  await axios.delete(`${MEAL_BASE_PATH}/${mealId}`);
};

export const getMealCalendar = async (
  params: MealCalendarQuery
): Promise<MealCalendarApiResponse> => {
  const { data } = await axios.get<MealCalendarApiResponse>(
    MEAL_CALENDAR_PATH,
    { params }
  );
  return data;
};

export const getMealDayDetail = async (
  params: MealDayDetailQuery
): Promise<MealDayDetailApiResponse> => {
  const { data } = await axios.get<MealDayDetailApiResponse>(
    `${MEAL_BASE_PATH}/day`,
    { params }
  );
  return data;
};

export const normalizeMealCalendar = (
  response: MealCalendarApiResponse
): MealCalendarResponse => ({
  year: response.year,
  month: response.month,
  days: response.days.map((day) => ({
    date: day.date,
    count: day.count,
    imageUrls: day.imageUrls,
  })),
});

const normalizeMealDetailItem = (item: MealDetailItemApi): MealDetailItem => ({
  mealId: item.meal_id,
  title: item.title,
  kcal: item.kcal,
  imageUri: item.image_uri,
  sequence: item.sequence,
});

export const normalizeMealDayDetail = (
  response: MealDayDetailApiResponse
): MealDayDetailResponse => ({
  date: response.date,
  totalKcal: response.total_kcal,
  mealList: response.meal_list.map(normalizeMealDetailItem),
});
