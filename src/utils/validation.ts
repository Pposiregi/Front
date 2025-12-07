//닉네임 정규식
const nicknameRegex = /^(?!.*  )(?! )[가-힣a-zA-Z0-9]{2,10}(?<! )$/;

const bannedWords = ['시발', 'fuck', '개새끼'];

export const isValidNickname = (nickname: string) => {
  return nicknameRegex.test(nickname) && !containsBannedWord(nickname);
};

export const containsBannedWord = (nickname: string) => {
  const lowerNick = nickname.toLowerCase();
  return bannedWords.some((word) => lowerNick.includes(word));
};

// 윤년 체크 및, 올바른 출생 월 일
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const isValidDate = (year: number, month: number, day: number) => {
  if (year < 1900 || year > new Date().getFullYear()) {
    return { valid: false, message: '올바른 출생 연도를 입력해주세요.' };
  }
  if (month < 1 || month > 12) {
    return { valid: false, message: '올바른 출생 월을 입력해주세요.' };
  }
  if (day < 1 || day > 31) {
    return { valid: false, message: '올바른 출생 일을 입력해주세요.' };
  }

  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (day > daysInMonth[month - 1]) {
    return {
      valid: false,
      message: `${month}월은 ${daysInMonth[month - 1]}일까지 있습니다.`,
    };
  }

  return { valid: true, message: '' };
};

// 체중 정규식
const weightRegex = /^[0-9]{1,3}$/;

export const isValidWeight = (weight: string) => {
  if (!weightRegex.test(weight)) return false;

  const num = parseInt(weight, 10);
  if (isNaN(num) || num <= 20 || num > 250) return false; // (20~250kg)

  return true;
};

// 키 정규식
const heightRegex = /^[0-9]{1,3}$/;

export const isValidHeight = (height: string) => {
  if (!heightRegex.test(height)) return false;

  const num = parseInt(height, 10);
  if (isNaN(num) || num <= 100 || num > 250) return false; // (100~250cm)

  return true;
};

// 체지방률 정규식 소수점 한 자리 허용
const pbfRegex = /^(?:[5-9](?:\.\d)?|[1-4]\d(?:\.\d)?|50(?:\.0)?)$/;

export const isValidPbf = (pbf: string) => {
  if (!pbfRegex.test(pbf)) return false;

  const num = parseFloat(pbf);
  if (isNaN(num) || num < 5.0 || num > 50.0) return false; //(5~50%)

  return true;
};

// 목표 걸음 수 정규식 (숫자만 허용, 1,000 ~ 100,000)
const targetWalkRegex = /^[0-9]{3,6}$/;

export const isValidTargetWalk = (steps: string) => {
  if (!targetWalkRegex.test(steps)) return false;

  const num = parseInt(steps, 10);
  if (isNaN(num) || num < 1000 || num > 100000) return false; // 최소 1000 ~ 최대 100,000 걸음

  return true;
};
