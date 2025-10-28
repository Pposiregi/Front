/**
 * @module dateUtil
 * @description 날짜 관련 유틸리티 함수 모음
 * @created 2025-10-25
 * @author MANDARIN
 * @version 1.0.0
 */

/**
 * 'YYYY-MM-DD' 형식의 날짜 키를 반환합니다.
 * @param date {Date} 날짜 객체
 * @returns {string} 'YYYY-MM-DD' 형식의 날짜 문자열
 */

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();

  // month의 index는 0부터 시작하므로 +1을 해주고, 2자리로 맞추기 위해 padStart 사용
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 'YYYY-MM-DD' 형식의 날짜 키를 Date 객체로 변환합니다.
 * @param dateKey {string} 'YYYY-MM-DD' 형식의 날짜 문자열
 * @returns {Date} 날짜 객체
 */
export const parseDateKey = (dateKey: string) => {
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
