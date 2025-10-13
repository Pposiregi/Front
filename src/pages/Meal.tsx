import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import styles from '@styles/Meal.styles';
import TokkiImage from '@assets/images/main_temp_tokki.png';

type MealItem = {
  id: string;
  name: string;
  calories: number;
  tag: string;
};

type CalendarCell = {
  key: string;
  label: number | null;
  dateKey: string | null;
  isCurrentMonth: boolean;
  indicators: string[];
};

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const MEAL_LOG: Record<string, MealItem[]> = {
  '2025-08-02': [
    {
      id: '2025-08-02-breakfast',
      name: '포케 샐러드',
      calories: 398,
      tag: '김',
    },
    {
      id: '2025-08-02-lunch',
      name: '참치 샐러드',
      calories: 412,
      tag: '김',
    },
  ],
  '2025-08-05': [
    {
      id: '2025-08-05-breakfast',
      name: '낮치와 포체 샐러드',
      calories: 400,
      tag: '김',
    },
    {
      id: '2025-08-05-lunch',
      name: '낮치와 포체 샐러드',
      calories: 434,
      tag: '김',
    },
  ],
  '2025-08-08': [
    {
      id: '2025-08-08-lunch',
      name: '연어 포케',
      calories: 420,
      tag: '연',
    },
  ],
};

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

const buildMonthMatrix = (baseDate: Date): CalendarCell[][] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7; // make Monday the first column
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const weeks: CalendarCell[][] = [];
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
        indicators: [],
      });
      continue;
    }

    const currentDate = new Date(year, month, dayNumber);
    const dateKey = formatDateKey(currentDate);
    const indicators = (MEAL_LOG[dateKey] ?? [])
      .slice(0, 3)
      .map((meal) => meal.tag || meal.name.charAt(0));

    week.push({
      key: dateKey,
      label: dayNumber,
      dateKey,
      isCurrentMonth: true,
      indicators,
    });
  }

  return weeks;
};

const getDiaryTitle = (date: Date) => `${date.getMonth() + 1}월의 식사일기`;

const getMonthLabel = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

function Meal() {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(2025, 7, 1) // 2025-08-01
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    formatDateKey(new Date(2025, 7, 5))
  );

  const weeks = useMemo(() => buildMonthMatrix(currentMonth), [currentMonth]);
  const selectedMeals = useMemo(
    () => MEAL_LOG[selectedDateKey] ?? [],
    [selectedDateKey]
  );
  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey),
    [selectedDateKey]
  );
  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    selectedMeals.forEach((meal) => {
      if (meal.tag) {
        tagSet.add(meal.tag);
      }
    });
    return Array.from(tagSet);
  }, [selectedMeals]);

  const totalCalories = useMemo(
    () =>
      selectedMeals.reduce((sum, meal) => {
        return sum + meal.calories;
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
  };

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
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.dayInner} />
                    )}
                    {cell.indicators.length > 0 && (
                      <View style={styles.mealIndicatorRow}>
                        {cell.indicators.map((indicator, indicatorIndex) => (
                          <View
                            key={`${cell.key}-indicator-${indicatorIndex}`}
                            style={[
                              styles.mealIndicator,
                              indicatorIndex <
                              cell.indicators.length - 1
                                ? styles.mealIndicatorSpacing
                                : null,
                            ]}
                          >
                            <Text style={styles.mealIndicatorText}>
                              {indicator}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={[styles.catContainer, styles.sectionSpacing]}>
          <Image source={TokkiImage} style={styles.catImage} />
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailDate}>
              {`${selectedDate.getFullYear()}년 ${
                selectedDate.getMonth() + 1
              }월 ${selectedDate.getDate()}일`}
            </Text>
            <Text style={styles.detailSubtitle}>
              오늘의 식단을 기록해요
            </Text>
            {uniqueTags.length > 0 && (
              <View style={styles.badgeRow}>
                {uniqueTags.map((tag, index) => (
                  <View
                    key={`tag-${tag}-${index}`}
                    style={[
                      styles.badge,
                      index < uniqueTags.length - 1
                        ? styles.badgeSpacing
                        : null,
                    ]}
                  >
                    <Text style={styles.badgeLabel}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {selectedMeals.length > 0 ? (
            <View style={styles.mealsSection}>
              {selectedMeals.map((meal, index) => (
                <View
                  key={meal.id}
                  style={[
                    styles.mealRow,
                    index > 0 ? styles.mealRowSpacing : null,
                  ]}
                >
                  <View style={styles.mealImagePlaceholder}>
                    <Text style={styles.mealPlaceholderText}>{meal.tag}</Text>
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={[styles.mealName, styles.mealInfoSpacing]}>
                      {meal.name}
                    </Text>
                    <Text style={styles.mealCalories}>
                      {meal.calories}kcal
                    </Text>
                  </View>
                  <View style={styles.mealActions}>
                    <TouchableOpacity
                      style={[styles.iconButton, styles.mealActionSpacing]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.iconButtonLabel}>편</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                      <Text style={styles.iconButtonLabel}>촬</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, styles.mealsSection]}>
              <Text style={[styles.emptyStateTitle, styles.emptyStateSpacing]}>
                아직 기록이 없어요
              </Text>
              <Text style={styles.emptyStateText}>
                아래 입력창을 눌러 오늘의 식단을 추가해보세요.
              </Text>
            </View>
          )}

          <View style={[styles.addRow, styles.addRowSpacing]}>
            <Text style={styles.addRowLabelPrimary}>메뉴, 이름 입력</Text>
            <Text style={styles.addRowLabelSecondary}>칼로리 입력</Text>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconButtonLabel}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>총 칼로리:</Text>
            <Text style={styles.summaryValue}>{totalCalories}kcal</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Meal;
