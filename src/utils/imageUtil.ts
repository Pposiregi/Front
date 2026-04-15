import type { MealListItem } from '@pages/meal/types';
import type { ImageSourcePropType } from 'react-native';
import mealPlaceholderImage from '@assets/images/meal.png';

// 이미지 검수
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_DIMENSION = 8000; // px

type ImageAssetForValidation = {
  fileSize?: number;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
};

type ImageValidationMode = 'meal' | 'profile';

/**
 * 이미지 선택 결과(asset)를 검수한다.
 * @returns 문제가 없으면 null, 문제가 있으면 { title, message }
 */
export const validateImageAsset = (
  asset: ImageAssetForValidation,
  mode: ImageValidationMode = 'meal'
): { title: string; message: string } | null => {
  // 파일 크기
  if (asset.fileSize !== undefined && asset.fileSize > MAX_IMAGE_FILE_SIZE) {
    const sizeMB = (asset.fileSize / (1024 * 1024)).toFixed(1);
    return {
      title: '파일 용량 초과',
      message: `이미지 크기가 ${sizeMB}MB입니다.\n10MB 이하의 이미지를 사용해주세요.`,
    };
  }

  // 해상도
  if (
    (asset.width !== undefined && asset.width > MAX_IMAGE_DIMENSION) ||
    (asset.height !== undefined && asset.height > MAX_IMAGE_DIMENSION)
  ) {
    return {
      title: '이미지 해상도 초과',
      message: `이미지 해상도가 너무 큽니다.\n8000px 이하의 이미지를 사용해주세요.`,
    };
  }

  // 파일 형식
  const mimeType = asset.type?.toLowerCase() ?? '';
  const fileName = (asset.fileName ?? '').toLowerCase();

  if (mode === 'meal') {
    const allowedMime = new Set(['image/jpeg', 'image/jpg', 'image/png']);
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    const hasAllowedMime = !!mimeType && allowedMime.has(mimeType);
    const hasAllowedExt = allowedExt.some((ext) => fileName.endsWith(ext));
    if (!hasAllowedMime && !hasAllowedExt) {
      return {
        title: '이미지 형식 오류',
        message: '식단 사진은 JPG/JPEG/PNG 파일만 업로드할 수 있어요.',
      };
    }
  } else {
    const allowedMime = new Set(['image/jpeg', 'image/jpg', 'image/png']);
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    const hasAllowedMime = !!mimeType && allowedMime.has(mimeType);
    const hasAllowedExt = allowedExt.some((ext) => fileName.endsWith(ext));
    if (!hasAllowedMime && !hasAllowedExt) {
      return {
        title: '이미지 형식 오류',
        message: '프로필 사진은 JPG/JPEG/PNG 파일만 업로드할 수 있어요.',
      };
    }
  }

  return null;
};

const ZERO_SIZED_CACHE_LIMIT = 300;
const zeroSizedImageCache = new Map<string, boolean>();
const zeroSizedImagePending = new Map<string, Promise<boolean>>();

const setZeroSizedCache = (uri: string, isZero: boolean) => {
  zeroSizedImageCache.set(uri, isZero);
  if (zeroSizedImageCache.size <= ZERO_SIZED_CACHE_LIMIT) return;
  const oldestKey = zeroSizedImageCache.keys().next().value;
  if (oldestKey) {
    zeroSizedImageCache.delete(oldestKey);
  }
};

const parseHeaderNumber = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseContentRangeTotalSize = (
  contentRange: string | null
): number | null => {
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
    const contentLength = parseHeaderNumber(
      response.headers.get('content-length')
    );
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
    const contentLength = parseHeaderNumber(
      response.headers.get('content-length')
    );
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
      setZeroSizedCache(normalizedUri, isZero);
      return isZero;
    }

    const sizeByRange = await getSizeByRangeRequest(normalizedUri);
    if (sizeByRange === null) {
      setZeroSizedCache(normalizedUri, false);
      return false;
    }
    const isZero = sizeByRange === 0;
    setZeroSizedCache(normalizedUri, isZero);
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
