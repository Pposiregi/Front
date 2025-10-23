import React, { useMemo, useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import styles from '@styles/Meal.styles';
import mealPlaceholderImage from '@assets/images/meal.png';
import { MOCK_MEAL_LOG } from './meals';
import type { MealCalendarCell, MealListItem, MealLog } from './types';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey: string) => {
  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    day < 1
  ) {
    return new Date();
  }
  return new Date(year, month, day);
};

const resolveMealImageSource = (meal: MealListItem): ImageSourcePropType => {
  if (meal.imageSource) {
    return meal.imageSource;
  }
  if (meal.imageUri) {
    return { uri: meal.imageUri };
  }
  return mealPlaceholderImage;
};

const PLACEHOLDER_MEAL: MealListItem = {
  mealId: 'placeholder',
  title: '',
  kcal: 0,
  sequence: 0,
  imageUri: '',
  imageSource: mealPlaceholderImage,
};

const buildMonthMatrix = (
  baseDate: Date,
  mealLog: MealLog
): MealCalendarCell[][] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7; // make Monday the first column
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const weeks: MealCalendarCell[][] = [];
  for (let index = 0; index < totalCells; index += 1) {
    if (index % 7 === 0) {
      weeks.push([]);
    }

    const week = weeks[weeks.length - 1];
    const dayNumber = index - firstWeekday + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      week.push({
        key: `empty-${index}`,
        label: null,
        dateKey: null,
        isCurrentMonth: false,
        previewImage: null,
      });
      continue;
    }

    const currentDate = new Date(year, month, dayNumber);
    const dateKey = formatDateKey(currentDate);
    const mealsForDate = mealLog[dateKey] ?? [];
    const previewImage =
      mealsForDate.length > 0 ? resolveMealImageSource(mealsForDate[0]) : null;

    week.push({
      key: dateKey,
      label: dayNumber,
      dateKey,
      isCurrentMonth: true,
      previewImage,
    });
  }

  return weeks;
};

const getDiaryTitle = (date: Date) => `${date.getMonth() + 1}월의 식사일기`;

const getMonthLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

function MealPage() {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(2025, 7, 1) // 2025-08-01
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    formatDateKey(new Date(2025, 7, 5))
  );
  const [isMealModalVisible, setMealModalVisible] = useState(false);
  const [mealTitle, setMealTitle] = useState('');
  const [mealCalories, setMealCalories] = useState('');

  const weeks = useMemo(
    () => buildMonthMatrix(currentMonth, MOCK_MEAL_LOG),
    [currentMonth]
  );
  const selectedMeals = useMemo<MealListItem[]>(
    () => MOCK_MEAL_LOG[selectedDateKey] ?? [],
    [selectedDateKey]
  );
  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey),
    [selectedDateKey]
  );
  const totalCalories = useMemo(
    () =>
      selectedMeals.reduce((sum, meal) => {
        return sum + meal.kcal;
      }, 0),
    [selectedMeals]
  );

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

  const handleCloseModal = () => {
    setMealModalVisible(false);
    setMealTitle('');
    setMealCalories('');
  };

  const handleSaveMeal = () => {
    // TODO: 식단 저장 로직 연결
    setMealModalVisible(false);
    setMealTitle('');
    setMealCalories('');
  };

  const formattedModalDate = useMemo(() => {
    return `${selectedDate.getFullYear()}년 ${
      selectedDate.getMonth() + 1
    }월 ${selectedDate.getDate()}일`;
  }, [selectedDate]);

  const photoMeals = selectedMeals.length > 0 ? selectedMeals : [PLACEHOLDER_MEAL];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, styles.headerSpacing]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => handleChangeMonth(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonLabel}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getDiaryTitle(currentMonth)}</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => handleChangeMonth(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonLabel}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.calendarContainer, styles.sectionSpacing]}>
          <View style={styles.calendarMonthRow}>
            <Text style={styles.calendarMonthLabel}>
              {getMonthLabel(currentMonth)}
            </Text>
          </View>
          <View style={styles.weekHeaderRow}>
            {WEEKDAYS.map((weekday) => (
              <Text key={weekday} style={styles.weekDayLabel}>
                {weekday}
              </Text>
            ))}
          </View>
          {weeks.map((week, weekIndex) => (
            <View
              key={`week-${weekIndex}`}
              style={[
                styles.weekRow,
                weekIndex === weeks.length - 1 ? { marginBottom: 0 } : null,
              ]}
            >
              {week.map((cell, cellIndex) => {
                const isSelected = cell.dateKey === selectedDateKey;
                const showDay = cell.label !== null && cell.dateKey;
                return (
                  <View key={`${cell.key}-${cellIndex}`} style={styles.dayCell}>
                    {showDay ? (
                      <TouchableOpacity
                        style={[
                          styles.dayInner,
                          isSelected ? styles.selectedDayBackground : null,
                        ]}
                        onPress={() => handleSelectDate(cell.dateKey)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.dayNumber,
                            !cell.isCurrentMonth ? styles.dayNumberMuted : null,
                            isSelected ? styles.selectedDayNumber : null,
                          ]}
                        >
                          {cell.label}
                        </Text>
                        {cell.previewImage ? (
                          <Image
                            source={cell.previewImage}
                            style={styles.dayPreviewThumbnail}
                            resizeMode='cover'
                          />
                        ) : (
                          <View style={styles.dayPreviewPlaceholder}>
                            <Text style={styles.dayPreviewPlaceholderText}>+</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.dayInner} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        {/* 다른 토끼 이미지 넣어야함 */}
        {/* <View style={[styles.catContainer, styles.sectionSpacing]}>
          <Image source={TokkiImage} style={styles.catImage} />
        </View> */}

        <Text style={styles.calendarHelperText}>
          날짜를 선택해서 식단을 등록해보세요.
        </Text>
      </ScrollView>
      <Modal
        visible={isMealModalVisible}
        transparent
        animationType='fade'
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContentWrapper}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderSection}>
                  <Text style={styles.modalTitle}>{formattedModalDate}</Text>
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
                    onChangeText={setMealTitle}
                    placeholder='메뉴 이름 입력'
                    style={styles.modalAddInput}
                    placeholderTextColor='#B4B8C9'
                  />
                  <TextInput
                    value={mealCalories}
                    onChangeText={setMealCalories}
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
                  <Text style={styles.modalTotalValue}>
                    {totalCalories}kcal
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  activeOpacity={0.85}
                  onPress={handleSaveMeal}
                >
                  <Text style={styles.modalPrimaryButtonLabel}>저장하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={handleCloseModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSecondaryButtonLabel}>닫기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default MealPage;
