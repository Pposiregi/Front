import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Animated,
  Alert,
  BackHandler,
  Platform,
  Easing,
} from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepProgress } from '@components/StepProgress';
import { PetRenderer } from '@components/PetRenderer';
import BodyRecordPrompt from '@components/BodyRecordPrompt';
import styles from '@styles/MainPage.styles';
import mainBackGround from '@assets/images/mainBackGround_gym.png';
import mainBackGroundWide from '@assets/images/mainBackground_track_wide.png';
import runLegSwirl from '@assets/pet/etc/swirl.png';
import { SCREEN_WIDTH } from '@styles/dimensions';
import { Colors } from '@styles/theme';
import MapView from 'react-native-maps';
import useGpsSession, { type GpsSessionSummary } from '@hooks/useGpsSession';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import type { BodyHistoryFormValues } from 'types/bodyHistory';
import { createBodyHistory, getBodyHistoryByDate } from '@api/bodyHistoryApi';
import useHealthSteps from '@hooks/useHealthSteps';
import { loadBodyGoals, type BodyGoals } from '@utils/bodyGoalsStorage';
import { logRunningStart, logRunningComplete } from '@utils/analytics';

/**
 * 오늘 몸 기록 프롬프트 스킵 여부 저장 키.
 */
const BODY_PROMPT_SKIP_KEY = 'slimpet:bodyPrompt:skipDate';
const END_FAILURE_FORCE_THRESHOLD = 3;
const PET_RENDER_SIZE = 480;
const PET_FOOT_BOTTOM_OFFSET_RATIO = 0.24;
// 런 화면에서는 기본 펫보다 크게 보여 속도감과 가시성을 확보한다.
const RUN_PET_SCALE = 0.91;
const DAILY_RUN_SECONDS_KEY_PREFIX = 'slimpet:running:totalSeconds:';
const KCAL_PER_STEP = 0.04;
const RUN_BG_TILE_WIDTH = Math.round(SCREEN_WIDTH * 1.8);
const RUN_BG_LOOP_MS = 8000;
const RUN_BG_TILE_OFFSETS = [0, 1, 2] as const;
const RUN_SWIRL_LOOP_MS = 420;
// 바람개비 이펙트는 펫 레이어 기준 중앙에 두고, 발에 너무 떨어지지 않게 붙인다.
const RUN_SWIRL_SIZE_RATIO = 0.257;
const RUN_SWIRL_CENTER_LEFT_RATIO = (1 - RUN_SWIRL_SIZE_RATIO) / 2;
const RUN_SWIRL_BOTTOM_RATIO = -0.02;
const DEV_PBF_MIN = 12;
const DEV_PBF_MAX = 40;
const DEV_PBF_STEP = 1;
// Baseline pbf values used only when no body-history pbf is available.
const MALE_BASELINE_PBF = 17;
const FEMALE_BASELINE_PBF = 25;

const clampDevPbf = (value: number) =>
  Math.min(DEV_PBF_MAX, Math.max(DEV_PBF_MIN, Math.round(value)));

/** 밀리초 단위 러닝 시간을 한국어 문자열로 변환한다. */
const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  }
  return `${minutes}분 ${seconds}초`;
};

/** 초 단위 경과 시간을 HH:MM:SS 형식으로 변환한다. */
const formatRunningElapsed = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainSeconds = safeSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(remainSeconds).padStart(2, '0')}`;
};

import { usePetFSM } from '@utils/petFSM';
import { PetStates } from '@utils/petState';
import { MissionActiveItem, MissionProgressEvent } from 'types/mission';
import { getMissionsActive } from '@api/missionApi';
import { useMissionSSE } from '@hooks/useMissionSSE';
import { useFocusEffect } from '@react-navigation/native';
import MissionModal from './missionModal';
import { mockActiveMissions } from './mockMission';
import MainStatCards from './MainStatCards';
import { useStepSync } from '@hooks/useStepSync';
import { getUser } from '@api/mainApi';
import { useAppDispatch } from '@store/index';
import type { RootState } from '@store/reducer';
import userSlice from '@slices/user';
import RunningSummaryModal from './RunningSummaryModal';
import {
  startRunningNotification,
  stopRunningNotification,
  updateRunningNotification,
} from '@hooks/useRunningService';
import {
  getAndroidApiLevel,
  STEP_SYNC_MESSAGES,
  STEP_SYNC_OS_POLICY,
} from '@utils/stepSyncPolicy';
import type { PetType } from 'types/profile';
import { useMainPetMotion } from './useMainPetMotion';
import {
  PET_TEMPLATE_ID_BY_TYPE,
  PET_TYPE_STORAGE_KEY,
} from '@shared/config/petConfig';
import { setPetId } from '@utils/petIdStorage';
import { usePetExpression } from './usePetExpression';

/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainPage = () => {
  /**
   * START 버튼 누른 후 카운트다운 상태.
   */
  const [countdown, setCountdown] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const petShadowBreath = useRef(new Animated.Value(0)).current;

  /**
   * 미션 데이터/모달 상태.
   */
  const [missionApiItems, setMissionApiItems] = useState<MissionActiveItem[]>(
    mockActiveMissions.missions
  );
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [trans, setTrans] = useState(false); // 미션 완료 트리거
  /** 미션 목록 모달을 연다. */
  const handleOpenMission = () => setShowMissionModal(true);
  /** 미션 모달을 닫고 필요하면 펫 완료 연출을 재생한다. */
  const handleCloseMission = () => {
    // 모달 닫힐 때 강아지 웃음 트리거
    if (trans) {
      changePetState(PetStates.HAPPY, { duration: 1500 });
      setTrans(false); // 초기화
    }
    setShowMissionModal(false);
  };

  /**
   * 걸음수 동기화 훅.
   * - 1000보 단위로 서버 동기화
   * - resetSync는 로컬 동기화 상태 초기화용
   */
  const { syncSteps, resetSync } = useStepSync();
  const [isLoading, setIsLoading] = useState(true);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  // __DEV__에서만 쓰는 체형 미세조정 프리뷰 값이다. null이면 실제 사용자 PBF를 따른다.
  const [devPreviewPbf, setDevPreviewPbf] = useState<number | null>(null);
  const [devPbfBarWidth, setDevPbfBarWidth] = useState(0);
  const [currentPbf, setCurrentPbf] = useState<number | null>(null);
  const userGender = useSelector((state: RootState) => state.user.gender);
  const selectedPetType = useSelector((state: RootState) => state.user.petType);
  const mainPetTemplateId = PET_TEMPLATE_ID_BY_TYPE[selectedPetType].main;
  const runPetTemplateId = PET_TEMPLATE_ID_BY_TYPE[selectedPetType].run;
  const dispatch = useAppDispatch();
  useEffect(() => {
    /** 사용자 기본 정보와 petType 캐시를 메인 진입 시 동기화한다. */
    const fetchUser = async () => {
      try {
        const data = await getUser();
        // null 값 체크
        if (data.userId == null || data.nickname == null) {
          throw new Error('유저 정보가 올바르지 않습니다.');
        }
        if (!data.pet) {
          await AsyncStorage.removeItem('petId');
          dispatch(userSlice.actions.setPet(null));
          return;
        }
        dispatch(userSlice.actions.setPet(data.pet.petId));
        const resolvedPetType =
          data.petType === 'DOG' || data.petType === 'CAT'
            ? data.petType
            : null;
        // 전역 상태는 서버 응답을 우선 반영한다.
        // 이전 세션의 로컬 petType이 최신 서버값을 덮어쓰지 않도록 여기서 우선순위를 고정한다.
        dispatch(
          userSlice.actions.setUser({
            userId: data.userId,
            nickname: data.nickname,
            gender: data.gender,
            profileImageUrl: data.profileImageUrl,
            petType: resolvedPetType ?? undefined,
          })
        );

        if (resolvedPetType) {
          try {
            await setPetId(data.pet.petId);
            // 서버가 준 최신 petType으로 로컬 캐시를 재정렬해 다음 진입 시 stale 값을 줄인다.
            await AsyncStorage.setItem(PET_TYPE_STORAGE_KEY, resolvedPetType);
          } catch (storageError) {
            console.warn('[MainPage] petType 캐시 저장 실패', storageError);
          }
          return;
        }

        try {
          await setPetId(data.pet.petId);
          // 구버전 응답 등으로 petType이 비어 있을 때만 로컬 캐시를 fallback으로 사용한다.
          const storedPetType = await AsyncStorage.getItem(
            PET_TYPE_STORAGE_KEY
          );
          if (storedPetType === 'DOG' || storedPetType === 'CAT') {
            dispatch(userSlice.actions.updatePetType(storedPetType as PetType));
          }
        } catch (storageError) {
          console.warn('[MainPage] petType 로드 실패', storageError);
        }
      } catch (e) {
        console.error('유저 정보 로드 실패', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);
  /**
   * 러닝 추적 상태/경로/카메라 영역/세션 시작·종료 핸들러.
   */
  const {
    isTracking,
    path,
    trackPoints,
    region,
    liveSteps,
    startSession,
    endSession,
  } = useGpsSession();
  const [runSummary, setRunSummary] = useState<GpsSessionSummary | null>(null);
  const [showRunSummaryModal, setShowRunSummaryModal] = useState(false);
  const [endFailureCount, setEndFailureCount] = useState(0);
  const [runningElapsedSec, setRunningElapsedSec] = useState(0);
  const [, setTodayRunAccumulatedSec] = useState(0);

  // 최근 3개 trackPoint의 speed(m/s) 평균으로 현재 페이스 계산
  const livePaceMinPerKm = useMemo(() => {
    const recent = trackPoints.slice(-3);
    const speeds = recent
      .map((p) => p.speed)
      .filter((s): s is number => s != null && s > 0.5); // 정지(0.5m/s 미만) 제외
    if (speeds.length === 0) return null;
    const avgSpeedMps = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    return 1000 / avgSpeedMps / 60; // min/km
  }, [trackPoints]);
  const runBgProgress = useRef(new Animated.Value(0)).current;
  const runSwirlProgress = useRef(new Animated.Value(0)).current;

  const mapRef = useRef<MapView | null>(null);
  const runningStartMsRef = useRef<number | null>(null);
  const [showBodyPrompt, setShowBodyPrompt] = useState(false);
  const [savingBodyHistory, setSavingBodyHistory] = useState(false);
  const [bodyGoals, setBodyGoals] = useState<BodyGoals>({});
  const bodyPromptDate = new Date();
  const bodyPromptBaseDate = formatDateKey(bodyPromptDate);
  const bodyPromptDateLabel = formatDateLabel(bodyPromptDate);
  /** 오늘 날짜 기준 누적 러닝 시간 저장 키를 계산한다. */
  const getTodayRunSecondsKey = useCallback(
    () => `${DAILY_RUN_SECONDS_KEY_PREFIX}${formatDateKey(new Date())}`,
    []
  );

  /** 오늘 누적 러닝 시간을 storage와 state에 함께 반영한다. */
  const appendTodayRunSeconds = useCallback(
    async (addSeconds: number) => {
      if (addSeconds <= 0) return;
      try {
        const key = getTodayRunSecondsKey();
        const raw = await AsyncStorage.getItem(key);
        const prev = Number(raw ?? '0');
        const next = Math.max(0, prev) + Math.floor(addSeconds);
        await AsyncStorage.setItem(key, String(next));
        setTodayRunAccumulatedSec(next);
      } catch (error) {
        console.warn('[MainPage] 러닝 시간 누적 저장 실패', error);
      }
    },
    [getTodayRunSecondsKey]
  );

  useEffect(() => {
    // 러닝 중 여부를 전역 상태로 동기화한다.
    dispatch(userSlice.actions.setRunningActive(isTracking));
  }, [dispatch, isTracking]);

  useEffect(() => {
    // MainPage를 벗어날 때 전역 러닝 플래그를 안전하게 해제한다.
    return () => {
      dispatch(userSlice.actions.setRunningActive(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (isTracking) {
      petShadowBreath.stopAnimation();
      petShadowBreath.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(petShadowBreath, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(petShadowBreath, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [isTracking, petShadowBreath]);

  useEffect(() => {
    if (!isTracking) {
      runningStartMsRef.current = null;
      setRunningElapsedSec(0);
      return;
    }

    // 러닝 시작 시각을 고정하고 1초 간격으로 경과 시간을 갱신한다.
    if (runningStartMsRef.current === null) {
      runningStartMsRef.current = Date.now();
    }

    const updateElapsed = () => {
      if (runningStartMsRef.current === null) return;
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - runningStartMsRef.current) / 1000)
      );
      setRunningElapsedSec(elapsed);
    };

    updateElapsed();
    const intervalId = setInterval(updateElapsed, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking) {
      runBgProgress.stopAnimation();
      runBgProgress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(runBgProgress, {
        toValue: 1,
        duration: RUN_BG_LOOP_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => {
      loop.stop();
      runBgProgress.stopAnimation();
    };
  }, [isTracking, runBgProgress]);

  useEffect(() => {
    if (!isTracking) {
      runSwirlProgress.stopAnimation();
      runSwirlProgress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(runSwirlProgress, {
        toValue: 1,
        duration: RUN_SWIRL_LOOP_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => {
      loop.stop();
      runSwirlProgress.stopAnimation();
    };
  }, [isTracking, runSwirlProgress]);

  useEffect(() => {
    /**
     * 로컬에 저장된 몸 목표값 불러오기 (프롬프트 진행률 계산용)
     */
    loadBodyGoals().then(setBodyGoals);
  }, []);

  useEffect(() => {
    const loadTodayRunAccumulatedSec = async () => {
      try {
        const key = getTodayRunSecondsKey();
        const raw = await AsyncStorage.getItem(key);
        setTodayRunAccumulatedSec(Math.max(0, Number(raw ?? '0')));
      } catch (error) {
        console.warn('[MainPage] 누적 러닝 시간 로드 실패', error);
        setTodayRunAccumulatedSec(0);
      }
    };
    loadTodayRunAccumulatedSec();
  }, [getTodayRunSecondsKey]);

  /**
   * 오늘 몸 기록이 있는지 확인
   * - 기록이 있으면 프롬프트를 스킵한다.
   * - 조회 실패는 기록 없음과 구분해, 중복 입력을 유도하지 않는다.
   */
  const checkTodayBodyHistory = useCallback(async (): Promise<
    'found' | 'missing' | 'failed'
  > => {
    const todayKey = formatDateKey(new Date());
    try {
      const existing = await getBodyHistoryByDate(todayKey);
      if (existing) {
        setCurrentPbf(existing.pbf);
        // 오늘 기록이 있으면 팝업을 띄우지 않고 스킵 상태로 저장
        await AsyncStorage.setItem(BODY_PROMPT_SKIP_KEY, todayKey);
        setShowBodyPrompt(false);
        return 'found';
      }
      setCurrentPbf(null);
      return 'missing';
    } catch (err: any) {
      console.error('[BodyPrompt] 오늘 기록 조회 실패', err);
      // 서버/네트워크 오류 시에는 이미 기록한 사용자가 다시 입력하지 않도록 프롬프트를 닫는다.
      setShowBodyPrompt(false);
      return 'failed';
    }
  }, []);

  /**
   * 프롬프트 표시 여부를 초기화
   */
  useEffect(() => {
    const loadPromptState = async () => {
      const todayKey = formatDateKey(new Date());
      try {
        const skipDate = await AsyncStorage.getItem(BODY_PROMPT_SKIP_KEY);
        if (skipDate === todayKey) {
          setShowBodyPrompt(false);
          return;
        }
        const bodyHistoryState = await checkTodayBodyHistory();
        if (bodyHistoryState === 'found' || bodyHistoryState === 'failed') {
          // found는 이미 기록됨, failed는 조회 불가 상태이므로 둘 다 프롬프트를 열지 않는다.
          return;
        }
        setShowBodyPrompt(true);
      } catch (err) {
        console.error('[BodyPrompt] 상태 로딩 실패', err);
        setShowBodyPrompt(false);
      }
    };

    loadPromptState();
  }, [checkTodayBodyHistory]);

  /**
   * 펫 FSM 상태 훅.
   */
  // FSM state value is intentionally not consumed yet; this page currently uses transition events only.
  const { transition: changePetState } = usePetFSM();
  const baselinePbf =
    userGender === 'female' ? FEMALE_BASELINE_PBF : MALE_BASELINE_PBF;
  const selectedPreviewPbf = devPreviewPbf;
  const effectivePbf = selectedPreviewPbf ?? currentPbf ?? baselinePbf;
  // 테스트 바 thumb/fill 위치 계산용 진행률이다.
  const devPbfProgress = Math.min(
    1,
    Math.max(0, (effectivePbf - DEV_PBF_MIN) / (DEV_PBF_MAX - DEV_PBF_MIN))
  );
  const { idlePartTransforms, runPartTransforms } = useMainPetMotion({
    isTracking,
    effectivePbf,
    selectedPetType,
    mainPetTemplateId,
    petRenderSize: PET_RENDER_SIZE,
  });
  const {
    expressionOverlays: petExpressionOverlays,
    petPanHandlers,
    resetPetExpression,
    showPetPressExpression,
    showRunCompleteExpression,
  } = usePetExpression(selectedPetType);

  /** 펫을 터치했을 때 HAPPY 상태 전환을 트리거한다. */
  const onPetTouch = useCallback(() => {
    // 1.5초 동안 HAPPY 상태 유지 후 자동 IDLE
    changePetState(PetStates.HAPPY, { duration: 1500 });
    showPetPressExpression();
  }, [changePetState, showPetPressExpression]);

  /**
   * 지도 카메라 이동
   * - isTracking: 추적 중일 때만 카메라 이동
   * - path.length: 좌표가 하나도 없으면 이동하지 않음
   * - region: region이 바뀔 때마다 카메라 이동
   */
  useEffect(() => {
    if (!isTracking) return;
    if (path.length === 0) return;

    // 추적 중 최신 좌표 갱신 -> 지도 카메라 위치 이동
    mapRef.current?.animateToRegion?.(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      },
      500
    );
  }, [isTracking, path, region]);

  /**
   * Health Connect 오늘 걸음 수
   */
  const {
    steps: healthSteps,
    addSteps,
    error: healthError,
    writing: healthWriting,
  } = useHealthSteps();

  /**
   * 2초마다 걸음수 서버 동기화 (값이 바뀐 경우에만)
   */
  const prevSyncedStepsRef = useRef<number | null>(null);

  useEffect(() => {
    if (healthSteps == null) return;

    if (prevSyncedStepsRef.current !== healthSteps) {
      if (__DEV__) {
        console.log('syncSteps 호출', {
          healthSteps,
          prev: prevSyncedStepsRef.current,
        });
      }
      syncSteps(healthSteps);
      prevSyncedStepsRef.current = healthSteps;
    }
  }, [healthSteps, syncSteps]);

  useEffect(() => {
    if (!isTracking) return;
    if (healthSteps == null) return;

    updateRunningNotification(runningElapsedSec, healthSteps);
  }, [runningElapsedSec, healthSteps, isTracking]);

  const healthErrorShownRef = useRef(false);
  /**
   * 개발용 걸음수 +1000 버튼.
   */
  const handleDevAddSteps = useCallback(async () => {
    try {
      await addSteps(1000);
    } catch (err: any) {
      // 훅에서 error 상태를 설정하지만, 개발용 버튼은 즉시 안내한다.
      healthErrorShownRef.current = true;
      Alert.alert(
        '걸음 추가 실패',
        err?.message ?? '걸음 수를 추가하지 못했습니다.'
      );
    }
  }, [addSteps]);

  const handleToggleDevTools = useCallback(() => {
    setIsDevToolsOpen((prev) => !prev);
  }, []);

  const handleForceEnd = useCallback(async () => {
    try {
      const result = await endSession();
      await stopRunningNotification();
      if (result?.summary) {
        setRunSummary(result.summary);
        setShowRunSummaryModal(true);
        await appendTodayRunSeconds(result.summary.durationMs / 1000);
        showRunCompleteExpression();
        await logRunningComplete({
          distance_m: Math.round(result.summary.distanceMeters),
          duration_s: Math.round(result.summary.durationMs / 1000),
        });
      }
      setEndFailureCount(0);
    } catch (err: any) {
      setEndFailureCount((prev) => prev + 1);
      Alert.alert(
        '러닝 종료 실패',
        err?.message ?? '러닝 종료 중 문제가 발생했어요.'
      );
    }
  }, [appendTodayRunSeconds, endSession, showRunCompleteExpression]);

  const handleSetDevPreviewPbf = useCallback((value: number) => {
    setDevPreviewPbf(clampDevPbf(value));
  }, []);

  const handleAdjustDevPreviewPbf = useCallback(
    (delta: number) => {
      setDevPreviewPbf((prev) => {
        const nextBase = prev ?? currentPbf ?? baselinePbf;
        return clampDevPbf(nextBase + delta);
      });
    },
    [baselinePbf, currentPbf]
  );

  const handleClearDevPreviewPbf = useCallback(() => {
    setDevPreviewPbf(null);
  }, []);

  const handlePressDevPbfBar = useCallback(
    (locationX: number) => {
      if (devPbfBarWidth <= 0) {
        return;
      }

      const ratio = Math.min(1, Math.max(0, locationX / devPbfBarWidth));
      const value = DEV_PBF_MIN + ratio * (DEV_PBF_MAX - DEV_PBF_MIN);
      handleSetDevPreviewPbf(value);
    },
    [devPbfBarWidth, handleSetDevPreviewPbf]
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        // 화면을 벗어나면 테스트값을 버리고, 재진입 시 실제 사용자 체지방률로 복귀한다.
        setDevPreviewPbf(null);
        resetPetExpression();
      };
    }, [resetPetExpression])
  );

  /**
   * Running 시작/종료 핸들러
   * - isTracking이 true면 러닝 종료
   * - isTracking이 false면 카운트다운 후 시작
   */
  const handleToggleTracking = useCallback(async () => {
    // 추적 중이면 종료를 시도한다.
    if (isTracking) {
      try {
        const result = await endSession();
        await stopRunningNotification();
        if (result?.summary) {
          setRunSummary(result.summary);
          setShowRunSummaryModal(true);
          await appendTodayRunSeconds(result.summary.durationMs / 1000);
          showRunCompleteExpression();
          await logRunningComplete({
            distance_m: Math.round(result.summary.distanceMeters),
            duration_s: Math.round(result.summary.durationMs / 1000),
          });
        }
        setEndFailureCount(0);
      } catch (err: any) {
        const message = err?.message ?? '러닝 종료 중 문제가 발생했어요.';
        const nextFailureCount = endFailureCount + 1;
        setEndFailureCount(nextFailureCount);
        if (nextFailureCount >= END_FAILURE_FORCE_THRESHOLD) {
          Alert.alert(
            '러닝 종료 반복 실패',
            `${message}\n\n종료가 ${END_FAILURE_FORCE_THRESHOLD}회 이상 실패했습니다. 강제 종료로 종료할까요?`,
            [
              {
                text: '강제 종료',
                style: 'destructive',
                onPress: () => {
                  handleForceEnd();
                },
              },
              { text: '취소', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert(
            '러닝 종료 실패',
            `${message}\n(${nextFailureCount}/${END_FAILURE_FORCE_THRESHOLD})`
          );
        }
      }
      return;
    }

    setCountdown(3);
  }, [
    appendTodayRunSeconds,
    endSession,
    handleForceEnd,
    endFailureCount,
    isTracking,
    showRunCompleteExpression,
  ]);

  /**
   * 오늘 프롬프트를 스킵 처리한다.
   */
  const markSkipToday = useCallback(async () => {
    const todayKey = formatDateKey(new Date());
    try {
      await AsyncStorage.setItem(BODY_PROMPT_SKIP_KEY, todayKey);
    } catch (err) {
      console.error('[BodyPrompt] 스킵 상태 저장 실패', err);
    }
  }, []);

  /**
   * 몸 기록 저장 처리.
   */
  const handleSaveBodyPrompt = useCallback(
    async (values: BodyHistoryFormValues) => {
      setSavingBodyHistory(true);
      try {
        await createBodyHistory({
          heightCm: values.heightCm,
          weightKg: values.weightKg,
          pbf: values.pbf,
          baseDate: values.baseDate,
        });
        setCurrentPbf(values.pbf);
        await markSkipToday();
        setShowBodyPrompt(false);
        Alert.alert('기록 완료', '오늘의 몸 기록을 저장했어요.');
      } catch (err) {
        console.error('[BodyPrompt] 기록 저장 실패', err);
        Alert.alert('저장 실패', '몸 기록 저장 중 문제가 발생했어요.');
      } finally {
        setSavingBodyHistory(false);
      }
    },
    [markSkipToday]
  );

  /**
   * 오늘은 안 볼래요 처리
   */
  const handleSkipBodyPromptToday = useCallback(async () => {
    await markSkipToday();
    setShowBodyPrompt(false);
  }, [markSkipToday]);

  /**
   * 나중에 할게요 처리 (오늘은 숨김만)
   */
  const handleLaterBodyPrompt = useCallback(() => {
    setShowBodyPrompt(false);
  }, []);

  /**
   * 카운트다운 애니메이션 처리
   */
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      (async () => {
        try {
          const started = await startSession();
          if (!started) {
            // 권한 거부 등은 하위 훅(startTracking)에서 이미 안내한다.
            await stopRunningNotification();
            return;
          }
          await startRunningNotification();
          await logRunningStart();
          setEndFailureCount(0);
        } catch (err: any) {
          Alert.alert(
            '러닝 시작 실패',
            err?.message ?? '러닝 시작 중 문제가 발생했어요.'
          );
        }
      })();
      return;
    }
    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, scaleAnim, opacityAnim, startSession]);

  /**
   * 미션 새로고침.
   */
  const refreshMissions = useCallback(async () => {
    try {
      const activeMission = await getMissionsActive();
      setMissionApiItems(activeMission.missions);
    } catch (err) {
      console.error('미션 업데이트 실패', err);
    }
  }, []);
  /**
   * 화면 진입 시 최신 미션 1회 불러오기.
   */
  useFocusEffect(
    useCallback(() => {
      refreshMissions();
    }, [refreshMissions])
  );

  /**
   * SSE mission-progress 이벤트로 로컬 미션 상태 갱신.
   */
  const handleMissionProgress = useCallback((event: MissionProgressEvent) => {
    setMissionApiItems((prev) =>
      prev.map((item) =>
        item.missionCheckId === event.missionCheckId
          ? {
              ...item,
              progressValue: event.progressValue,
              isCompleted: event.completed,
              completedAt: event.completedAt,
            }
          : item
      )
    );
  }, []);

  useMissionSSE(handleMissionProgress);

  // Progress Bar 가공
  const progressMissions = useMemo(() => {
    return missionApiItems
      .filter((m) => !m.isCompleted && m.periodType === 'DAILY')
      .map((m) => {
        // 기본값은 서버 데이터
        let currentDisplayValue = m.progressValue ?? 0;

        // 만약 걸음수 미션(STEP)이라면, 실시간 기기 걸음수(healthSteps)를 반영
        if (m.category === 'STEP' && healthSteps !== null) {
          // 서버의 마지막 동기화 값보다 현재 기기 걸음수가 더 크면 기기 값을 사용
          currentDisplayValue = Math.max(m.progressValue, healthSteps);
        }

        // 미션 진행도(progressValue)가 goalValue를 초과할 수 없도록 고정
        const completeDisplayValue = Math.min(
          currentDisplayValue,
          m.goalValue ?? 0
        );

        const isReadyToComplete = currentDisplayValue >= m.goalValue;

        return {
          id: m.missionCheckId.toString(),
          title: m.title,
          current: completeDisplayValue,
          goal: m.goalValue,
          unit:
            m.category === 'STEP' ? '보' : m.category === 'MEAL' ? '회' : '장',
          category: m.category,
          isReadyToComplete,
          missionCheckId: m.missionCheckId,
        };
      });
  }, [missionApiItems, healthSteps]);

  useEffect(() => {
    if (!healthError) {
      healthErrorShownRef.current = false;
      return;
    }
    if (healthErrorShownRef.current) return;
    healthErrorShownRef.current = true;
    const apiLevel = getAndroidApiLevel();
    const isUnsupportedDevice =
      Platform.OS === 'android' &&
      apiLevel != null &&
      apiLevel <= STEP_SYNC_OS_POLICY.unsupportedMaxApi &&
      healthError === STEP_SYNC_MESSAGES.unsupported;
    if (isUnsupportedDevice) {
      Alert.alert(
        '걸음 수 연동 불가',
        `${healthError}\n\n현재 단말에서는 걸음수 자동 동기화를 지원하지 않습니다.`,
        [
          {
            text: '확인',
            style: 'default',
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return;
    }
    Alert.alert('걸음 수 연동 실패', healthError);
  }, [healthError]);

  /**
   * 유저 데이터가 아직 없다면 스피너 표시.
   */
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.textPrimary} />
      </View>
    );
  }

  /**
   * 표시할 걸음 수
   * - 권한 거부/불러오기 실패 시 기본값으로 대체
   */
  const displayedSteps = healthSteps ?? 8954;
  const estimatedKcal = Math.round(displayedSteps * KCAL_PER_STEP);
  const runPetRenderSize = Math.round(PET_RENDER_SIZE * RUN_PET_SCALE);
  const runBgTranslateX = runBgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, RUN_BG_TILE_WIDTH],
  });
  const runLegSwirlRotate = runSwirlProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const runLegSwirlScale = runSwirlProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.92, 1.08, 0.92],
  });
  const petShadowScaleX = petShadowBreath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const petShadowScaleY = petShadowBreath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });
  const petShadowOpacity = petShadowBreath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.34, 0.22],
  });
  return (
    <View style={styles.container}>
      {/*
        START 버튼 누른 후 카운트 다운
      */}
      {countdown !== null && (
        <View style={styles.countdownOverlay}>
          <Animated.Text
            style={[
              styles.countdownText,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {countdown}
          </Animated.Text>
        </View>
      )}
      {!isTracking ? (
        <ImageBackground
          source={mainBackGround}
          style={styles.mainFullBackground}
          resizeMode='cover'
        />
      ) : null}
      {/*
        런닝 중: 페이스/걸음수/시간 스탯 패널
        평시: 미션 진행 상황을 가로 스크롤로 표시
      */}
      <View style={styles.progressContainer}>
        {isTracking ? (
          <View style={styles.runningStatPanel}>
            <View style={styles.runningStatPanelItem}>
              <Text style={styles.runningStatPanelLabel}>페이스</Text>
              <Text style={styles.runningStatPanelValue}>
                {livePaceMinPerKm == null
                  ? "--'--''"
                  : (() => {
                      const totalSec = Math.round(livePaceMinPerKm * 60);
                      const min = Math.floor(totalSec / 60);
                      const sec = totalSec % 60;
                      return `${min}'${String(sec).padStart(2, '0')}''`;
                    })()}
              </Text>
              <Text style={styles.runningStatPanelUnit}>min/km</Text>
            </View>
            <View style={styles.runningStatPanelDivider} />
            <View style={styles.runningStatPanelItem}>
              <Text style={styles.runningStatPanelLabel}>걸음 수</Text>
              <Text style={styles.runningStatPanelValue}>
                {liveSteps.toLocaleString()}
              </Text>
              <Text style={styles.runningStatPanelUnit}>보</Text>
            </View>
            <View style={styles.runningStatPanelDivider} />
            <View style={styles.runningStatPanelItem}>
              <Text style={styles.runningStatPanelLabel}>시간</Text>
              <Text style={styles.runningStatPanelValue}>
                {formatRunningElapsed(runningElapsedSec)}
              </Text>
              <Text style={styles.runningStatPanelUnit}>경과</Text>
            </View>
          </View>
        ) : (
          <>
            {/*
          일일 미션을 수평 스크롤 카드 형태로 표시, 미션이 없으면 미션 X 띄움
        */}
            {progressMissions.length === 0 ? (
              <View style={styles.emptyMissionContainer}>
                <Text style={styles.emptyMissionText}>
                  완벽한 하루예요! 내일도 함께해요!
                </Text>
              </View>
            ) : (
              <FlatList
                data={progressMissions}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <StepProgress
                    title={item.title}
                    current={item.current}
                    goal={item.goal}
                    unit={item.unit}
                    category={item.category}
                    tone={
                      index % 3 === 0
                        ? 'lime'
                        : index % 3 === 1
                        ? 'violet'
                        : 'orange'
                    }
                    isReadyToComplete={item.isReadyToComplete}
                    onPress={() => {
                      if (!item.isReadyToComplete) return;
                      handleOpenMission();
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.progressRow}
              />
            )}
          </>
        )}
      </View>
      {isTracking ? (
        <View style={styles.mapContainer}>
          <View style={styles.mainBackground}>
            <Animated.View
              style={[
                styles.runBgScroller,
                {
                  left: -RUN_BG_TILE_WIDTH,
                  width: RUN_BG_TILE_WIDTH * 3,
                  transform: [{ translateX: runBgTranslateX }],
                },
              ]}
            >
              {/* 동일한 배경 타일을 반복 배치해 무한 스크롤 배경을 단순하게 구성한다. */}
              {RUN_BG_TILE_OFFSETS.map((offset) => (
                <Image
                  key={offset}
                  source={mainBackGroundWide}
                  style={[styles.runBgTile, { width: RUN_BG_TILE_WIDTH }]}
                  resizeMode='stretch'
                />
              ))}
            </Animated.View>
            <View style={styles.runHud}>
              <View style={styles.runHudInner}>
                <Text style={styles.runTimerValue}>
                  {formatRunningElapsed(runningElapsedSec)}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.runningPetLayer,
                { width: runPetRenderSize, height: runPetRenderSize },
              ]}
            >
              <PetRenderer
                size={runPetRenderSize}
                templateId={runPetTemplateId}
                partTransforms={runPartTransforms}
                style={[
                  styles.running_pet,
                  {
                    transform: [
                      {
                        translateY:
                          runPetRenderSize * PET_FOOT_BOTTOM_OFFSET_RATIO,
                      },
                    ],
                  },
                ]}
              />
              <Animated.Image
                source={runLegSwirl}
                style={[
                  styles.runningLegSwirl,
                  {
                    width: runPetRenderSize * RUN_SWIRL_SIZE_RATIO,
                    height: runPetRenderSize * RUN_SWIRL_SIZE_RATIO,
                    left: runPetRenderSize * RUN_SWIRL_CENTER_LEFT_RATIO,
                    bottom: runPetRenderSize * RUN_SWIRL_BOTTOM_RATIO,
                    transform: [
                      { rotate: runLegSwirlRotate },
                      { scale: runLegSwirlScale },
                    ],
                  },
                ]}
                resizeMode='contain'
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.mainBackground}>
          <Animated.View
            pointerEvents='none'
            style={[
              styles.mainPetShadow,
              {
                opacity: petShadowOpacity,
                transform: [
                  { scaleX: petShadowScaleX },
                  { scaleY: petShadowScaleY },
                ],
              },
            ]}
          />
          {/* 오른쪽 상단 미션 버튼 */}
          <TouchableOpacity
            onPress={handleOpenMission}
            style={styles.missionButton}
          >
            <Image
              source={require('@assets/images/Icon_colored/fb_mission.png')}
              style={styles.missionIcon}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <MissionModal
            visible={showMissionModal}
            onClose={handleCloseMission}
            missions={missionApiItems}
            onComplete={() => {
              refreshMissions(); // 기존 미션 새로고침
              setTrans(true);
            }}
          />
          <RunningSummaryModal
            visible={showRunSummaryModal}
            onClose={() => setShowRunSummaryModal(false)}
            durationText={
              runSummary ? formatDuration(runSummary.durationMs) : '0분 0초'
            }
            distanceMeters={runSummary?.distanceMeters ?? 0}
            stepCount={runSummary?.stepCount ?? 0}
            avgSpeedMps={runSummary?.avgSpeedMps ?? 0}
          />
          <View
            style={styles.pet}
            collapsable={false}
            // 드래그 상호작용은 표정 훅이 전담하고, 화면은 핸들러만 연결한다.
            {...petPanHandlers}
          >
            <Pressable onPress={onPetTouch}>
              <PetRenderer
                size={PET_RENDER_SIZE}
                templateId={mainPetTemplateId}
                partTransforms={idlePartTransforms}
                expressionOverlays={petExpressionOverlays}
                style={[
                  styles.petImage,
                  {
                    transform: [
                      {
                        translateY:
                          PET_RENDER_SIZE * PET_FOOT_BOTTOM_OFFSET_RATIO,
                      },
                    ],
                  },
                ]}
              />
            </Pressable>
          </View>
          {!isTracking && (
            <MainStatCards
              stepCount={displayedSteps}
              estimatedKcal={estimatedKcal}
              onStartRun={handleToggleTracking}
            />
          )}
          {__DEV__ && (
            <View style={styles.devButtonGroup}>
              <TouchableOpacity
                style={styles.devToggleButton}
                onPress={handleToggleDevTools}
                accessibilityRole='button'
                accessibilityLabel={
                  isDevToolsOpen ? '개발 도구 닫기' : '개발 도구 열기'
                }
              >
                <Text style={styles.devToggleText}>[DEV]</Text>
              </TouchableOpacity>

              {isDevToolsOpen && (
                <>
                  <TouchableOpacity
                    style={styles.devHealthButton}
                    onPress={handleDevAddSteps}
                    accessibilityLabel='Health Connect 걸음 +1000'
                    disabled={healthWriting}
                  >
                    <Text style={styles.devHealthButtonText}>+1000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.devHealthButton}
                    onPress={resetSync}
                    accessibilityLabel='걸음 동기화 초기화'
                  >
                    <Text style={styles.devHealthButtonText}>RESET</Text>
                  </TouchableOpacity>
                  <View style={styles.devPbfPanel}>
                    <View style={styles.devPbfHeader}>
                      <Text style={styles.devPbfTitle}>
                        TEST PBF {effectivePbf}
                      </Text>
                      <TouchableOpacity
                        style={styles.devPbfResetButton}
                        onPress={handleClearDevPreviewPbf}
                        accessibilityRole='button'
                        accessibilityLabel='체형 테스트 pbf 초기화'
                      >
                        <Text style={styles.devPbfResetText}>LIVE</Text>
                      </TouchableOpacity>
                    </View>
                    <Pressable
                      style={styles.devPbfBar}
                      onLayout={(event) => {
                        setDevPbfBarWidth(event.nativeEvent.layout.width);
                      }}
                      onPress={(event) => {
                        handlePressDevPbfBar(event.nativeEvent.locationX);
                      }}
                      accessibilityRole='adjustable'
                      accessibilityLabel={`체형 테스트 pbf ${effectivePbf}`}
                    >
                      <View
                        style={[
                          styles.devPbfBarFill,
                          { width: `${devPbfProgress * 100}%` },
                        ]}
                      />
                      <View
                        style={[
                          styles.devPbfBarThumb,
                          { left: `${devPbfProgress * 100}%` },
                        ]}
                      />
                    </Pressable>
                    <View style={styles.devPbfScaleRow}>
                      <Text style={styles.devPbfScaleText}>{DEV_PBF_MIN}</Text>
                      <Text style={styles.devPbfScaleText}>{DEV_PBF_MAX}</Text>
                    </View>
                    <View style={styles.devPbfControls}>
                      <TouchableOpacity
                        style={styles.devPbfAdjustButton}
                        onPress={() => handleAdjustDevPreviewPbf(-DEV_PBF_STEP)}
                      >
                        <Text style={styles.devPbfAdjustText}>-1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.devPbfAdjustButton}
                        onPress={() => handleAdjustDevPreviewPbf(DEV_PBF_STEP)}
                      >
                        <Text style={styles.devPbfAdjustText}>+1</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      )}
      {isTracking ? (
        <TouchableOpacity
          style={styles.startButton}
          accessibilityRole='button'
          accessibilityLabel='러닝 종료'
          onPress={handleToggleTracking}
        >
          <View style={styles.startButtonInner}>
            <Text style={styles.startText}>END</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      <BodyRecordPrompt
        visible={showBodyPrompt}
        dateLabel={bodyPromptDateLabel}
        baseDate={bodyPromptBaseDate}
        // 목표값에 대한 진행률/aim 라벨을 실제 데이터로 표시
        weightAim={bodyGoals.weightAim}
        bodyFatAim={bodyGoals.bodyFatAim}
        onSave={handleSaveBodyPrompt}
        onLater={handleLaterBodyPrompt}
        onSkipToday={handleSkipBodyPromptToday}
        saving={savingBodyHistory}
      />
    </View>
  );
};

export default MainPage;
