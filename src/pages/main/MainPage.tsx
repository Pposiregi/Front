import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import styles from '@styles/MainPage.styles';
import { getMissions } from './missions';
import useStepCount from '@hooks/useStepCount';
import TokkiImage from '@assets/images/main_temp_tokki.png'; // 토끼 배경 이미지
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouteTracking } from '@hooks/useRouteTracking';
/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainPage = () => {
  // 사용자 메인 데이터를 가져오는 척~ 커스텀 혹
  const { data, loading } = useMainData('u12345');
  const { stepCount, isAvailable } = useStepCount(); //
  const { isTracking, path, region, startTracking, stopTracking } =
    useRouteTracking();

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!isTracking) return;
    if (path.length === 0) return;
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

  const handleToggleTracking = useCallback(async () => {
    if (isTracking) {
      stopTracking();
      return;
    }

    await startTracking();
  }, [isTracking, startTracking, stopTracking]);

  // 위치 변화를 구독하여 좌표를 얻음
  // 데이터 로딩 중이거나 실패로 인해 데이터가 없을 때 스피너 표시
  if (loading || !data) {
    return <ActivityIndicator size='large' />;
  }

  // 미션 가져오는 척
  const missions = getMissions(data, {
    stepOverride: isAvailable ? stepCount : undefined,
  });

  const displayedSteps = isAvailable ? stepCount : data?.daily_walk.step ?? 0;

  return (
    <View style={styles.container}>
      {/*
        미션 진행 상황을 가로 스크롤로 표시 
      */}
      <View style={styles.progressContainer}>
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
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            showsUserLocation
            followsUserLocation
          >
            {path.length > 1 && (
              <Polyline
                coordinates={path}
                strokeColor='#7450FF'
                strokeWidth={4}
              />
            )}
          </MapView>
          <View style={styles.mapOverlay}>
            <Text style={styles.overlayText}>
              경로 추적 중 · {path.length.toLocaleString()} 포인트
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
        accessibilityLabel={isTracking ? '산책 종료' : '산책 시작'}
        onPress={handleToggleTracking}
      >
        <Text style={styles.startText}>{isTracking ? 'END' : 'START'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainPage;
