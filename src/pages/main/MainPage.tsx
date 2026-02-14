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
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepProgress } from '@components/StepProgress';
import { PetRenderer } from '@components/PetRenderer';
import BodyRecordPrompt from '@components/BodyRecordPrompt';
import styles from '@styles/MainPage.styles';
import mainBackGround from '@assets/images/mainBackGround_gym.png'; // MAIN 화면 배경
import mainBackGround_day from '@assets/images/mainBackground_track.png';
import MapView from 'react-native-maps';
import useGpsSession, { type GpsSessionSummary } from '@hooks/useGpsSession';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import type { BodyHistoryFormValues } from 'types/bodyHistory';
import { createBodyHistory, getBodyHistoryByDate } from '@api/bodyHistoryApi';
import useHealthSteps from '@hooks/useHealthSteps';
import { loadBodyGoals, type BodyGoals } from '@utils/bodyGoalsStorage';

/**
 * 오늘 몸 기록 프롬프트 스킵 여부 저장 키.
 */
const BODY_PROMPT_SKIP_KEY = 'fitpet:bodyPrompt:skipDate';
const END_FAILURE_FORCE_THRESHOLD = 3;
const PET_RENDER_SIZE = 480;
const PET_FOOT_BOTTOM_OFFSET_RATIO = 0.24;
const IDLE_BREATH_LOOP_MS = 3000;
const RUN_LOOP_MS = 520;
const HEAD_PART_KEYS = [
  'face',
  'ear_left',
  'ear_right',
  'eye_left',
  'eye_right',
  'eyebrow_left',
  'eyebrow_right',
  'mouth',
  'flushing_left',
  'flushing_right',
  'beard_leftDown',
  'beard_leftUp',
  'beard_rightDown',
  'beard_rightUp',
  'neckRuff',
] as const;

import { usePetFSM } from '@utils/petFSM';
import { PetStates } from '@utils/petState';
import { MissionActiveItem } from 'types/mission';
import { getMissionsActive } from '@api/missionApi';
import { useFocusEffect } from '@react-navigation/native';
import MissionModal from './missionModal';
import { useStepSync } from '@hooks/useStepSync';
import { getUser } from '@api/mainApi';
import { useAppDispatch } from '@store/index';
import userSlice from '@slices/user';
import RunningSummaryModal from './RunningSummaryModal';
import type { PartTransformInput } from '@utils/petTransformUtils';

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

  /**
   * 미션 데이터/모달 상태.
   */
  const [missionApiItems, setMissionApiItems] = useState<MissionActiveItem[]>(
    []
  );
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [trans, setTrans] = useState(false); // 미션 완료 트리거
  const handleOpenMission = () => setShowMissionModal(true);
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
  const dispatch = useAppDispatch();
  /**
   * 사용자 정보 받아오기
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        // null 값 체크
        if (data.userId == null || data.nickname == null) {
          throw new Error('유저 정보가 올바르지 않습니다.');
        }
        dispatch(
          userSlice.actions.setUser({
            userId: data.userId,
            nickname: data.nickname,
            gender: data.gender,
            profileImageId: data.profileImageId ?? 2,
          })
        );
      } catch (e) {
        console.log('유저 정보 로드 실패', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);
  /**
   * 러닝 추적 상태/경로/카메라 영역/세션 시작·종료 핸들러.
   */
  const { isTracking, path, region, startSession, endSession } =
    useGpsSession();
  const [runSummary, setRunSummary] = useState<GpsSessionSummary | null>(null);
  const [showRunSummaryModal, setShowRunSummaryModal] = useState(false);
  const [endFailureCount, setEndFailureCount] = useState(0);
  const isAndroid13OrLower =
    Platform.OS === 'android' &&
    Number(Platform.Version) > 0 &&
    Number(Platform.Version) <= 33;
  const getSamsungHealthGuide = useCallback(() => {
    return (
      'Android 13 이하에서는 삼성 헬스 연동이 필요합니다.\n' +
      '1) 삼성 헬스 → 더 보기(⋮) → 설정 → 헬스 커넥트 → 앱 권한 → 삼성 헬스 → 모두 허용\n' +
      '2) 삼성 헬스 → 설정 → 개인정보 → 민감정보 동의\n' +
      '3) 삼성 헬스 → 설정 → 삼성 클라우드 동기화 → 지금 동기화'
    );
  }, []);

  const mapRef = useRef<MapView | null>(null);
  const [showBodyPrompt, setShowBodyPrompt] = useState(false);
  const [savingBodyHistory, setSavingBodyHistory] = useState(false);
  const [bodyGoals, setBodyGoals] = useState<BodyGoals>({});
  const bodyPromptDate = new Date();
  const bodyPromptBaseDate = formatDateKey(bodyPromptDate);
  const bodyPromptDateLabel = formatDateLabel(bodyPromptDate);

  useEffect(() => {
    /**
     * 로컬에 저장된 몸 목표값 불러오기 (프롬프트 진행률 계산용)
     */
    loadBodyGoals().then(setBodyGoals);
  }, []);

  /**
   * 오늘 몸 기록이 있는지 확인
   * - 기록이 있으면 프롬프트를 스킵한다.
   */
  const checkTodayBodyHistory = useCallback(async () => {
    const todayKey = formatDateKey(new Date());
    try {
      const existing = await getBodyHistoryByDate(todayKey);
      if (existing) {
        // 오늘 기록이 있으면 팝업을 띄우지 않고 스킵 상태로 저장
        await AsyncStorage.setItem(BODY_PROMPT_SKIP_KEY, todayKey);
        setShowBodyPrompt(false);
        return true;
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return false; // 기록 없음
      }
      console.error('[BodyPrompt] 오늘 기록 조회 실패', err);
    }
    return false;
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
        const hasTodayRecord = await checkTodayBodyHistory();
        if (hasTodayRecord) return;
        setShowBodyPrompt(true);
      } catch (err) {
        console.error('[BodyPrompt] 상태 로딩 실패', err);
        setShowBodyPrompt(true);
      }
    };

    loadPromptState();
  }, [checkTodayBodyHistory]);

  /**
   * 펫 FSM 상태 훅.
   */
  const { transition: changePetState } = usePetFSM();
  const idleBreathProgress = useRef(new Animated.Value(0)).current;
  const runCycleProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTracking) {
      idleBreathProgress.stopAnimation();
      return;
    }

    const idleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleBreathProgress, {
          toValue: 1,
          duration: IDLE_BREATH_LOOP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(idleBreathProgress, {
          toValue: 0,
          duration: IDLE_BREATH_LOOP_MS / 2,
          useNativeDriver: true,
        }),
      ])
    );

    idleLoop.start();
    return () => {
      idleLoop.stop();
    };
  }, [idleBreathProgress, isTracking]);

  useEffect(() => {
    if (!isTracking) {
      runCycleProgress.stopAnimation();
      runCycleProgress.setValue(0);
      return;
    }

    const runLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(runCycleProgress, {
          toValue: 1,
          duration: RUN_LOOP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(runCycleProgress, {
          toValue: 0,
          duration: RUN_LOOP_MS / 2,
          useNativeDriver: true,
        }),
      ])
    );

    runLoop.start();
    return () => {
      runLoop.stop();
    };
  }, [isTracking, runCycleProgress]);

  const idlePartTransforms: Record<string, PartTransformInput> = useMemo(() => {
    const torsoScaleY = idleBreathProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.03],
    });
    const headTranslateY = idleBreathProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2],
    });

    const transforms: Record<string, PartTransformInput> = {
      torso: { scaleY: torsoScaleY },
    };

    HEAD_PART_KEYS.forEach((partKey) => {
      transforms[partKey] = { translateY: headTranslateY };
    });

    return transforms;
  }, [idleBreathProgress]);

  const runPartTransforms: Record<string, PartTransformInput> = useMemo(() => {
    const limbLeftX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-10, 10, -10],
    });
    const limbRightX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [10, -10, 10],
    });
    const torsoX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-2, 2, -2],
    });
    const torsoY = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -1.5, 0],
    });
    const faceX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-3, 3, -3],
    });
    const faceY = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -1, 0],
    });
    const armLeftRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['-10deg', '10deg', '-10deg'],
    });
    const armRightRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['10deg', '-10deg', '10deg'],
    });
    const legLeftRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['18deg', '-18deg', '18deg'],
    });
    const legRightRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['-18deg', '18deg', '-18deg'],
    });
    const tailRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['-14deg', '14deg', '-14deg'],
    });
    const tailX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-1.5, 1.5, -1.5],
    });
    const neckRuffX = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-2, 2, -2],
    });
    const neckRuffRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['-2deg', '2deg', '-2deg'],
    });

    return {
      torso: { translateX: torsoX, translateY: torsoY },
      arm_left: {
        translateX: limbLeftX,
        rotateDeg: armLeftRotate,
        useAnchorPivot: false,
      },
      arm_right: {
        translateX: limbRightX,
        rotateDeg: armRightRotate,
        useAnchorPivot: false,
      },
      leg_left: {
        translateX: limbRightX,
        rotateDeg: legLeftRotate,
        useAnchorPivot: false,
      },
      leg_right: {
        translateX: limbLeftX,
        rotateDeg: legRightRotate,
        useAnchorPivot: false,
      },
      tail: {
        translateX: tailX,
        rotateDeg: tailRotate,
        useAnchorPivot: false,
      },
      neckRuff: {
        translateX: neckRuffX,
        rotateDeg: neckRuffRotate,
        useAnchorPivot: false,
      },
      face: { translateX: faceX, translateY: faceY },
      eye_left: { translateX: faceX, translateY: faceY },
      eye_right: { translateX: faceX, translateY: faceY },
      mouth: { translateX: faceX, translateY: faceY },
    };
  }, [runCycleProgress]);

  /**
   * 펫 터치 시 상태 전환.
   */
  const onPetTouch = () => {
    // 1.5초 동안 HAPPY 상태 유지 후 자동 IDLE
    changePetState(PetStates.HAPPY, { duration: 1500 });
  };

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
    loading: healthLoading,
  } = useHealthSteps();
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

  const handleForceEnd = useCallback(async () => {
    try {
      const result = await endSession({ forceNoSteps: true });
      if (result?.summary) {
        setRunSummary(result.summary);
        setShowRunSummaryModal(true);
      }
      setEndFailureCount(0);
    } catch (err: any) {
      setEndFailureCount((prev) => prev + 1);
      Alert.alert(
        '러닝 종료 실패',
        err?.message ?? '러닝 종료 중 문제가 발생했어요.'
      );
    }
  }, [endSession]);

  /**
   * Running 시작/종료 핸들러
   * - isTracking이 true면 러닝 종료를 시도하되,
   *   Android에서는 Health Connect 상태(로딩/권한/데이터)에 따라 종료를 차단할 수 있음.
   * - isTracking이 false면 러닝 전이므로 카운트다운 후 시작
   */
  const handleToggleTracking = useCallback(async () => {
    // 추적 중이면 종료를 시도한다(안드로이드에서는 HC 상태에 따라 차단 가능).
    if (isTracking) {
      if (Platform.OS === 'android') {
        if (healthLoading) {
          Alert.alert(
            '걸음 수 확인 중',
            'Health Connect 데이터를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.'
          );
          return;
        }
        if (healthError || healthSteps == null) {
          const baseMessage =
            healthError ??
            'Health Connect 권한/데이터가 없습니다. 권한을 허용하고 다시 시도해 주세요.';
          Alert.alert(
            '걸음 수 권한 필요',
            isAndroid13OrLower
              ? `${baseMessage}\n\n${getSamsungHealthGuide()}`
              : baseMessage,
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
          return;
        }
      }
      try {
        const result = await endSession();
        if (result?.summary) {
          setRunSummary(result.summary);
          setShowRunSummaryModal(true);
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
    endSession,
    getSamsungHealthGuide,
    healthError,
    healthLoading,
    healthSteps,
    handleForceEnd,
    isAndroid13OrLower,
    endFailureCount,
    isTracking,
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
            return;
          }
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

  const [lastSyncedSteps, setLastSyncedSteps] = useState(0);
  /**
   * Health Steps 서버 전송 + 미션 최신화.
   */
  const refreshMissions = useCallback(async () => {
    try {
      if (healthSteps != null) {
        const diff = healthSteps - lastSyncedSteps;
        if (diff >= 1000) {
          await syncSteps(healthSteps);
          setLastSyncedSteps(healthSteps);
        }
      }
      const activeMission = await getMissionsActive();
      setMissionApiItems(activeMission.missions);
      // if (__DEV__) {
      //   const activeMission = mockActiveMissions;
      //   setMissionApiItems(activeMission.missions);
      // }
    } catch (err) {
      console.error('미션 업데이트 실패', err);
    }
  }, [healthSteps, lastSyncedSteps, syncSteps]);

  /**
   * Health Steps 변화 시 호출 (1000보 단위로 제한).
   */
  useEffect(() => {
    refreshMissions();
  }, [healthSteps, refreshMissions]);

  /**
   * 화면 포커스 시 최신 미션 불러오기.
   */
  useFocusEffect(
    useCallback(() => {
      refreshMissions();
    }, [refreshMissions])
  );

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
    Alert.alert(
      '걸음 수 연동 실패',
      isAndroid13OrLower
        ? `${healthError}\n\n${getSamsungHealthGuide()}`
        : healthError
    );
  }, [getSamsungHealthGuide, healthError, isAndroid13OrLower]);

  const formatDuration = (durationMs: number) => {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  };

  /**
   * 유저 데이터가 아직 없다면 스피너 표시.
   */
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#111827' />
      </View>
    );
  }

  /**
   * 표시할 걸음 수
   * - 권한 거부/불러오기 실패 시 기본값으로 대체
   */
  const displayedSteps = healthSteps ?? 8954;
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
      {/*
        미션 진행 상황을 가로 스크롤로 표시 
      */}
      <View style={styles.progressContainer}>
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
            renderItem={({ item }) => (
              <StepProgress
                title={item.title}
                current={item.current}
                goal={item.goal}
                unit={item.unit}
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
      </View>
      {isTracking ? (
        <View style={styles.mapContainer}>
          {/* 지도 대신 PNG 배경 */}
          <ImageBackground
            source={mainBackGround_day}
            style={styles.mainBackground}
            resizeMode='cover'
          >
            <PetRenderer
              size={PET_RENDER_SIZE}
              templateId='browncat_v1_run'
              partTransforms={runPartTransforms}
              style={[
                styles.running_pet,
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
          </ImageBackground>
        </View>
      ) : (
        // 배경 이미지 & 펫 이미지와 함께 메시지 표시
        <ImageBackground
          source={mainBackGround}
          style={styles.mainBackground}
          resizeMode='cover'
        >
          {/* 오른쪽 상단 미션 버튼 */}
          <TouchableOpacity
            onPress={handleOpenMission}
            style={styles.missionButton}
          >
            <Text style={styles.missionButtonText}>미션</Text>
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
            stepCount={runSummary?.stepCount ?? 0}
            avgSpeedKmh={runSummary?.avgSpeedKmh ?? 0}
            stepCountMissing={runSummary?.stepCountMissing}
          />
          {/* 현재는 FSM 상태 테스트를 위해 pressable 후에 미션 성공시로 변경 */}
          <Pressable onPress={onPetTouch} style={styles.pet}>
            <PetRenderer
              size={PET_RENDER_SIZE}
              partTransforms={idlePartTransforms}
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
          <View style={styles.messageRow}>
            <Text style={styles.message}>
              {`${displayedSteps.toLocaleString()}보 걸었어요!`}
            </Text>
            {__DEV__ && (
              <TouchableOpacity
                style={styles.devHealthButton}
                onPress={handleDevAddSteps}
                accessibilityLabel='Health Connect 걸음 +1000'
                disabled={healthWriting}
              >
                <Text style={styles.devHealthButtonText}>+1000</Text>
              </TouchableOpacity>
            )}
            {__DEV__ && (
              <TouchableOpacity
                style={styles.devHealthButton}
                onPress={resetSync}
                accessibilityLabel='걸음 동기화 초기화'
              >
                <Text style={styles.devHealthButtonText}>RESET</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      )}
      {/* Start / End Button */}
      <TouchableOpacity
        style={styles.startButton}
        accessibilityRole='button'
        accessibilityLabel={isTracking ? '러닝 종료' : '러닝 시작'} // 스크린리더
        onPress={handleToggleTracking}
      >
        <Text style={styles.startText}>{isTracking ? 'END' : 'START'}</Text>
      </TouchableOpacity>

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
