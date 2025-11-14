import { useCallback, useEffect, useState } from 'react';
import { getMealDayDetail, normalizeMealDayDetail } from '@api/mealApi';
import type { MealDayDetailResponse } from 'types/meal';

type RefetchOptions = {
  keepPrevious?: boolean;
  silent?: boolean;
};

export const useMealDayDetail = (dateKey: string, enabled: boolean) => {
  const [detail, setDetail] = useState<MealDayDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (options?: RefetchOptions) => {
      if (!dateKey) return;

      setError(null);
      if (!options?.keepPrevious) {
        setDetail(null);
      }
      if (!options?.silent) {
        setIsLoading(true);
      }

      try {
        const response = await getMealDayDetail({ day: dateKey });
        console.log(
          '>>> MealDayDetail response:',
          JSON.stringify(response, null, 2)
        );

        const normalized = normalizeMealDayDetail(response);
        setDetail(normalized);
      } catch (err) {
        console.error(
          '>>> [useMealDayDetail]  MEAL 일자별 조회 API 가져오기 실패',
          err
        );
        setError('식단 정보를 불러오지 못했습니다.');
        if (!options?.keepPrevious) {
          setDetail(null);
        }
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [dateKey]
  );

  useEffect(() => {
    if (!enabled || !dateKey) return;
    void refetch({ keepPrevious: false });
  }, [enabled, dateKey, refetch]);

  const reset = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return {
    detail,
    isLoading,
    error,
    refetch,
    reset,
  };
};
