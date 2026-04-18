import analytics from '@react-native-firebase/analytics';

/**
 * GA4/Firebase Analytics 이벤트 트래킹 유틸리티.
 *
 * 화면 전환은 NavigationContainer의 onStateChange에서 자동으로 기록되며,
 * 이 파일에서는 커스텀 이벤트를 타입 안전하게 래핑한다.
 *
 * BigQuery 연동: Firebase 콘솔 > 프로젝트 설정 > 통합 > BigQuery 에서
 * 활성화하면 모든 이벤트가 GCP BigQuery로 자동 스트리밍된다.
 */

// ─── 화면명 상수 ────────────────────────────────────────────────────────────

export const SCREEN = {
  SOCIAL_LOGIN: 'SocialLogin',
  INTRO: 'Intro',
  PET_CREATE: 'PetCreate',
  MAIN: 'Main',
  ACTIVITY: 'ActivityPage',
  ACTIVITY_DETAIL: 'ActivityDetailPage',
  MEAL: 'Meal',
  ACHIEVEMENT: 'Achievement',
  PROFILE: 'ProfileMain',
  PROFILE_SETTINGS: 'ProfileSettings',
} as const;

export type ScreenName = (typeof SCREEN)[keyof typeof SCREEN];

// ─── 화면 전환 ───────────────────────────────────────────────────────────────

/**
 * 현재 활성 화면을 GA4에 기록한다.
 * NavigationContainer의 onStateChange에서 호출한다.
 */
export const logScreenView = async (
  screenName: string,
  screenClass?: string
) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logScreenView 실패', e);
    }
  }
};

// ─── 인증 이벤트 ─────────────────────────────────────────────────────────────

/**
 * 소셜 로그인 성공 시 기록한다.
 * @param method 'google' | 'kakao'
 */
export const logLogin = async (method: 'google' | 'kakao') => {
  try {
    await analytics().logLogin({ method });
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logLogin 실패', e);
    }
  }
};

/**
 * 회원가입 완료 시 기록한다.
 * @param method 'google' | 'kakao'
 */
export const logSignUp = async (method: 'google' | 'kakao') => {
  try {
    await analytics().logSignUp({ method });
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logSignUp 실패', e);
    }
  }
};

// ─── 펫 이벤트 ───────────────────────────────────────────────────────────────

/**
 * 펫 생성 완료 시 기록한다.
 */
export const logPetCreate = async (params: {
  pet_type: string;
  pet_name: string;
}) => {
  try {
    await analytics().logEvent('pet_create', params);
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logPetCreate 실패', e);
    }
  }
};

// ─── 활동(러닝) 이벤트 ───────────────────────────────────────────────────────

/**
 * 러닝 시작 시 기록한다.
 */
export const logRunningStart = async () => {
  try {
    await analytics().logEvent('running_start', {});
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logRunningStart 실패', e);
    }
  }
};

/**
 * 러닝 완료 시 기록한다.
 * @param params distance_m: 거리(m), duration_s: 시간(초)
 */
export const logRunningComplete = async (params: {
  distance_m: number;
  duration_s: number;
  calories?: number;
}) => {
  try {
    await analytics().logEvent('running_complete', params);
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logRunningComplete 실패', e);
    }
  }
};

// ─── 식사 이벤트 ─────────────────────────────────────────────────────────────

/**
 * 식사 기록 등록 시 기록한다.
 */
export const logMealLog = async (params: { meal_type: string }) => {
  try {
    await analytics().logEvent('meal_log', params);
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logMealLog 실패', e);
    }
  }
};

// ─── 달성 이벤트 ─────────────────────────────────────────────────────────────

/**
 * 배지/업적 획득 시 기록한다.
 */
export const logAchievementUnlock = async (params: {
  achievement_id: string;
  achievement_name?: string;
}) => {
  try {
    await analytics().logEvent('achievement_unlock', params);
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] logAchievementUnlock 실패', e);
    }
  }
};

// ─── 사용자 속성 ─────────────────────────────────────────────────────────────

/**
 * 로그인한 사용자 ID를 Firebase에 설정한다. (DAU/WAU/MAU 산정에 활용)
 * 로그아웃 시에는 null을 전달한다.
 */
export const setAnalyticsUserId = async (userId: string | null) => {
  try {
    await analytics().setUserId(userId);
  } catch (e) {
    if (__DEV__) {
      console.warn('[Analytics] setUserId 실패', e);
    }
  }
};
