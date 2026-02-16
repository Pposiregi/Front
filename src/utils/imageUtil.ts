import type { MealListItem } from '@pages/meal/types';
import type { ImageSourcePropType } from 'react-native';

import mealPlaceholderImage from '@assets/images/meal.png';

const zeroSizedImageCache = new Map<string, boolean>();
const zeroSizedImagePending = new Map<string, Promise<boolean>>();

const parseHeaderNumber = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseContentRangeTotalSize = (contentRange: string | null): number | null => {
  if (!contentRange) return null;
  const match = contentRange.match(/\/(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
};

const getSizeByHead = async (uri: string): Promise<number | null> => {
  try {
    const response = await fetch(uri, { method: 'HEAD' });
    if (!response.ok) {
      return null;
    }
    const contentLength = parseHeaderNumber(response.headers.get('content-length'));
    return contentLength;
  } catch {
    return null;
  }
};

const getSizeByRangeRequest = async (uri: string): Promise<number | null> => {
  try {
    const response = await fetch(uri, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    });
    if (!response.ok) {
      return null;
    }
    const totalByRange = parseContentRangeTotalSize(
      response.headers.get('content-range')
    );
    if (totalByRange !== null) {
      return totalByRange;
    }
    const contentLength = parseHeaderNumber(response.headers.get('content-length'));
    return contentLength;
  } catch {
    return null;
  }
};

/**
 * 원격 이미지의 파일 크기가 0 byte인지 확인한다.
 * 크기를 확인할 수 없는 경우 false를 반환해 기존 이미지를 유지한다.
 */
export const isZeroSizedMealImage = async (uri: string): Promise<boolean> => {
  const normalizedUri = uri.trim();
  if (!normalizedUri) {
    return true;
  }

  const cached = zeroSizedImageCache.get(normalizedUri);
  if (typeof cached === 'boolean') {
    return cached;
  }

  const pending = zeroSizedImagePending.get(normalizedUri);
  if (pending) {
    return pending;
  }

  const task = (async () => {
    const sizeByHead = await getSizeByHead(normalizedUri);
    if (sizeByHead !== null) {
      const isZero = sizeByHead === 0;
      zeroSizedImageCache.set(normalizedUri, isZero);
      return isZero;
    }

    const sizeByRange = await getSizeByRangeRequest(normalizedUri);
    if (sizeByRange === null) {
      zeroSizedImageCache.set(normalizedUri, false);
      return false;
    }
    const isZero = sizeByRange === 0;
    zeroSizedImageCache.set(normalizedUri, isZero);
    return isZero;
  })().finally(() => {
    zeroSizedImagePending.delete(normalizedUri);
  });

  zeroSizedImagePending.set(normalizedUri, task);
  return task;
};

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
