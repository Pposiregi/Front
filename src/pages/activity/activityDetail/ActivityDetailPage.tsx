import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapOverlayPolyline from '@components/MapOverlayPolyline';
import { ActivityDetailRouteProp, SessionDetail } from './types';
import { styles } from '@styles/ActivityDetail.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import { mock_gps_log, mockSessionMetadata } from './mock';

// 목업 데이터
const fetchSessionDetail = (id: string): Promise<SessionDetail> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const logs = mock_gps_log[id];
      const metadata = mockSessionMetadata[id];
      if (logs && metadata) {
        resolve({
          ...metadata,
          routeLogs: logs,
        });
      } else {
        reject(new Error(`데이터를 찾지 못했습니다.`));
      }
    }, 1000);
  });
};

// 받은 경로 중 센터 찾기
const getCenterRegion = (
  coordinates: { latitude: number; longitude: number }[]
) => {
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const latitude = (Math.min(...lats) + Math.max(...lats)) / 2;
  const longitude = (Math.min(...lons) + Math.max(...lons)) / 2;
  const latitudeDelta = Math.max(...lats) - Math.min(...lats) + 0.002;
  const longitudeDelta = Math.max(...lons) - Math.min(...lons) + 0.002;
  return { latitude, longitude, latitudeDelta, longitudeDelta };
};

const ActivityDetailPage = () => {
  const route = useRoute<ActivityDetailRouteProp>();
  const { sessionId } = route.params;
  const [detailData, setDetailData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);
  const centerRegion = useMemo(() => {
    if (!detailData || detailData.routeLogs.length === 0) return null;

    console.log(
      '>>> GET CENTER REGION',
      sessionId,
      detailData,
      centerRegion?.latitude
    );

    return getCenterRegion(detailData.routeLogs);
  });

  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        //기존 목업 데이터
        const data = await fetchSessionDetail(sessionId);
        //const data = await getSessionDetail(sessionId);
        setDetailData(data);
      } catch (error) {
        console.error('상세 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sessionId]);

  // 로딩과 CENTER_REGION 값이 정해지면 지도를 이동
  useEffect(() => {
    if (!centerRegion || !mapRef.current) return;
    const timer = setTimeout(() => {
      mapRef.current?.animateToRegion(centerRegion, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [centerRegion]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#007aff' />
        <Text style={styles.loadingText}>활동 기록을 불러오는 중...</Text>
      </View>
    );
  }

  if (!detailData) {
    return (
      <View style={styles.centerContainer}>
        <Text>데이터를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 총 달린 시간 계산
  const startDate = new Date(detailData.startTime);
  const endDate = new Date(detailData.endTime);
  const durationMs = endDate.getTime() - startDate.getTime();
  const totalHours = Math.floor(durationMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const totalSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  let formattedDuration;

  if (totalHours > 0) {
    // 1시간 이상일 경우: H:M:S 형식
    formattedDuration = `${String(totalHours).padStart(2, '0')}:${String(
      totalMinutes
    ).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
  } else {
    // 1시간 미만일 경우 (totalHours가 0일 때): M:S 형식
    formattedDuration = `${String(totalMinutes).padStart(2, '0')}:${String(
      totalSeconds
    ).padStart(2, '0')}`;
  }

  // 중앙 값
  const mapRegion = centerRegion ?? {
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.mapPlaceholder}>활동 경로 기록</Text>
        <View style={styles.rowContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            scrollEnabled={false} // 드래그 이동 비활성화
            zoomEnabled={false} // 핀치 줌 비활성화
            rotateEnabled={false} // 회전 비활성화
            pitchEnabled={false} // 3D 뷰(기울이기) 비활성화
            region={mapRegion}
          />
          <MapOverlayPolyline
            region={mapRegion}
            coordinates={detailData.routeLogs}
            height={SCREEN_HEIGHT * 0.4}
            width={SCREEN_WIDTH * 0.8}
          />
        </View>
        <Text style={styles.header}>활동 상세 기록</Text>
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>총 거리 :</Text>
          <Text style={styles.dataValue}>
            {detailData.totalDistance.toFixed(2)} km
          </Text>
        </View>
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>시간 :</Text>
          <Text style={styles.dataValue}>{formattedDuration}</Text>
        </View>
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>페이스 :</Text>
          <Text style={styles.dataValue}>
            {detailData.avgSpeedKmh.toFixed(2)} km/h
          </Text>
        </View>
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>걸음수 :</Text>
          <Text style={styles.dataValue}>
            {detailData.stepCount.toLocaleString()} 걸음
          </Text>
        </View>
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>칼로리 :</Text>
          <Text style={styles.dataValue}>
            {detailData.burnCalories.toLocaleString()} 칼로리
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityDetailPage;
