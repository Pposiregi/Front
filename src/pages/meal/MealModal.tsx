import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from '@styles/Meal.styles';
import { Colors, Spacing } from '@styles/theme';
import modifyIcon from '@assets/images/icon/modify_icon.png';
import deleteIcon from '@assets/images/icon/delete_icon.png';
import mealPlaceholderImage from '@assets/images/meal.png';
import { isZeroSizedMealImage, resolveMealImageSource } from '@utils/imageUtil';
import type { MealModalProps } from './MealModal.types';
import { KeyboardAwareModalContent } from '@components/KeyboardAwareScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MODAL_LOADING_COLOR = Colors.accentStrong;
const MODAL_MUTED_LOADING_COLOR = Colors.textMuted;

const getPreviewableImageSource = (source: ImageSourcePropType) => {
  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    return null;
  }
  const uri = 'uri' in source ? source.uri : undefined;
  if (typeof uri !== 'string' || uri.trim().length === 0) {
    return null;
  }
  return source;
};

/**
 * 지정된 날짜의 식단을 조회하고 수정할 수 있는 모달을 렌더링한다.
 *
 * @param visible - 모달의 표시 여부를 제어함
 * @param formattedDate - 모달 헤더에 표시될 날짜 문자열
 * @param selectedMeals - 모달에 표시될 식단 항목 배열; 비어 있을 경우 기본(placeholder) 식단을 표시함
 * @param mealTitle - 새 식단 제목 입력창의 제어된 값
 * @param mealCalories - 새 식단 칼로리 입력창의 제어된 값
 * @param totalCalories - 모달 하단에 표시되는 총 칼로리 합계
 * @param onClose - 모달을 닫을 때 호출되는 콜백 함수
 * @param onSave - 변경 사항을 저장할 때 호출되는 콜백 함수
 * @param onChangeMealTitle - 새 식단 제목 입력값이 변경될 때 호출되는 핸들러
 * @param onChangeMealCalories - 새 식단 칼로리 입력값이 변경될 때 호출되는 핸들러
 * @param isLoadingMeals - 식단 상세 정보를 가져오는 동안 true
 * @param isSaving - 저장 요청 진행 여부
 * @param disableSave - 저장 버튼을 비활성화할지 여부
 * @param disableInputs - 입력 필드를 비활성화할지 여부
 * @param deletingMealId - 삭제 중인 식단의 ID (스피너 표시용)
 * @param onDeleteMeal - 식단 삭제 버튼을 눌렀을 때 호출되는 핸들러
 * @param errorMessage - 식단 목록을 불러오지 못한 경우 표시할 메시지
 * @returns 식단 수정 모달을 나타내는 JSX 요소를 반환함
 */
function MealModal({
  visible,
  formattedDate,
  selectedMeals,
  mealTitle,
  mealCalories,
  totalCalories,
  onClose,
  onSave,
  onChangeMealTitle,
  onChangeMealCalories,
  isLoadingMeals,
  isSaving,
  isFutureDate,
  disableSave,
  disableInputs,
  deletingMealId,
  onDeleteMeal,
  errorMessage,
  pendingImageUri,
  onPickImage,
  onEditMeal,
  editingMealId,
  editingMealTitle,
  editingMealCalories,
  onChangeEditingMealTitle,
  onChangeEditingMealCalories,
  onCancelEditMeal,
  onSubmitEditMeal,
  onPickEditingImage,
  editingMealImageUri,
  isUpdatingMeal,
}: MealModalProps) {
  const insets = useSafeAreaInsets();
  const [zeroSizedImageMap, setZeroSizedImageMap] = useState<
    Record<string, true>
  >({});
  const [failedImageMap, setFailedImageMap] = useState<Record<string, true>>(
    {}
  );
  const [previewImageSource, setPreviewImageSource] =
    useState<ImageSourcePropType | null>(null);

  useEffect(() => {
    if (!visible) {
      setPreviewImageSource(null);
    }
  }, [visible]);

  const mealImageUris = useMemo(
    () =>
      Array.from(
        new Set(
          selectedMeals
            .map((meal) =>
              typeof meal.imageUri === 'string' ? meal.imageUri.trim() : ''
            )
            .filter((uri): uri is string => uri.length > 0)
        )
      ),
    [selectedMeals]
  );

  useEffect(() => {
    let isCancelled = false;

    if (mealImageUris.length === 0) {
      setZeroSizedImageMap({});
      setFailedImageMap({});
      return () => {
        isCancelled = true;
      };
    }

    setZeroSizedImageMap((prev) => {
      const next: Record<string, true> = {};
      mealImageUris.forEach((uri) => {
        if (prev[uri]) {
          next[uri] = true;
        }
      });
      return next;
    });
    setFailedImageMap((prev) => {
      const next: Record<string, true> = {};
      mealImageUris.forEach((uri) => {
        if (prev[uri]) {
          next[uri] = true;
        }
      });
      return next;
    });

    Promise.all(
      mealImageUris.map(async (uri) => ({
        uri,
        isZeroSized: await isZeroSizedMealImage(uri),
      }))
    )
      .then((results) => {
        if (isCancelled) {
          return;
        }
        setZeroSizedImageMap((prev) => {
          const next = { ...prev };
          results.forEach(({ uri, isZeroSized }) => {
            if (isZeroSized) {
              next[uri] = true;
            } else {
              delete next[uri];
            }
          });
          return next;
        });
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        console.warn('>>> [MealModal] zero-sized 이미지 확인 실패', error);
        // 실패 시 기존 캐시를 유지해 불필요한 이미지 재시도를 줄인다.
        setZeroSizedImageMap((prev) => prev);
      });

    return () => {
      isCancelled = true;
    };
  }, [mealImageUris]);

  const markImageFailed = useCallback((uri: string | null) => {
    if (!uri) {
      return;
    }
    setFailedImageMap((prev) => {
      if (prev[uri]) {
        return prev;
      }
      return { ...prev, [uri]: true };
    });
  }, []);

  const resolveModalMealImage = useCallback(
    (
      meal: MealModalProps['selectedMeals'][number],
      isEditingTarget: boolean
    ): ImageSourcePropType => {
      // 모달 전용 래퍼:
      // 1) 편집 중 임시 이미지 우선, 2) 0byte/로드 실패 이미지는 placeholder 치환,
      // 3) 그 외 기본 resolveMealImageSource로 위임.
      if (isEditingTarget && editingMealImageUri) {
        return { uri: editingMealImageUri };
      }

      const imageUri =
        typeof meal.imageUri === 'string' ? meal.imageUri.trim() : null;
      if (
        imageUri &&
        (zeroSizedImageMap[imageUri] || failedImageMap[imageUri])
      ) {
        return mealPlaceholderImage;
      }

      return resolveMealImageSource(meal);
    },
    [editingMealImageUri, failedImageMap, zeroSizedImageMap]
  );

  const photoRowItems: {
    key: string;
    source: ImageSourcePropType;
    uriForError: string | null;
  }[] = useMemo(() => {
    const items = selectedMeals.map((meal) => {
      const isEditingTarget = editingMealId === meal.mealId;
      const mealImageUri =
        typeof meal.imageUri === 'string' ? meal.imageUri.trim() : null;
      return {
        key: `photo-${meal.mealId}`,
        source: resolveModalMealImage(meal, isEditingTarget),
        uriForError:
          isEditingTarget && editingMealImageUri ? null : mealImageUri,
      };
    });

    if (pendingImageUri) {
      items.push({
        key: 'pending',
        source: { uri: pendingImageUri },
        uriForError: null,
      });
    }

    return items;
  }, [
    editingMealId,
    editingMealImageUri,
    pendingImageUri,
    resolveModalMealImage,
    selectedMeals,
  ]);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          <KeyboardAwareModalContent
            contentContainerStyle={styles.mealModalKeyboardContent}
          >
            <View style={styles.modalContentWrapper}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderSection}>
                  <Text style={styles.modalTitle}>{formattedDate}</Text>
                  {!isFutureDate ? (
                    <Text style={styles.modalSubtitle}>
                      오늘의 식단을 기록해요!
                    </Text>
                  ) : null}
                </View>

                {isFutureDate ? (
                  <View style={styles.modalFutureNoticeBox}>
                    <View style={styles.modalFutureNoticeIconWrap}>
                      <Text style={styles.modalFutureNoticeIcon}>!</Text>
                    </View>
                    <View style={styles.modalFutureNoticeBody}>
                      <Text style={styles.modalFutureNoticeTitle}>
                        기록 불가
                      </Text>
                      <Text style={styles.modalFutureNoticeText}>
                        미래에 대한 식단은 등록하지 못해요.
                      </Text>
                    </View>
                  </View>
                ) : null}

                {photoRowItems.length > 0 ? (
                  <ScrollView
                    horizontal
                    style={styles.modalPhotoRowScroll}
                    contentContainerStyle={styles.modalPhotoRow}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps='handled'
                  >
                    {photoRowItems.map((item) => (
                      <TouchableOpacity
                        key={`modal-photo-${item.key}`}
                        style={styles.modalPhotoCard}
                        activeOpacity={0.85}
                        disabled={!getPreviewableImageSource(item.source)}
                        onPress={() => {
                          const previewSource = getPreviewableImageSource(
                            item.source
                          );
                          if (previewSource) {
                            setPreviewImageSource(previewSource);
                          }
                        }}
                      >
                        <Image
                          source={item.source}
                          style={styles.modalPhotoImage}
                          onError={() => markImageFailed(item.uriForError)}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : null}

                <View style={styles.modalMealList}>
                  {isLoadingMeals ? (
                    <View style={styles.modalMealLoadingContainer}>
                      <ActivityIndicator color={MODAL_LOADING_COLOR} />
                    </View>
                  ) : (
                    <ScrollView
                      style={styles.modalMealListScroll}
                      contentContainerStyle={styles.modalMealListContent}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps='handled'
                    >
                      {selectedMeals.length > 0 ? (
                        selectedMeals.map((meal) => {
                          const isDeleting = deletingMealId === meal.mealId;
                          const isEditingTarget = editingMealId === meal.mealId;
                          const mealImageUri =
                            typeof meal.imageUri === 'string'
                              ? meal.imageUri.trim()
                              : null;
                          const rowImageSource = resolveModalMealImage(
                            meal,
                            isEditingTarget
                          );
                          return (
                            <View
                              key={`modal-meal-${meal.mealId}`}
                              style={[
                                styles.modalMealRowContainer,
                                isEditingTarget && styles.modalMealRowEditing,
                              ]}
                            >
                              <View style={styles.modalMealRowContent}>
                                <Text style={styles.modalMealRowName}>
                                  {meal.title}
                                </Text>
                                <Text style={styles.modalMealRowCalories}>
                                  {meal.kcal}kcal
                                </Text>
                              </View>
                              <View style={styles.modalMealRightContent}>
                                <TouchableOpacity
                                  activeOpacity={0.85}
                                  disabled={
                                    !getPreviewableImageSource(rowImageSource)
                                  }
                                  onPress={() => {
                                    const previewSource =
                                      getPreviewableImageSource(rowImageSource);
                                    if (previewSource) {
                                      setPreviewImageSource(previewSource);
                                    }
                                  }}
                                >
                                  <Image
                                    source={rowImageSource}
                                    style={styles.modalMealRowImage}
                                    onError={() =>
                                      markImageFailed(
                                        isEditingTarget && editingMealImageUri
                                          ? null
                                          : mealImageUri
                                      )
                                    }
                                  />
                                </TouchableOpacity>
                                <View style={styles.modalMealControls}>
                                  <TouchableOpacity
                                    style={styles.modalMealEditButton}
                                    onPress={() => onEditMeal(meal)}
                                    disabled={isUpdatingMeal || disableInputs}
                                    activeOpacity={0.8}
                                  >
                                    <Image
                                      source={modifyIcon}
                                      style={styles.modalMealEditIcon}
                                      resizeMode='contain'
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.modalMealRemoveButton,
                                      (!onDeleteMeal ||
                                        isDeleting ||
                                        disableInputs) &&
                                        styles.modalMealRemoveButtonDisabled,
                                    ]}
                                    activeOpacity={0.8}
                                    disabled={
                                      !onDeleteMeal ||
                                      isDeleting ||
                                      disableInputs
                                    }
                                    onPress={() => onDeleteMeal?.(meal.mealId)}
                                  >
                                    {isDeleting ? (
                                      <ActivityIndicator
                                        color={MODAL_MUTED_LOADING_COLOR}
                                        size='small'
                                      />
                                    ) : (
                                      <Image
                                        source={deleteIcon}
                                        style={styles.modalMealRemoveIcon}
                                        resizeMode='contain'
                                      />
                                    )}
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        })
                      ) : !isFutureDate ? (
                        <Text style={styles.modalEmptyText}>
                          등록된 식단이 없어요.
                        </Text>
                      ) : null}
                    </ScrollView>
                  )}
                  {errorMessage ? (
                    <Text style={styles.modalErrorText}>{errorMessage}</Text>
                  ) : null}
                </View>

                {editingMealId ? (
                  <>
                    <View style={[styles.modalAddRow, styles.modalEditRow]}>
                      <View style={styles.modalAddIcon}>
                        <Image
                          source={modifyIcon}
                          style={styles.modalAddEditIcon}
                          resizeMode='contain'
                        />
                      </View>
                      <TextInput
                        value={editingMealTitle}
                        onChangeText={onChangeEditingMealTitle}
                        placeholder='메뉴 이름 수정'
                        style={[styles.modalAddInput, styles.modalAddInputName]}
                        placeholderTextColor={Colors.textMuted}
                        editable={!isUpdatingMeal && !disableInputs}
                      />
                      <TextInput
                        value={editingMealCalories}
                        onChangeText={onChangeEditingMealCalories}
                        placeholder='칼로리 수정'
                        keyboardType='numeric'
                        style={[
                          styles.modalAddInput,
                          styles.modalAddInputCalorie,
                        ]}
                        placeholderTextColor={Colors.textMuted}
                        editable={!isUpdatingMeal && !disableInputs}
                      />
                      <TouchableOpacity
                        style={styles.modalCameraButton}
                        activeOpacity={0.8}
                        onPress={onPickEditingImage}
                        disabled={isUpdatingMeal || disableInputs}
                      >
                        <Text style={styles.modalCameraIcon}>📷</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalEditActions}>
                      <TouchableOpacity
                        style={[styles.modalEditButton, styles.modalEditCancel]}
                        onPress={onCancelEditMeal}
                        disabled={isUpdatingMeal || disableInputs}
                      >
                        <Text style={styles.modalEditCancelLabel}>취소</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.modalEditButton,
                          styles.modalEditSubmit,
                          (isUpdatingMeal || disableInputs) &&
                            styles.modalEditActionDisabled,
                        ]}
                        onPress={onSubmitEditMeal}
                        disabled={isUpdatingMeal || disableInputs}
                      >
                        {isUpdatingMeal ? (
                          <ActivityIndicator color={Colors.surface} />
                        ) : (
                          <Text style={styles.modalEditSubmitLabel}>
                            수정 완료
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={styles.modalAddRow}>
                    <View style={styles.modalAddIcon}>
                      <Text style={styles.modalAddIconLabel}>＋</Text>
                    </View>
                    <TextInput
                      value={mealTitle}
                      onChangeText={onChangeMealTitle}
                      placeholder='메뉴 이름'
                      style={[styles.modalAddInput, styles.modalAddInputName]}
                      placeholderTextColor={Colors.textMuted}
                      editable={!disableInputs}
                    />
                    <TextInput
                      value={mealCalories}
                      onChangeText={onChangeMealCalories}
                      placeholder='kcal'
                      keyboardType='numeric'
                      style={[
                        styles.modalAddInput,
                        styles.modalAddInputCalorie,
                      ]}
                      placeholderTextColor={Colors.textMuted}
                      editable={!disableInputs}
                    />
                    <TouchableOpacity
                      style={[
                        styles.modalCameraButton,
                        disableInputs ? styles.modalCameraButtonDisabled : null,
                      ]}
                      activeOpacity={0.8}
                      onPress={onPickImage}
                      disabled={disableInputs}
                    >
                      <Text style={styles.modalCameraIcon}>📷</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>총 칼로리:</Text>
                  <Text style={styles.modalTotalValue}>
                    {isLoadingMeals ? '-' : `${totalCalories}kcal`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.modalPrimaryButton,
                    (disableSave || isSaving) &&
                      styles.modalPrimaryButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={onSave}
                  disabled={disableSave || isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color={Colors.surface} />
                  ) : (
                    <Text
                      style={[
                        styles.modalPrimaryButtonLabel,
                        disableSave && styles.modalPrimaryButtonLabelDisabled,
                      ]}
                    >
                      저장하기
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSecondaryButtonLabel}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareModalContent>
        </View>
      </Modal>

      <Modal
        visible={Boolean(previewImageSource)}
        transparent
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setPreviewImageSource(null)}
      >
        <View
          style={[
            styles.imagePreviewContainer,
            {
              paddingTop: insets.top + Spacing.xxl,
              paddingBottom: insets.bottom + Spacing.xxl,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => setPreviewImageSource(null)}>
            <View style={styles.imagePreviewBackdrop} />
          </TouchableWithoutFeedback>
          {previewImageSource ? (
            <Image
              source={previewImageSource}
              style={styles.imagePreview}
              resizeMode='contain'
            />
          ) : null}
          <TouchableOpacity
            style={styles.imagePreviewCloseButton}
            activeOpacity={0.85}
            onPress={() => setPreviewImageSource(null)}
          >
            <Text style={styles.imagePreviewCloseText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

export default MealModal;
