import { useCallback, useEffect, useState } from 'react';
import type { MealCalendarPreviewMap } from '@pages/meal/types';
import type { MealCalendarDay } from 'types/meal';
import { getMealCalendar, normalizeMealCalendar } from '@api/mealApi';

type RefreshOptions = {
  silent?: boolean;
};

export const useMealCalendarPreview = (targetMonth: Date) => {
  const [previewMap, setPreviewMap] = useState<MealCalendarPreviewMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(
    async (month: Date = targetMonth, options?: RefreshOptions) => {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const response = await getMealCalendar({
          year: month.getFullYear(),
          month: month.getMonth() + 1,
        });
        const normalized = normalizeMealCalendar(response);
        const map = normalized.days.reduce<MealCalendarPreviewMap>(
          (acc: MealCalendarPreviewMap, day: MealCalendarDay) => {
            acc[day.date] = day;
            return acc;
          },
          {} as MealCalendarPreviewMap
        );
        setPreviewMap(map);
      } catch (err) {
        console.error('[useMealCalendarPreview] Failed to load calendar', err);
        setError('식단 달력을 불러오지 못했습니다.');
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [targetMonth]
  );

  useEffect(() => {
    void fetchPreview(targetMonth);
  }, [targetMonth, fetchPreview]);

  return {
    previewMap,
    isLoading,
    error,
    refresh: fetchPreview,
  };
};
