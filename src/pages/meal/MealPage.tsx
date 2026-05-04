import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '@styles/Meal.styles';
import { Colors } from '@styles/theme';
import type { MealListItem } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WEEKDAYS } from './constant';
import { formatDateKey, parseDateKey } from '@utils/dateUtil';
import { buildMonthMatrix } from '@hooks/useMealCalendarMatrix';
import { useSafeBottomSpacing } from '@hooks/useSafeBottomSpacing';
import MealModal from './MealModal';
import type { PendingMealImage } from './MealPage.types';
import { createMeal, deleteMeal, updateMeal } from '@api/mealApi';
import { useMealCalendarPreview } from '@api/hooks/useMealCalendarPreview';
import { useMealDayDetail } from '@api/hooks/useMealDayDetail';
import {
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import { uploadPhoto } from '@api/uploadPhoto';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { isAxiosError } from 'axios';
import mealPlaceholderImage from '@assets/images/meal.png';
import { isZeroSizedMealImage, validateImageAsset } from '@utils/imageUtil';

const MAX_STACK = 2;
const STACK_OFFSET_X = 8;
const HEADER_ICON_COLOR = Colors.accentStrong;

/* 2026.04.13 KKR] Image 리사이즈 기준치*/
const MAX_IMAGE_DIMENSION = 1600;
const MIN_IMAGE_DIMENSION = 1280;
const MAX_IMAGE_BYTES = 800 * 1024;
const COMPRESSION_STEPS = [
  { maxDimension: MAX_IMAGE_DIMENSION, quality: 80 },
  { maxDimension: 1440, quality: 75 },
  { maxDimension: MIN_IMAGE_DIMENSION, quality: 70 },
] as const;

/* 후면 카메라 설정 */
const IMAGE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  includeBase64: false,
  quality: 0.9,
};

const CAMERA_PICKER_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  includeBase64: false,
  quality: 0.9,
  cameraType: 'back',
  saveToPhotos: false,
};

const getDiaryTitle = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월의 식사`;

const getNextSequence = (meals: MealListItem[]) => {
  if (meals.length === 0) return 1;
  return (
    meals.reduce((max, meal) => {
      return Math.max(max, meal.sequence);
    }, 0) + 1
  );
};

const isUnsupportedImageAsset = (asset: {
  type?: string;
  fileName?: string;
}): boolean => {
  const mimeType = asset.type?.toLowerCase() ?? '';
  const fileName = asset.fileName?.toLowerCase() ?? '';
  const hasFileName = fileName.length > 0;

  // TODO: 나중에 공통 유틸에서 검사할 예정
  const isSupportedByMime =
    mimeType === 'image/jpeg' ||
    mimeType === 'image/jpg' ||
    mimeType === 'image/png';
  const isSupportedByExt =
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png');

  if (hasFileName) {
    return !isSupportedByExt;
  }

  return !isSupportedByMime;
};

const inferMimeTypeFromPath = (path?: string) => {
  const normalizedPath = path?.toLowerCase() ?? '';

  if (normalizedPath.endsWith('.png')) {
    return 'image/png';
  }

  if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.jpeg')) {
    return 'image/jpeg';
  }

  return undefined;
};

// picker가 MIME을 비워서 주는 경우를 대비해 파일명/URI 확장자로 업로드 타입을 보정한다.
const normalizePickedImageMimeType = (asset: {
  type?: string;
  fileName?: string;
  uri?: string;
}) => {
  const mimeType = asset.type?.toLowerCase();

  if (mimeType === 'image/png') {
    return mimeType;
  }

  if (mimeType === 'image/jpg' || mimeType === 'image/jpeg') {
    return 'image/jpeg';
  }

  return (
    inferMimeTypeFromPath(asset.fileName) ?? inferMimeTypeFromPath(asset.uri)
  );
};

// 2026.04.13 KKR] 이미지 리사이즈 & 압축 ---- START
/**
 * 로컬 URI에서 이미지의 실제 픽셀 크기 읽기
 * @param uri picker 메타데이터가 비어 있을 때 실제 이미지 크기를 읽어올 로컬 URI
 * @returns 이미지의 실제 width/height를 담은 Promise
 */
const getImageDimensions = (uri: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });

/**
 * 로컬 URI에서 이미지 파일 크기를 바이트 단위로 읽기
 * @param uri 로컬 이미지 파일 크기를 읽어올 URI
 * @returns 파일 크기(byte) 또는 읽기에 실패한 경우 null
 */
const getImageFileSize = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch (error) {
    if (__DEV__) {
      console.warn('>>> [MealPage] Failed to read local image size', {
        uri,
        error,
      });
    }
    return null;
  }
};

/**
 * picker asset의 압축 판단용 메타데이터 보강
 * @param asset picker가 반환한 원본 이미지 메타데이터
 * @returns 압축 판단에 필요한 width, height, fileSize를 보강한 객체
 */
const resolvePickedAssetMetadata = async (asset: Asset) => {
  let width = asset.width;
  let height = asset.height;
  let fileSize = asset.fileSize;

  if ((!width || !height) && asset.uri) {
    try {
      const size = await getImageDimensions(asset.uri);
      width = size.width;
      height = size.height;
    } catch (error) {
      if (__DEV__) {
        console.warn('>>> [MealPage] Failed to read image dimensions', {
          uri: asset.uri,
          error,
        });
      }
    }
  }

  if (!fileSize && asset.uri) {
    fileSize = (await getImageFileSize(asset.uri)) ?? undefined;
  }

  return { width, height, fileSize };
};

/**
 * 이미지가 후처리 압축 대상인지 판단
 * @param metadata 이미지 크기/용량 메타데이터
 * @returns 목표치(1600px, 800KB) 초과로 후처리 압축이 필요한지 여부
 */
const shouldCompressPickedAsset = (metadata: {
  width?: number;
  height?: number;
  fileSize?: number | null;
}) => {
  const longEdge =
    typeof metadata.width === 'number' && typeof metadata.height === 'number'
      ? Math.max(metadata.width, metadata.height)
      : null;

  return (
    (typeof longEdge === 'number' && longEdge > MAX_IMAGE_DIMENSION) ||
    // 바이트 크기를 확정하지 못하면 800KB 제한 우회를 막기 위해 압축 경로로 보낸다.
    typeof metadata.fileSize !== 'number' ||
    (typeof metadata.fileSize === 'number' &&
      metadata.fileSize > MAX_IMAGE_BYTES)
  );
};

/**
 * 업로드용 PendingMealImage 객체 생성
 * @param uri 업로드에 사용할 이미지 URI
 * @param type 업로드에 사용할 MIME 타입
 * @param fileName 업로드에 사용할 파일명
 * @returns 저장/수정 로직에서 공통으로 쓰는 PendingMealImage 객체
 */
const buildPendingMealImage = (
  uri: string,
  type?: string,
  fileName?: string
): PendingMealImage => ({
  uri,
  type,
  fileName,
});

/**
 * 이미지를 목표치에 맞게 단계적으로 JPEG 재인코딩
 * @param asset 선택 또는 촬영 직후의 원본 이미지 asset
 * @returns 목표치에 맞게 재인코딩된 PendingMealImage
 */
const compressPickedImage = async (asset: Asset) => {
  if (!asset.uri) {
    throw new Error('이미지 URI가 없습니다.');
  }

  let compressedImage: {
    uri: string;
    name: string;
    size: number;
  } | null = null;

  for (const step of COMPRESSION_STEPS) {
    const resized = await ImageResizer.createResizedImage(
      asset.uri,
      step.maxDimension,
      step.maxDimension,
      'JPEG',
      step.quality,
      0,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: true,
      }
    );

    compressedImage = {
      uri: resized.uri,
      name: resized.name,
      size: resized.size,
    };

    if (resized.size <= MAX_IMAGE_BYTES) {
      break;
    }
  }

  if (!compressedImage) {
    throw new Error('이미지 압축 결과를 생성하지 못했습니다.');
  }

  // 최종 단계까지 줄여도 상한을 넘기면 업로드 자체를 막아 목표 용량을 강제한다.
  if (compressedImage.size > MAX_IMAGE_BYTES) {
    throw new Error('이미지를 800KB 이하로 압축하지 못했습니다.');
  }

  if (__DEV__) {
    console.log('>>> [MealPage] Compressed meal image', {
      originalUri: asset.uri,
      compressedUri: compressedImage.uri,
      compressedSize: compressedImage.size,
    });
  }

  return buildPendingMealImage(
    compressedImage.uri,
    'image/jpeg',
    compressedImage.name || asset.fileName
  );
};

// 2026.04.13 KKR] 이미지 리사이즈 & 압축 ---- END

/**
 * 월 이동 기능, 일별 식단 미리보기를 표시하는 캘린더 그리드
 *
 * @returns 식단 일지 페이지를 나타내는 React 요소를 반환함
 */
function MealPage() {
  const { contentBottomPadding } = useSafeBottomSpacing();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]); // YYYY-MM-DD 형식

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() => todayKey);
  const [isMealModalVisible, setMealModalVisible] = useState(false);
  const [mealTitle, setMealTitle] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [deletingMealId, setDeletingMealId] = useState<string | null>(null);
  const [mealImage, setMealImage] = useState<PendingMealImage | null>(null);
  const [editingMealInfo, setEditingMealInfo] = useState<{
    mealId: string;
    sequence: number;
    imageUri: string | null;
  } | null>(null);
  const [editingMealTitle, setEditingMealTitle] = useState('');
  const [editingMealCalories, setEditingMealCalories] = useState('');
  const [editingMealImage, setEditingMealImage] =
    useState<PendingMealImage | null>(null);
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(false);
  const [failedCalendarImageMap, setFailedCalendarImageMap] = useState<
    Record<string, true>
  >({});
  const [zeroSizedCalendarImageMap, setZeroSizedCalendarImageMap] = useState<
    Record<string, true>
  >({});

  const {
    previewMap: calendarPreview,
    isLoading: isCalendarLoading,
    error: calendarError,
    refresh: refreshCalendar,
  } = useMealCalendarPreview(currentMonth);

  // 상세 식단 가능여부 = 모달이 열려있고, 선택된 날짜가 있을 때
  const isDetailEnabled = isMealModalVisible && Boolean(selectedDateKey);
  const {
    detail: selectedDayDetail,
    isLoading: isMealDetailLoading,
    error: dayDetailError,
    refetch: refetchDayDetail,
    reset: resetDayDetail,
  } = useMealDayDetail(selectedDateKey, isDetailEnabled);

  const weeks = useMemo(
    () => buildMonthMatrix(currentMonth, calendarPreview),
    [currentMonth, calendarPreview]
  );
  const calendarImageUris = useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(calendarPreview)
            .flatMap((day) => day.imageUrls ?? [])
            .map((uri) => uri.trim())
            .filter((uri) => uri.length > 0)
        )
      ),
    [calendarPreview]
  );

  const selectedMeals = useMemo<MealListItem[]>(() => {
    if (!selectedDayDetail?.mealList) {
      return [];
    }
    return [...selectedDayDetail.mealList]
      .sort((a, b) => a.sequence - b.sequence)
      .map((meal) => ({ ...meal }));
  }, [selectedDayDetail]);
  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey),
    [selectedDateKey]
  );
  const totalCalories = useMemo(() => {
    if (typeof selectedDayDetail?.totalKcal === 'number') {
      return selectedDayDetail.totalKcal;
    }
    return selectedMeals.reduce((sum, meal) => sum + meal.kcal, 0);
  }, [selectedDayDetail, selectedMeals]);

  const handleCancelEditMeal = useCallback(() => {
    setEditingMealInfo(null);
    setEditingMealTitle('');
    setEditingMealCalories('');
    setEditingMealImage(null);
  }, []);

  const handleStartEditMeal = useCallback((meal: MealListItem) => {
    setEditingMealInfo({
      mealId: meal.mealId,
      sequence: meal.sequence,
      imageUri: meal.imageUri ?? null,
    });
    setEditingMealTitle(meal.title);
    setEditingMealCalories(String(meal.kcal));
    setEditingMealImage(null);
  }, []);

  const handleCloseModal = () => {
    setMealModalVisible(false);
    setMealTitle('');
    setMealCalories('');
    resetDayDetail();
    setMealImage(null);
    handleCancelEditMeal();
  };

  const handleChangeMonth = (offset: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      setSelectedDateKey((prevKey) => {
        const current = parseDateKey(prevKey);
        if (
          current.getFullYear() === next.getFullYear() &&
          current.getMonth() === next.getMonth()
        ) {
          return prevKey;
        }
        return formatDateKey(next);
      });
      return next;
    });
  };

  const handleSelectDate = (dateKey: string | null) => {
    if (!dateKey) return;
    setSelectedDateKey(dateKey);
    setMealModalVisible(true);
  };

  /**
   * 안드로이드에서 사진 접근 권한 요청
   */
  const requestPhotoPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    const sdkVersion = Number(Platform.Version);
    const permission =
      sdkVersion >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (alreadyGranted) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission, {
      title: '갤러리 접근 권한',
      message: '식단 사진을 선택하려면 갤러리 접근 권한이 필요합니다.',
      buttonPositive: '허용',
    });
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        '권한 필요',
        '설정에서 갤러리 접근 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정 열기',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('권한 필요', '이미지를 선택하려면 권한을 허용해주세요.');
    }
    return false;
  }, []);

  /**
   * picker asset을 업로드 가능한 이미지로 최종 정리
   * @param asset picker가 반환한 원본 이미지 asset
   * @param onSelected 최종 정리된 이미지를 상태로 반영하는 콜백
   * @param onRejected 이미지 형식 오류 등으로 선택을 취소할 때 실행할 콜백
   * @returns 이미지 검증, 메타데이터 보강, 필요 시 JPEG 재인코딩까지 수행하는 Promise
   */
  const finalizePickedImage = useCallback(
    async (
      asset: Asset,
      onSelected: (image: PendingMealImage) => void,
      onRejected?: () => void
    ) => {
      if (!asset.uri) {
        Alert.alert('이미지 선택', '선택한 이미지 정보를 읽을 수 없습니다.');
        return;
      }

      if (isUnsupportedImageAsset(asset)) {
        onRejected?.();
        Alert.alert(
          '이미지 형식 오류',
          '현재 JPG/JPEG/PNG 파일만 업로드할 수 있어요.'
        );
        return;
      }

      try {
        const metadata = await resolvePickedAssetMetadata(asset);
        const normalizedImage = shouldCompressPickedAsset(metadata)
          ? await compressPickedImage(asset)
          : buildPendingMealImage(
              asset.uri,
              normalizePickedImageMimeType(asset),
              asset.fileName
            );

        onSelected(normalizedImage);
      } catch (error) {
        onRejected?.();
        console.error('[MealPage] Failed to prepare meal image', error);
        const message =
          error instanceof Error &&
          error.message === '이미지를 800KB 이하로 압축하지 못했습니다.'
            ? '선택한 사진이 너무 커서 업로드할 수 없습니다. 다른 사진을 선택해주세요.'
            : '사진을 처리하는 중 문제가 발생했습니다. 다시 시도해주세요.';
        Alert.alert('이미지 처리', message);
      }
    },
    []
  );

  const pickImageFromLibrary = useCallback(
    (
      onSelected: (image: PendingMealImage) => void,
      onRejected?: () => void
    ) => {
      const pick = () =>
        launchImageLibrary(
          IMAGE_LIBRARY_OPTIONS,
          (response: ImagePickerResponse) => {
            if (response.didCancel) return;
            if (response.errorCode) {
              Alert.alert(
                '이미지 선택',
                response.errorMessage ?? '이미지를 불러오지 못했습니다.'
              );
              return;
            }
            const asset = response.assets?.[0];
            if (!asset) {
              Alert.alert(
                '이미지 선택',
                '선택한 이미지 정보를 읽을 수 없습니다.'
              );
              return;
            }
            const validationError = validateImageAsset(asset, 'meal');
            if (validationError) {
              onRejected?.();
              Alert.alert(validationError.title, validationError.message);
              return;
            }
            finalizePickedImage(asset, onSelected, onRejected).catch(
              (error) => {
                console.error(
                  '[MealPage] Failed to finalize library image',
                  error
                );
              }
            );
          }
        );

      if (Platform.OS === 'android') {
        requestPhotoPermission().then((granted) => {
          if (granted) {
            pick();
          } else {
            setMealModalVisible(false);
            Alert.alert(
              '권한 필요',
              '이미지를 선택하려면 갤러리 접근을 허용해주세요.'
            );
          }
        });
        return;
      }
      pick();
    },
    [finalizePickedImage, requestPhotoPermission]
  );

  /* 2026.04.13 KKR] 카메라 기능 추가  ---- START */
  /**
   * Android 카메라 권한 확인, 요청
   * @returns Android에서 카메라 권한이 확보되었는지 여부
   */
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (alreadyGranted) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission, {
      title: '카메라 접근 권한',
      message: '식단 사진을 촬영하려면 카메라 접근 권한이 필요합니다.',
      buttonPositive: '허용',
    });

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert('권한 필요', '설정에서 카메라 접근 권한을 허용해주세요.', [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]);
    } else {
      Alert.alert(
        '권한 필요',
        '식단 사진을 촬영하려면 카메라 접근 권한이 필요합니다.'
      );
    }

    return false;
  }, []);

  /**
   * 카메라 실행 및 결과 이미지 후처리
   * @param onSelected 최종 정리된 이미지를 상태로 반영하는 콜백
   * @param onRejected 이미지 형식 오류 등으로 선택을 취소할 때 실행할 콜백
   * @returns 카메라 실행과 후처리까지 포함한 Promise
   */
  const pickImageFromCamera = useCallback(
    async (
      onSelected: (image: PendingMealImage) => void,
      onRejected?: () => void
    ) => {
      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }

      launchCamera(CAMERA_PICKER_OPTIONS, (response: ImagePickerResponse) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            '사진 촬영',
            response.errorMessage ?? '카메라를 실행하지 못했습니다.'
          );
          return;
        }

        const asset = response.assets?.[0];
        if (!asset) {
          Alert.alert('사진 촬영', '촬영한 이미지 정보를 읽을 수 없습니다.');
          return;
        }

        if (isUnsupportedImageAsset(asset)) {
          onRejected?.();
          Alert.alert(
            '이미지 형식 오류',
            '현재 JPG/JPEG/PNG 파일만 업로드할 수 있어요.'
          );
          return;
        }

        finalizePickedImage(asset, onSelected, onRejected).catch((error) => {
          console.error(
            '[MealPage] 카메라 이미지 최종 업로드를 실패했어요. ',
            error
          );
        });
      });
    },
    [finalizePickedImage, requestCameraPermission]
  );

  /**
   * 사진 입력 소스 선택을 위한 액션시트 열기
   *
   * @param onSelected 최종 정리된 이미지를 상태로 반영하는 콜백
   * @param onRejected 이미지 형식 오류 등으로 선택을 취소할 때 실행할 콜백
   * @returns 사용자의 입력 소스 선택에 따라 카메라 또는 앨범 흐름을 여는 함수
   */
  const openImageSourcePicker = useCallback(
    (
      onSelected: (image: PendingMealImage) => void,
      onRejected?: () => void
    ) => {
      Alert.alert('식단 사진 추가', '사진을 어떻게 추가할까요?', [
        {
          text: '카메라로 촬영',
          onPress: () => {
            pickImageFromCamera(onSelected, onRejected).catch((error) => {
              console.error('[MealPage] Failed to launch camera', error);
            });
          },
        },
        {
          text: '앨범에서 선택',
          onPress: () => {
            pickImageFromLibrary(onSelected, onRejected);
          },
        },
        { text: '취소', style: 'cancel' },
      ]);
    },
    [pickImageFromCamera, pickImageFromLibrary]
  );
  /* 2026.04.13 KKR] 카메라 기능 추가  ---- END */

  const handlePickMealImage = useCallback(() => {
    openImageSourcePicker(
      (image) => setMealImage(image),
      () => setMealImage(null)
    );
  }, [openImageSourcePicker]);

  const handlePickEditingMealImage = useCallback(() => {
    if (!editingMealInfo) return;
    openImageSourcePicker(
      (image) => setEditingMealImage(image),
      () => setEditingMealImage(null)
    );
  }, [editingMealInfo, openImageSourcePicker]);

  /**
   * 컴포넌트 마운트 시 안드로이드 권한 체크
   * 팝업 시마다 권한 요청이 뜨는 것을 방지하기 위함
   */
  useEffect(() => {
    handleCancelEditMeal();
  }, [selectedDateKey, handleCancelEditMeal]);

  useEffect(() => {
    let isCancelled = false;

    if (calendarImageUris.length === 0) {
      setZeroSizedCalendarImageMap({});
      return () => {
        isCancelled = true;
      };
    }

    setFailedCalendarImageMap((prev) => {
      const next: Record<string, true> = {};
      calendarImageUris.forEach((uri) => {
        if (prev[uri]) {
          next[uri] = true;
        }
      });
      return next;
    });

    Promise.all(
      calendarImageUris.map(async (uri) => ({
        uri,
        isZeroSized: await isZeroSizedMealImage(uri),
      }))
    )
      .then((results) => {
        if (isCancelled) {
          return;
        }

        const next: Record<string, true> = {};
        results.forEach(({ uri, isZeroSized }) => {
          if (isZeroSized) {
            next[uri] = true;
          }
        });
        setZeroSizedCalendarImageMap(next);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        console.warn(
          '>>> [MealPage] calendar zero-sized 이미지 확인 실패',
          error
        );
        // 실패 시 안전한 기본값으로 초기화해 stale 상태를 남기지 않는다.
        setZeroSizedCalendarImageMap({});
      });

    return () => {
      isCancelled = true;
    };
  }, [calendarImageUris]);

  const markCalendarImageFailed = useCallback((uri: string | null) => {
    if (!uri) return;
    setFailedCalendarImageMap((prev) => {
      if (prev[uri]) return prev;
      return { ...prev, [uri]: true };
    });
  }, []);

  /**
   * 식단 저장 핸들러
   * - Backend API를 통한 최초 식단 생성
   * - 이미지가 있을 경우 S3 업로드 처리
   * - 캘린더 및 상세 데이터 리프레시
   */
  const handleSaveMeal = async () => {
    if (isSavingMeal) return;
    const trimmedTitle = mealTitle.trim();
    const trimmedCalories = mealCalories.trim();
    if (!trimmedTitle) {
      Alert.alert('식단 등록', '메뉴 이름을 입력해주세요.');
      return;
    }
    if (!trimmedCalories) {
      Alert.alert('식단 등록', '칼로리를 입력해주세요.');
      return;
    }
    const kcalValue = Number(trimmedCalories);
    if (Number.isNaN(kcalValue) || kcalValue < 0) {
      Alert.alert('식단 등록', '칼로리는 숫자로 입력해주세요.');
      return;
    }

    console.log('>>> handleSaveMeal 시작', {
      selectedDateKey,
      trimmedTitle,
      kcalValue,
      hasMealImage: Boolean(mealImage?.uri),
    });

    setIsSavingMeal(true);

    try {
      const existImage = Boolean(mealImage?.uri);

      // 1. 식단 생성 API 호출
      const creationResult = await createMeal({
        day: selectedDateKey,
        title: trimmedTitle,
        kcal: kcalValue,
        sequence: getNextSequence(selectedMeals),
        existImage,
      });

      // 헤더정보 추출해야함
      console.log('>>> Created 결과: ' + JSON.stringify(creationResult));

      // 2. 이미지가 있을 경우 업로드 처리
      if (existImage && mealImage?.uri && creationResult.uploadUrl) {
        console.log('>>> 이미지 업로드 시작');
        await uploadPhoto(creationResult.uploadUrl, {
          uri: mealImage.uri,
          mimeType: mealImage.type,
          fileName: mealImage.fileName,
        });
      } else {
        console.log('>>> 이미지 업로드 생략', {
          hasMealImage: Boolean(mealImage?.uri),
          hasUploadUrl: Boolean(creationResult.uploadUrl),
        });
      }

      // 3. 캘린더 및 상세 데이터 리프레시
      await refreshCalendar(currentMonth, { silent: true });
      await refetchDayDetail({
        keepPrevious: false,
        silent: true,
      });
      // 연속 추가를 위해 모달은 닫지 않고 입력만 초기화한다.
      setMealTitle('');
      setMealCalories('');
      setMealImage(null);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('>>>[MealPage] Meal API error detail', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
        });
      }
      console.error('>>>[MealPage] Failed to save meal', {
        error,
        selectedDateKey,
        hasMealImage: Boolean(mealImage?.uri),
      });
      Alert.alert(
        '식단 등록',
        '식단 저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSavingMeal(false);
    }
  };

  const handleSubmitEditMeal = useCallback(async () => {
    if (!editingMealInfo || isUpdatingMeal) return;
    const trimmedTitle = editingMealTitle.trim();
    const trimmedCalories = editingMealCalories.trim();
    if (!trimmedTitle) {
      Alert.alert('식단 수정', '메뉴 이름을 입력해주세요.');
      return;
    }
    if (!trimmedCalories) {
      Alert.alert('식단 수정', '칼로리를 입력해주세요.');
      return;
    }
    const kcalValue = Number(trimmedCalories);
    if (Number.isNaN(kcalValue) || kcalValue < 0) {
      Alert.alert('식단 수정', '칼로리는 숫자로 입력해주세요.');
      return;
    }

    setIsUpdatingMeal(true);
    try {
      const changeImage = Boolean(editingMealImage?.uri);
      const updateResult = await updateMeal(editingMealInfo.mealId, {
        title: trimmedTitle,
        kcal: kcalValue,
        sequence: editingMealInfo.sequence,
        changeImage,
      });

      if (changeImage && editingMealImage?.uri && updateResult.uploadUrl) {
        await uploadPhoto(updateResult.uploadUrl, {
          uri: editingMealImage.uri,
          mimeType: editingMealImage.type,
          fileName: editingMealImage.fileName,
        });
      }

      await refreshCalendar(currentMonth, { silent: true });
      await refetchDayDetail({
        keepPrevious: true,
        silent: true,
      });
      handleCancelEditMeal();
    } catch (error) {
      console.error('>>>[MealPage] Failed to update meal', {
        error,
        editingMealInfo,
      });
      Alert.alert(
        '식단 수정',
        '식단 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsUpdatingMeal(false);
    }
  }, [
    editingMealInfo,
    editingMealTitle,
    editingMealCalories,
    editingMealImage,
    isUpdatingMeal,
    refreshCalendar,
    currentMonth,
    refetchDayDetail,
    handleCancelEditMeal,
  ]);

  const executeDeleteMeal = useCallback(
    async (mealId: string) => {
      setDeletingMealId(mealId);
      try {
        await deleteMeal(mealId);
        await refreshCalendar(currentMonth);
        await refetchDayDetail();
      } catch (error) {
        console.error('[MealPage] Failed to delete meal', error);
        Alert.alert(
          '식단 삭제',
          '식단 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setDeletingMealId(null);
      }
    },
    [currentMonth, refreshCalendar, refetchDayDetail]
  );

  const handleDeleteMealRequest = useCallback(
    (mealId: string) => {
      if (deletingMealId) return;
      Alert.alert('식단 삭제', '해당 식단을 삭제할까요?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            executeDeleteMeal(mealId).catch((error) => {
              console.error('[MealPage] Unexpected delete failure', error);
            });
          },
        },
      ]);
    },
    [deletingMealId, executeDeleteMeal]
  );

  const formattedModalDate = useMemo(() => {
    return `${selectedDate.getFullYear()}년 ${
      selectedDate.getMonth() + 1
    }월 ${selectedDate.getDate()}일`;
  }, [selectedDate]);
  const scrollContentStyle = useMemo(
    () => [
      styles.content,
      // 식단 화면의 달력/기록 하단이 탭바나 시스템 내비게이션 바 아래로 숨지 않게 한다.
      { paddingBottom: contentBottomPadding },
    ],
    [contentBottomPadding]
  );
  const isFutureDate = selectedDateKey > todayKey;

  const disableSaveButton =
    isSavingMeal ||
    isMealDetailLoading ||
    isFutureDate ||
    mealTitle.trim().length === 0 ||
    mealCalories.trim().length === 0;
  const disableInputs = isSavingMeal || isMealDetailLoading || isFutureDate;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={scrollContentStyle}>
        <View style={[styles.header, styles.headerSpacing]}>
          {/*  TouchableOpacity : 이전 달로 이동 */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => handleChangeMonth(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonLabel}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{getDiaryTitle(currentMonth)}</Text>

          {/*  TouchableOpacity : 다음 달로 이동 */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => handleChangeMonth(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonLabel}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.calendarContainer, styles.sectionSpacing]}>
          {/* 달력 월 표시 */}
          <View style={styles.calendarMonthRow}>
            {isCalendarLoading ? (
              <ActivityIndicator
                size='small'
                color={HEADER_ICON_COLOR}
                style={styles.calendarLoadingIndicator}
              />
            ) : null}
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekHeaderRow}>
            {WEEKDAYS.map((weekday) => (
              <Text key={weekday} style={styles.weekDayLabel}>
                {weekday}
              </Text>
            ))}
          </View>

          {/* 달력 날짜 그리드 */}
          {weeks.map((week, weekIndex) => (
            <View
              key={`week-${weekIndex}`}
              style={[
                styles.weekRow,
                weekIndex === weeks.length - 1 ? { marginBottom: 0 } : null,
              ]}
            >
              {week.map((cell, cellIdx) => {
                const isSelected = cell.dateKey === selectedDateKey;
                const isToday = cell.dateKey === todayKey;
                const showDay = cell.dateKey;

                return (
                  <View key={`${cell.key}-${cellIdx}`} style={styles.dayCell}>
                    {/* 날짜가 있는 셀인지 확인, 있을 경우에만 눌러서 모달 열기 가능 */}
                    {showDay ? (
                      <TouchableOpacity
                        style={[
                          styles.dayInner,
                          isSelected ? styles.selectedDayBackground : null,
                          !isSelected && isToday
                            ? styles.todayDayOutline
                            : null,
                        ]}
                        onPress={() => handleSelectDate(cell.dateKey)}
                        activeOpacity={0.8}
                      >
                        {/* 날짜 숫자 */}
                        <Text
                          style={[
                            styles.dayNumber,
                            cell.isCurrentMonth ? null : styles.dayNumberMuted,
                            isSelected ? styles.selectedDayNumber : null,
                            !isSelected && isToday
                              ? styles.todayDayNumber
                              : null,
                          ]}
                        >
                          {cell.dayNumber}
                        </Text>

                        {/* 식단 이미지가 있다면, 그 이미지를 겹쳐서 보여줘야한다 */}
                        <View style={styles.stackThumb}>
                          {Array.isArray(cell.previewImage) &&
                          cell.previewImage.length > 0 ? (
                            cell.previewImage
                              .slice(0, MAX_STACK)
                              .map((imgSrc, i) => {
                                const uri =
                                  typeof imgSrc === 'object' &&
                                  imgSrc !== null &&
                                  'uri' in imgSrc &&
                                  typeof imgSrc.uri === 'string'
                                    ? imgSrc.uri
                                    : null;
                                const source: ImageSourcePropType =
                                  uri &&
                                  (zeroSizedCalendarImageMap[uri] ||
                                    failedCalendarImageMap[uri])
                                    ? mealPlaceholderImage
                                    : imgSrc;

                                return (
                                  <Image
                                    key={uri ?? `placeholder-${i}`}
                                    source={source}
                                    style={[
                                      styles.stackImage,
                                      {
                                        left: i * STACK_OFFSET_X,
                                        zIndex: MAX_STACK - i,
                                      }, // 살짝씩 오른쪽으로 가도록
                                    ]}
                                    resizeMode='cover'
                                    onError={() => markCalendarImageFailed(uri)}
                                  />
                                );
                              })
                          ) : (
                            <View style={styles.dayPreviewPlaceholder}>
                              <Text style={styles.dayPreviewPlaceholderText}>
                                ＋
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.dayEmptySlot} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        {/* 할 수 있다면 이미지 넣기 */}

        {calendarError ? (
          <Text style={styles.calendarErrorText}>{calendarError}</Text>
        ) : (
          <Text style={styles.calendarHelperText}>
            날짜를 선택해서 식단을 등록해보세요.
          </Text>
        )}
      </ScrollView>

      {/* 식단 모달 추가 */}
      <MealModal
        visible={isMealModalVisible}
        formattedDate={formattedModalDate}
        selectedMeals={selectedMeals}
        mealTitle={mealTitle}
        mealCalories={mealCalories}
        totalCalories={totalCalories}
        onClose={handleCloseModal}
        onSave={handleSaveMeal}
        onChangeMealTitle={(value) => setMealTitle(value)}
        onChangeMealCalories={(value) => setMealCalories(value)}
        isLoadingMeals={isMealDetailLoading}
        isSaving={isSavingMeal}
        isFutureDate={isFutureDate}
        disableSave={disableSaveButton}
        disableInputs={disableInputs}
        deletingMealId={deletingMealId}
        onDeleteMeal={handleDeleteMealRequest}
        errorMessage={dayDetailError}
        pendingImageUri={mealImage?.uri ?? null}
        onPickImage={handlePickMealImage}
        onEditMeal={handleStartEditMeal}
        editingMealId={editingMealInfo?.mealId ?? null}
        editingMealTitle={editingMealTitle}
        editingMealCalories={editingMealCalories}
        onChangeEditingMealTitle={setEditingMealTitle}
        onChangeEditingMealCalories={setEditingMealCalories}
        onCancelEditMeal={handleCancelEditMeal}
        onSubmitEditMeal={handleSubmitEditMeal}
        onPickEditingImage={handlePickEditingMealImage}
        editingMealImageUri={editingMealImage?.uri ?? null}
        isUpdatingMeal={isUpdatingMeal}
      />
    </SafeAreaView>
  );
}

export default MealPage;
