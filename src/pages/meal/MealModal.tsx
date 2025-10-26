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
