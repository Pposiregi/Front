import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '@styles/Meal.styles';
import type { MealListItem } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WEEKDAYS } from './constant';
import { formatDateKey, parseDateKey } from '@utils/dateUtil';
import { buildMonthMatrix } from '@hooks/useMealCalendarMatrix';
import MealModal from './MealModal';
import { createMeal, deleteMeal } from '@api/mealApi';
import { useMealCalendarPreview } from '@api/hooks/useMealCalendarPreview';
import { useMealDayDetail } from '@api/hooks/useMealDayDetail';

const MAX_STACK = 3;

const getDiaryTitle = (date: Date) => `${date.getMonth() + 1}월의 식사일기`;

const getMonthLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const getNextSequence = (meals: MealListItem[]) => {
  if (meals.length === 0) return 1;
  return (
    meals.reduce((max, meal) => {
      return Math.max(max, meal.sequence);
    }, 0) + 1
  );
};

/**
 * 월 이동 기능, 일별 식단 미리보기를 표시하는 캘린더 그리드,  
 * 그리고 식단 조회/추가를 위한 모달이 포함된 식단 일지 페이지를 렌더링한다.
 *
 * 이 컴포넌트는 현재 월 이동, 선택된 날짜 상태, 모달 표시 여부, 임시 식단 입력 필드를 관리하며,  
 * mock 데이터를 기반으로 캘린더 매트릭스, 선택된 식단, 총 칼로리를 계산하여 UI를 구성한다.
 *
 * @returns 식단 일지 페이지를 나타내는 React 요소를 반환함
 */
function MealPage() {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() => todayKey);
  const [isMealModalVisible, setMealModalVisible] = useState(false);
  const [mealTitle, setMealTitle] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [deletingMealId, setDeletingMealId] = useState<string | null>(null);

  const {
    previewMap: calendarPreview,
    isLoading: isCalendarLoading,
    error: calendarError,
    refresh: refreshCalendar,
  } = useMealCalendarPreview(currentMonth);

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
  const selectedMeals = useMemo<MealListItem[]>(
    () =>
      selectedDayDetail?.mealList
        ? [...selectedDayDetail.mealList]
            .sort((a, b) => a.sequence - b.sequence)
            .map((meal) => ({ ...meal }))
        : [],
    [selectedDayDetail]
  );
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
    resetDayDetail();
  };

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

    setIsSavingMeal(true);
    try {
      await createMeal({
        day: selectedDateKey,
        title: trimmedTitle,
        kcal: kcalValue,
        sequence: getNextSequence(selectedMeals),
      });
      await refreshCalendar(currentMonth, { silent: true });
      await refetchDayDetail({
        keepPrevious: true,
        silent: true,
      });
      handleCloseModal();
    } catch (error) {
      console.error('[MealPage] Failed to save meal', error);
      Alert.alert(
        '식단 등록',
        '식단 저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSavingMeal(false);
    }
  };

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
            void executeDeleteMeal(mealId);
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

  const disableSaveButton =
    isSavingMeal ||
    isMealDetailLoading ||
    mealTitle.trim().length === 0 ||
    mealCalories.trim().length === 0;
  const disableInputs = isSavingMeal || isMealDetailLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
            <Text style={styles.calendarMonthLabel}>
              {getMonthLabel(currentMonth)}
            </Text>
            {isCalendarLoading ? (
              <ActivityIndicator
                size='small'
                color='#5F6BEA'
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
                          !isSelected && isToday ? styles.todayDayOutline : null,
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
                            !isSelected && isToday ? styles.todayDayNumber : null,
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
                              .map((imgSrc, i) => (
                                <Image
                                  key={i}
                                  source={imgSrc}
                                  style={[
                                    styles.stackImage,
                                    { left: i * 10, zIndex: MAX_STACK - i }, // 살짝씩 오른쪽으로 가도록
                                  ]}
                                  resizeMode='cover'
                                />
                              ))
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
        disableSave={disableSaveButton}
        disableInputs={disableInputs}
        deletingMealId={deletingMealId}
        onDeleteMeal={handleDeleteMealRequest}
        errorMessage={dayDetailError}
      />
    </SafeAreaView>
  );
}

export default MealPage;
