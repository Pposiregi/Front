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
  Platform,
  Pressable,
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import styles from '@styles/MainPage.styles';
import { getMissions } from './missions';
import useStepCount from '@hooks/useStepCount';
import TokkiImage from '@assets/images/main_temp_tokki.png'; // 토끼 배경 이미지
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouteTracking } from '@hooks/useRouteTracking';
import { MapOverlayPolyline } from '@components/MapOverlayPolyline';
import useHealthConnectSteps from '@hooks/useHealthConnectSteps';
/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainPage = () => {
  // 사용자 요약정보 가져오기, 현재 임시 유저
  const { data, loading } = useMainData('u12345');
  // 걸음 수, [센서 접근 가능 -> 실시간 걸음수] / [센서 접근 불가능  -> GPS]
  const { stepCount, isAvailable } = useStepCount();

  // 헬스 커넥트 걸음 수 동기화 훅
  const healthConnect = useHealthConnectSteps({
    enabled: !!data,
    userId: data?.user.user_id ?? null,
    syncIntervalMs: 10_000,
  });
  // {러닝여부, 이동 경로, 맵 영역, 추적 시작/종료 핸들러}
  const { isTracking, path, region, startTracking, stopTracking } =
    useRouteTracking();

  const mapRef = useRef<MapView | null>(null);
  const [mapLayout, setMapLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  /* 폴리라인 좌표 정제 및 GeoJSON 변환
   * - 유효한 경계값 내의 Path만 필터링
   */
  const polylinePoints = useMemo(
    () =>
      path.filter(
        (point) =>
          Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
      ),
    [path]
  );

  /* GeoJSON 변환
   * - polylinePoints가 2개 미만이면 null 반환
   */
  const polylineGeoJSON = useMemo(() => {
    if (polylinePoints.length < 2) return null;
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: polylinePoints.map((point) => [
              point.longitude,
              point.latitude,
            ]),
          },
        },
      ],
    };
  }, [polylinePoints]);

  /* 디버그용 로그 - Ployline Point 추가 시 확인 */
  useEffect(() => {
    if (__DEV__) {
      console.debug('[MainPage] polylinePoints', polylinePoints.length);
    }
  }, [polylinePoints.length]);

  /* 디버그용 로그 - Polyline 및 GeoJSON 렌더링 정보 확인
   * - 개발 모드에서만 실행
   * - polylinePoints 또는 polylineGeoJSON이 변경될 때마다 실행
   */
  useEffect(() => {
    if (!__DEV__) return;
    if (polylinePoints.length > 1) {
      const first = polylinePoints[0];
      const last = polylinePoints[polylinePoints.length - 1];
      console.debug('[MainPage] will render polyline', {
        count: polylinePoints.length,
        first,
        last,
      });
    }
    if (polylineGeoJSON) {
      console.debug('[MainPage] geojson ready', {
        features: polylineGeoJSON.features.length,
        coordinates: polylineGeoJSON.features[0]?.geometry.coordinates.length,
      });
    }
  }, [polylinePoints, polylineGeoJSON]);

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
      return;
    }

    await startTracking();
  }, [isTracking, startTracking, stopTracking]);

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
  const displayedSteps =
    typeof healthConnect.steps === 'number'
      ? healthConnect.steps
      : isAvailable
      ? stepCount
      : data?.daily_walk.step ?? 0;

  return (
    <View style={styles.container}>
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
            setMapLayout({ width, height });
          }}
        >
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            region={region}
            showsUserLocation
            followsUserLocation
          >
            {/* 개발 시 시각 확인용 가이드 라인 */}
            {__DEV__ && (
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
            )}
            {polylinePoints.length > 0 && (
              // 가장 최근 좌표를 커스텀 마커로 강조해 현재 위치를 명시한다.
              <Marker coordinate={polylinePoints[polylinePoints.length - 1]}>
                <View style={styles.currentPin}>
                  <View style={styles.currentPinInner} />
                </View>
              </Marker>
            )}
          </MapView>
          {mapLayout && polylinePoints.length > 1 && (
            // react-native-svg를 이용한 화면 좌표 기반 오버레이 폴리라인
            <MapOverlayPolyline
              region={region}
              coordinates={polylinePoints}
              width={mapLayout.width}
              height={mapLayout.height}
            />
          )}
          {/* 내 위치로 이동 버튼 */}
          <Pressable
            style={styles.locateButton}
            accessibilityRole='button'
            accessibilityLabel='현재 위치로 이동'
            onPress={() => {
              if (!mapRef.current) return;
              mapRef.current.animateToRegion?.(region, 500);
            }}
          >
            <Text style={styles.locateText}>내 위치</Text>
          </Pressable>
          <View style={styles.mapOverlay}>
            <Text style={styles.overlayText}>
              경로 추적 중 · {polylinePoints.length.toLocaleString()} 포인트
            </Text>
          </View>
        </View>
      ) : (
        // 토끼 배경 이미지와 함께 메시지 표시
        <ImageBackground
          source={TokkiImage}
          style={styles.tokkiBackground}
          resizeMode='cover'
        >
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
