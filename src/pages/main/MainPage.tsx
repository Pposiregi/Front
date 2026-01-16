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
  Image,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import BodyRecordPrompt from '@components/BodyRecordPrompt';
import styles from '@styles/MainPage.styles';
import { getMissions } from './missions';
import mainBackGround from '@assets/images/mainBackGround.png'; // MAIN 화면 배경
import mainBackGround_day from '@assets/images/mainBackground_day.png';
import MapView from 'react-native-maps';
import { useRouteTracking } from '@hooks/useRouteTracking';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import type { BodyHistoryFormValues } from 'types/bodyHistory';
import { createBodyHistory, getBodyHistoryByDate } from '@api/bodyHistoryApi';
import useHealthSteps from '@hooks/useHealthSteps';
import { BODY_HISTORY_USER_ID } from '@env';
import { loadBodyGoals, type BodyGoals } from '@utils/bodyGoalsStorage';

const BODY_PROMPT_SKIP_KEY = 'fitpet:bodyPrompt:skipDate';

import { usePetFSM } from '@utils/petFSM';
import { PetStates } from '@utils/petState';
import { petImageByState } from '@utils/petImages';
import { MissionActiveItem } from 'types/mission';
import { getMissionsActive } from '@api/missionApi';
import { useFocusEffect } from '@react-navigation/native';
import MissionModal from './missionModal';
/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainPage = () => {
  // 애니메이션
  const runDogFrames = [
    require('@assets/images/pet/tile000-Photoroom.png'),
    require('@assets/images/pet/tile001-Photoroom.png'),
    require('@assets/images/pet/tile002-Photoroom.png'),
    require('@assets/images/pet/tile003-Photoroom.png'),
    require('@assets/images/pet/tile004-Photoroom.png'),
    require('@assets/images/pet/tile005-Photoroom.png'),
  ];

  // 런닝 시작 시 프레임 애니메이션 실행
  const AnimatedDog = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setFrame((prev) => (prev + 1) % runDogFrames.length);
      }, 100); // 100ms마다 프레임 변경
      return () => clearInterval(interval);
    }, []);

    return <Image source={runDogFrames[frame]} style={styles.running_pet} />;
  };
  // START 버튼 누른 후 카운트 다운
  const [countdown, setCountdown] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Mission
  const [missionApiItems, setMissionApiItems] = useState<MissionActiveItem[]>(
    []
  );
  const [showMissionModal, setShowMissionModal] = useState(false);
  const handleOpenMission = () => setShowMissionModal(true);
  const handleCloseMission = () => setShowMissionModal(false);

  // 사용자 요약정보 가져오기, 현재 임시 유저
  const { data, loading } = useMainData('u12345');
  // {러닝여부, 이동 경로, 맵 영역, 추적 시작/종료 핸들러}
  const { isTracking, path, region, startTracking, stopTracking } =
    useRouteTracking();

  const mapRef = useRef<MapView | null>(null);
  const [showBodyPrompt, setShowBodyPrompt] = useState(false);
  const [savingBodyHistory, setSavingBodyHistory] = useState(false);
  const [bodyGoals, setBodyGoals] = useState<BodyGoals>({});
  const parsedBodyHistoryUserId = Number(BODY_HISTORY_USER_ID);
  const bodyHistoryUserId = Number.isFinite(parsedBodyHistoryUserId)
    ? parsedBodyHistoryUserId
    : 1;
  useEffect(() => {
    if (!Number.isFinite(parsedBodyHistoryUserId)) {
      console.warn(
        '>>> [BodyHistory] BODY_HISTORY_USER_ID가 설정되지 않아 기본값 1을 사용합니다.'
      );
    }
  }, [parsedBodyHistoryUserId]);
  const bodyPromptDate = new Date();
  const bodyPromptBaseDate = formatDateKey(bodyPromptDate);
  const bodyPromptDateLabel = formatDateLabel(bodyPromptDate);

  useEffect(() => {
    // 로컬에 저장된 몸 목표값 불러오기 (프롬프트 진행률 계산용)
    loadBodyGoals(bodyHistoryUserId).then(setBodyGoals);
  }, [bodyHistoryUserId]);

  const checkTodayBodyHistory = useCallback(async () => {
    const todayKey = formatDateKey(new Date());
    try {
      const existing = await getBodyHistoryByDate(bodyHistoryUserId, todayKey);
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
  }, [bodyHistoryUserId]);

  // 미션 데이터 받아서 사용
  // 메인화면으로 오면 새로고침
  useFocusEffect(
    useCallback(() => {
      const fetchMissions = async () => {
        try {
          const data = await getMissionsActive();
          setMissionApiItems(data.missions);
        } catch (e) {
          console.error('미션 조회 실패', e);
        }
      };

      fetchMissions();
    }, [])
  );

  // porgressBar 가공
  const progressMissions = useMemo(() => {
    return missionApiItems
      .filter((m) => !m.isCompleted && m.periodType === 'DAILY')
      .map((m) => ({
        id: m.missionCheckId.toString(),
        title: m.title,
        current: m.progressValue,
        goal: m.goalValue,
        unit:
          m.category === 'STEP' ? '보' : m.category === 'MEAL' ? '회' : '장',
      }));
  }, [missionApiItems]);

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

  /* 펫 표정 관리 위해 FSM 상태 추가 */
  const { state: petState, transition: changePetState } = usePetFSM();

  /* 펫 터치 시 상태 전환 */
  const onPetTouch = () => {
    // 1.5초 동안 HAPPY 상태 유지 후 자동 IDLE
    changePetState(PetStates.HAPPY, { duration: 1500 });
  };

  /* 지도 카메라 이동
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

  /* 산책 시작/종료 핸들러
   * - isTracking이 true면 산책 중이므로 종료
   * - isTracking이 false면 산책 전이므로 시작
   */
  const handleToggleTracking = useCallback(() => {
    // 이미 추적 중이면 즉시 종료하고, 그렇지 않으면 권한 확인 후 추적을 시작한다.
    if (isTracking) {
      stopTracking();
      // 이곳에 서버에게 데이터 전송
      return;
    }
    setCountdown(3);
  }, [isTracking, stopTracking]);

  const markSkipToday = useCallback(async () => {
    const todayKey = formatDateKey(new Date());
    try {
      await AsyncStorage.setItem(BODY_PROMPT_SKIP_KEY, todayKey);
    } catch (err) {
      console.error('[BodyPrompt] 스킵 상태 저장 실패', err);
    }
  }, []);

  const handleSaveBodyPrompt = useCallback(
    async (values: BodyHistoryFormValues) => {
      setSavingBodyHistory(true);
      try {
        await createBodyHistory({
          userId: bodyHistoryUserId,
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
    [markSkipToday, bodyHistoryUserId]
  );

  const handleSkipBodyPromptToday = useCallback(async () => {
    await markSkipToday();
    setShowBodyPrompt(false);
  }, [markSkipToday]);

  const handleLaterBodyPrompt = useCallback(() => {
    setShowBodyPrompt(false);
  }, []);

  // 카운트 다운 애니메이션 적용
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      startTracking();
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
  }, [countdown, scaleAnim, opacityAnim, startTracking]);

  // Health Connect 오늘 걸음 수
  const {
    steps: healthSteps,
    addSteps,
    error: healthError,
    writing: healthWriting,
  } = useHealthSteps();
  const healthErrorShownRef = useRef(false);
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

  useEffect(() => {
    if (!healthError) {
      healthErrorShownRef.current = false;
      return;
    }
    if (healthErrorShownRef.current) return;
    healthErrorShownRef.current = true;
    Alert.alert('걸음 수 연동 실패', healthError);
  }, [healthError]);

  /* 로딩 상태
   * - 데이터 로딩 중이거나 실패로 인해 데이터가 없을 때 스피너 표시
   */
  if (loading) {
    return <ActivityIndicator size='large' />;
  }

  // 데이터가 아직 없다면 안전하게 스피너를 노출하고 미션 계산을 건너뛴다.
  if (!data) {
    return <ActivityIndicator size='large' />;
  }

  // const missions = getMissions(data, {
  //   // Health Connect를 우선 사용하고, 없으면 실시간 센서 값을 사용한다.
  //   stepOverride,
  // });

  // 표시할 걸음 수
  const displayedSteps = healthSteps ?? data.daily_walk.step ?? 0;
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
            <AnimatedDog />
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
          />
          {/* 현재는 FSM 상태 테스트를 위해 pressable 후에 미션 성공시로 변경 */}
          <Pressable onPress={onPetTouch} style={styles.pet}>
            <Image
              source={petImageByState[petState]}
              style={styles.petImage}
              fadeDuration={0}
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
          </View>
        </ImageBackground>
      )}
      {/* Start / End Button */}
      <TouchableOpacity
        style={styles.startButton}
        accessibilityRole='button'
        accessibilityLabel={isTracking ? '산책 종료' : '산책 시작'} // 스크린리더
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
