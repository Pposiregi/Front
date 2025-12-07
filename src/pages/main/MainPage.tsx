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
import useStepCount from '@hooks/useStepCount';
import mainBackGround from '@assets/images/mainBackGround.png'; // MAIN 화면 배경
import run_dog from '@assets/images/pet/run_dog.png';
import mainBackGround_day from '@assets/images/mainBackground_day.png';
import mainBackGround_day_wide from '@assets/images/mainBackground_day_wide.png';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapOverlayPolyline } from '@components/MapOverlayPolyline';
import { useRouteTracking } from '@hooks/useRouteTracking';
import useHealthConnectSteps from '@hooks/useHealthConnectSteps';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import type { BodyHistoryFormValues } from 'types/bodyHistory';
import { createBodyHistory } from '@api/bodyHistoryApi';

const BODY_PROMPT_SKIP_KEY = 'fitpet:bodyPrompt:skipDate';
const BODY_HISTORY_USER_ID = 3;
import { usePetFSM } from '@utils/petFSM';
import { PetStates } from '@utils/petState';
import { petImageByState } from '@utils/petImages';
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

  // 사용자 요약정보 가져오기, 현재 임시 유저
  const { data, loading } = useMainData('u12345');
  // 걸음 수, [센서 접근 가능 -> 실시간 걸음수] / [센서 접근 불가능  -> GPS]
  const { stepCount, isAvailable } = useStepCount();

  // 헬스 커넥트 걸음 수 동기화 훅
  const healthConnect = useHealthConnectSteps({
    enabled: !!data,
    userId: data?.user.user_id ?? null,
    syncIntervalMs: 5 * 60_000, // 5분마다 동기화
  });
  // {러닝여부, 이동 경로, 맵 영역, 추적 시작/종료 핸들러}
  const { isTracking, path, region, startTracking, stopTracking } =
    useRouteTracking();

  const mapRef = useRef<MapView | null>(null);
  const [mapLayout, setMapLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showBodyPrompt, setShowBodyPrompt] = useState(false);
  const [savingBodyHistory, setSavingBodyHistory] = useState(false);
  const bodyPromptDate = new Date();
  const bodyPromptBaseDate = formatDateKey(bodyPromptDate);
  const bodyPromptDateLabel = formatDateLabel(bodyPromptDate);

  useEffect(() => {
    const loadPromptState = async () => {
      const todayKey = formatDateKey(new Date());
      try {
        const skipDate = await AsyncStorage.getItem(BODY_PROMPT_SKIP_KEY);
        if (skipDate === todayKey) {
          setShowBodyPrompt(false);
          return;
        }
        setShowBodyPrompt(true);
      } catch (err) {
        console.error('[BodyPrompt] 상태 로딩 실패', err);
        setShowBodyPrompt(true);
      }
    };

    loadPromptState();
  }, []);

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
  const handleToggleTracking = useCallback(async () => {
    // 이미 추적 중이면 즉시 종료하고, 그렇지 않으면 권한 확인 후 추적을 시작한다.
    if (isTracking) {
      stopTracking();
      // 이곳에 서버에게 데이터 전송
      return;
    }
    setCountdown(3);
  }, [isTracking, startTracking, stopTracking]);

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
          userId: BODY_HISTORY_USER_ID,
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

  const handleSkipBodyPromptToday = useCallback(async () => {
    await markSkipToday();
    setShowBodyPrompt(false);
  }, [markSkipToday]);

  const handleLaterBodyPrompt = useCallback(() => {
    setShowBodyPrompt(false);
  }, []);

  const handleRequestHealthPermission = useCallback(async () => {
    const granted = await healthConnect.requestPermissions();
    if (granted) {
      Alert.alert('Health Connect', '걸음 수 연동 권한이 허용되었습니다.');
    } else {
      Alert.alert(
        'Health Connect',
        '권한을 허용하려면 Health Connect 앱에서 FitPet을 승인해주세요.'
      );
    }
  }, [healthConnect]);

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
  }, [countdown]);

  /* 로딩 상태
   * - 데이터 로딩 중이거나 실패로 인해 데이터가 없을 때 스피너 표시
   */
  if (loading || !data) {
    return <ActivityIndicator size='large' />;
  }

  // 표시할 걸음 수
  const stepOverride =
    typeof healthConnect.steps === 'number'
      ? healthConnect.steps
      : isAvailable
      ? stepCount
      : undefined;

  const missions = getMissions(data, {
    // Health Connect를 우선 사용하고, 없으면 실시간 센서 값을 사용한다.
    stepOverride,
  });

  // 표시할 걸음 수
  const displayedSteps = stepOverride ?? data?.daily_walk.step ?? 0;
  return (
    <View style={styles.container}>
      {!healthConnect.permissionsGranted ? (
        <View style={styles.healthConnectBanner}>
          <Text style={styles.healthConnectBannerText}>
            Health Connect 권한이 필요합니다. 권한을 허용하면 걸음 수가 자동으로
            동기화돼요.
          </Text>
          <TouchableOpacity
            style={styles.healthConnectBannerButton}
            onPress={handleRequestHealthPermission}
          >
            <Text style={styles.healthConnectBannerButtonLabel}>권한 요청</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
          주간/일일 미션을 수평 스크롤 카드 형태로 표시
        */}
        <FlatList
          data={missions}
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
      </View>
      {isTracking ? (
        <View
          style={styles.mapContainer}
          onLayout={({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            // setMapLayout({ width, height });
          }}
        >
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
          {/* 현재는 FSM 상태 테스트를 위해 pressable 후에 미션 성공시로 변경 */}
          <Pressable onPress={onPetTouch} style={styles.pet}>
            <Image
              source={petImageByState[petState]}
              style={styles.petImage}
              fadeDuration={0}
            />
          </Pressable>
          {/* 실시간 센서가 없으면 서버 데이터로 대체하되 안내문 출력. */}
          <Text style={styles.message}>
            {`${displayedSteps.toLocaleString()}보 걸었어요!`}
          </Text>
          {!isAvailable && (
            <Text style={styles.stepFallback}>
              디바이스 걸음 센서를 찾을 수 없어 서버 데이터를 표시해요.
            </Text>
          )}
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
      {/* 헬스 커넥트 디버그용 걸음수 삽입 버튼 */}
      {__DEV__ && healthConnect.debugInsertSteps && (
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 12,
            borderRadius: 8,
            rowGap: 8,
          }}
        >
          <Text style={{ color: '#fff', marginBottom: 4 }}>HC Debug</Text>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#4CAF50', borderRadius: 4 }}
            onPress={() => healthConnect.debugInsertSteps?.(100)}
          >
            <Text style={{ color: '#fff' }}>+100 steps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: '#2196F3', borderRadius: 4 }}
            onPress={() => healthConnect.debugInsertSteps?.(1000)}
          >
            <Text style={{ color: '#fff' }}>+1000 steps</Text>
          </TouchableOpacity>
        </View>
      )}

      <BodyRecordPrompt
        visible={showBodyPrompt}
        dateLabel={bodyPromptDateLabel}
        baseDate={bodyPromptBaseDate}
        onSave={handleSaveBodyPrompt}
        onLater={handleLaterBodyPrompt}
        onSkipToday={handleSkipBodyPromptToday}
        saving={savingBodyHistory}
      />
    </View>
  );
};

export default MainPage;
