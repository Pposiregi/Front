import {
  MealCalendarCell,
  MealCalendarPreviewMap,
} from '@pages/meal/types';
import { formatDateKey } from '@utils/dateUtil';

/**
 *
 * @param baseDate
 * @param mealLog
 */
export const buildMonthMatrix = (
  baseDate: Date,
  previewMap: MealCalendarPreviewMap
): MealCalendarCell[][] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // 요일 보정 (일요일 시작 -> 월요일 시작)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const weeks: MealCalendarCell[][] = [];

  /* 달력 그리기 */
  for (let idx = 0; idx < totalCells; idx++) {
    // 일주일마다 행 추가
    if (idx % 7 === 0) {
      weeks.push([]);
    }

    const week = weeks[weeks.length - 1];
    const dayNumber = idx - firstWeekday + 1;

    // 현재 달의 날짜인 경우
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      week.push({
        key: `${idx}`, // 고유 키
        dateKey: null, // 날짜 키
        dayNumber: null,
        isCurrentMonth: false, // 현재 달 여부
        previewImage: null, // 미리보기 이미지
      });
      continue;
    }

    // 해당 날짜에 사진이 있는 경우, 겹쳐진 사진 미리보기를 출력한다
    const curDate = new Date(year, month, dayNumber);
    const dateKey = formatDateKey(curDate);
    const previewImage =
      previewMap[dateKey]?.imageUrls.length
        ? previewMap[dateKey]?.imageUrls.map((uri: string) => ({ uri }))
        : null;

    week.push({
      key: dateKey,
      dateKey,
      dayNumber,
      isCurrentMonth: true,
      previewImage,
    });
  }

  return weeks;
};
