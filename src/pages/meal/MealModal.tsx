import React from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from '@styles/Meal.styles';
import { PLACEHOLDER_MEAL } from '@pages/meal/constant';
import type { MealListItem } from '@pages/meal/types';
import { resolveMealImageSource } from '@utils/imageUtil';

type MealModalProps = {
  visible: boolean;
  formattedDate: string;
  selectedMeals: MealListItem[];
  mealTitle: string;
  mealCalories: string;
  totalCalories: number;
  onClose: () => void;
  onSave: () => void;
  onChangeMealTitle: (value: string) => void;
  onChangeMealCalories: (value: string) => void;
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
}: MealModalProps) {
  const photoMeals =
    selectedMeals.length > 0 ? selectedMeals : [PLACEHOLDER_MEAL];

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContentWrapper}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderSection}>
                <Text style={styles.modalTitle}>{formattedDate}</Text>
                <Text style={styles.modalSubtitle}>
                  오늘의 식단을 기록해요!
                </Text>
              </View>

              <View style={styles.modalPhotoRow}>
                {photoMeals.map((meal) => {
                  const imageSource = resolveMealImageSource(meal);
                  return (
                    <View
                      key={`modal-photo-${meal.mealId}`}
                      style={styles.modalPhotoCard}
                    >
                      <Image
                        source={imageSource}
                        style={styles.modalPhotoImage}
                      />
                    </View>
                  );
                })}
              </View>

              <View style={styles.modalMealList}>
                {selectedMeals.map((meal) => {
                  const imageSource = resolveMealImageSource(meal);
                  return (
                    <View
                      key={`modal-meal-${meal.mealId}`}
                      style={styles.modalMealRowContainer}
                    >
                      <TouchableOpacity
                        style={styles.modalMealRemoveButton}
                        activeOpacity={0.8}
                        onPress={() => {}}
                      >
                        <Text style={styles.modalMealRemoveLabel}>-</Text>
                      </TouchableOpacity>
                      <View style={styles.modalMealRowContent}>
                        <Text style={styles.modalMealRowName}>
                          {meal.title}
                        </Text>
                        <Text style={styles.modalMealRowCalories}>
                          {meal.kcal}kcal
                        </Text>
                      </View>
                      <Image
                        source={imageSource}
                        style={styles.modalMealRowImage}
                      />
                      <View style={styles.modalMealDragHandle}>
                        <Text style={styles.modalMealDragLabel}>≡</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.modalAddRow}>
                <View style={styles.modalAddIcon}>
                  <Text style={styles.modalAddIconLabel}>＋</Text>
                </View>
                <TextInput
                  value={mealTitle}
                  onChangeText={onChangeMealTitle}
                  placeholder='메뉴 이름 입력'
                  style={styles.modalAddInput}
                  placeholderTextColor='#B4B8C9'
                />
                <TextInput
                  value={mealCalories}
                  onChangeText={onChangeMealCalories}
                  placeholder='칼로리 입력'
                  keyboardType='numeric'
                  style={[styles.modalAddInput, styles.modalAddInputCalorie]}
                  placeholderTextColor='#B4B8C9'
                />
                <TouchableOpacity
                  style={styles.modalCameraButton}
                  activeOpacity={0.8}
                  onPress={() => {}}
                >
                  <Text style={styles.modalCameraIcon}>📷</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalTotalRow}>
                <Text style={styles.modalTotalLabel}>총 칼로리:</Text>
                <Text style={styles.modalTotalValue}>{totalCalories}kcal</Text>
              </View>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                activeOpacity={0.85}
                onPress={onSave}
              >
                <Text style={styles.modalPrimaryButtonLabel}>저장하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSecondaryButtonLabel}>닫기</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
}

export default MealModal;
