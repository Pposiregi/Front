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
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import styles from '@styles/MainPage.styles';
import { getMissions } from './missions';
import useStepCount from '@hooks/useStepCount';
import mainBackGround from '@assets/images/mainBackGround.png'; // MAIN 화면 배경
import run_dog from '@assets/images/pet/run_dog.png';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapOverlayPolyline } from '@components/MapOverlayPolyline';
import { useRouteTracking } from '@hooks/useRouteTracking';
import useHealthConnectSteps from '@hooks/useHealthConnectSteps';
import mainBackGround_day from '@assets/images/mainBackground_day.png';
import mainBackGround_night from '@assets/images/MainBackground_night.png';
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
    syncIntervalMs: 6_0000, // 60초 마다 동기화
  });
  // {러닝여부, 이동 경로, 맵 영역, 추적 시작/종료 핸들러}
  const { isTracking, path, region, startTracking, stopTracking } =
    useRouteTracking();

  const mapRef = useRef<MapView | null>(null);
  // const [mapLayout, setMapLayout] = useState<{
  //   width: number;
  //   height: number;
  // } | null>(null);

  /* 폴리라인 좌표 정제 및 GeoJSON 변환
   * - 유효한 경계값 내의 Path만 필터링
   */
  // const polylinePoints = useMemo(
  //   () =>
  //     path.filter(
  //       (point) =>
  //         Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
  //     ),
  //   [path]
  // );

  /* GeoJSON 변환
   * - polylinePoints가 2개 미만이면 null 반환
   */
  // const polylineGeoJSON = useMemo(() => {
  //   if (polylinePoints.length < 2) return null;
  //   return {
  //     type: 'FeatureCollection' as const,
  //     features: [
  //       {
  //         type: 'Feature' as const,
  //         properties: {},
  //         geometry: {
  //           type: 'LineString' as const,
  //           coordinates: polylinePoints.map((point) => [
  //             point.longitude,
  //             point.latitude,
  //           ]),
  //         },
  //       },
  //     ],
  //   };
  // }, [polylinePoints]);

  /* 펫 표정 관리 위해 FSM 상태 추가 */
  const { state: petState, transition: changePetState } = usePetFSM();

  /* 펫 터치 시 상태 전환 */
  const onPetTouch = () => {
    // 1.5초 동안 HAPPY 상태 유지 후 자동 IDLE
    changePetState(PetStates.HAPPY, { duration: 1500 });
  };

  // /* 디버그용 로그 - Ployline Point 추가 시 확인 */
  // useEffect(() => {
  //   if (__DEV__) {
  //     console.debug('[MainPage] polylinePoints', polylinePoints.length);
  //   }
  // }, [polylinePoints.length]);

  /* 디버그용 로그 - Polyline 및 GeoJSON 렌더링 정보 확인
   * - 개발 모드에서만 실행
   * - polylinePoints 또는 polylineGeoJSON이 변경될 때마다 실행
   */
  // useEffect(() => {
  //   if (!__DEV__) return;
  //   if (polylinePoints.length > 1) {
  //     const first = polylinePoints[0];
  //     const last = polylinePoints[polylinePoints.length - 1];
  //     console.debug('[MainPage] will render polyline', {
  //       count: polylinePoints.length,
  //       first,
  //       last,
  //     });
  //   }
  //   if (polylineGeoJSON) {
  //     console.debug('[MainPage] geojson ready', {
  //       features: polylineGeoJSON.features.length,
  //       coordinates: polylineGeoJSON.features[0]?.geometry.coordinates.length,
  //     });
  //   }
  // }, [polylinePoints, polylineGeoJSON]);

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
          {/* <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            region={region}
            showsUserLocation
            followsUserLocation
          >
            {/* 개발 시 시각 확인용 가이드 라인 */}
          {/* {__DEV__ && (
              <Polyline
                key='debug-sample'
                coordinates={[
                  {
                    latitude: region.latitude + 0.001,
                    longitude: region.longitude - 0.001,
                  },
                  { latitude: region.latitude, longitude: region.longitude },
                  {
                    latitude: region.latitude - 0.001,
                    longitude: region.longitude + 0.001,
                  },
                ]}
                strokeColor='rgba(0, 255, 0, 0.5)'
                strokeWidth={4}
                lineDashPattern={[6, 6]}
              />
            )} */}
          {/* {polylinePoints.length > 0 && (
              // 가장 최근 좌표를 커스텀 마커로 강조해 현재 위치를 명시한다.
              <Marker coordinate={polylinePoints[polylinePoints.length - 1]}>
                <View style={styles.currentPin}>
                  <View style={styles.currentPinInner} />
                </View>
              </Marker>
            )}
          </MapView> */}
          {/* {mapLayout && polylinePoints.length > 1 && (
            // react-native-svg를 이용한 화면 좌표 기반 오버레이 폴리라인
            <MapOverlayPolyline
              region={region}
              coordinates={polylinePoints}
              width={mapLayout.width}
              height={mapLayout.height}
            />
          )} */}
          {/* 내 위치로 이동 버튼 */}
          {/* <Pressable
            style={styles.locateButton}
            accessibilityRole='button'
            accessibilityLabel='현재 위치로 이동'
            onPress={() => {
              if (!mapRef.current) return;
              mapRef.current.animateToRegion?.(region, 500);
            }}
          >
            <Text style={styles.locateText}>내 위치</Text>
          </Pressable>  */}
          {/* <View style={styles.mapOverlay}>
            <Text style={styles.overlayText}>
              경로 추적 중 · {polylinePoints.length.toLocaleString()} 포인트
            </Text>
          </View> */}
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
    </View>
  );
};

export default MainPage;
