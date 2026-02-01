import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapOverlayPolyline from '@components/MapOverlayPolyline';
import { ActivityDetailRouteProp, GPS_LOG, SessionDetail } from './types';
import { styles } from '@styles/ActivityDetail.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import { getSessionDetail } from '@api/activityApi';
import { mock_gps_log, mockSessionMetadata } from './mock';
import useActivityDetailMap from '@hooks/useActivityDetailMap';

const MAP_HEIGHT = SCREEN_HEIGHT * 0.36;
const MAP_WIDTH = SCREEN_WIDTH - 40;

const E7_SCALE = 1e7; // GPS에 대해, 소수점 좌표 대신 E7정수 포맷
const NEAR_ZERO_THRESHOLD = 0.0001; // GPS, API 실패 시 좌표 무효처리를 위함

/**
 * 유효한 숫자 타입 반환
 */
const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeLatLon = (
  latitude: number,
  longitude: number
): { latitude: number; longitude: number } | null => {
  let lat = latitude;
  let lon = longitude;

  // 위/경도가 E7 정수로 들어오는 경우 보정
  if (Math.abs(lat) > 90 && Math.abs(lat) <= 900000000) {
    lat = lat / E7_SCALE;
  }
  if (Math.abs(lon) > 180 && Math.abs(lon) <= 1800000000) {
    lon = lon / E7_SCALE;
  }

  // 위/경도가 뒤집힌 케이스 보정 (lat가 90 초과이고 lon이 90 이하일 때, 휴리스틱)
  if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
    const swappedLat = lon;
    const swappedLon = lat;
    lat = swappedLat;
    lon = swappedLon;
  }

  // 최종 유효성 검사
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return null;
  }

  // (0,0) 근처 좌표는 실패/기본값인 경우가 많아 제외
  if (
    Math.abs(lat) < NEAR_ZERO_THRESHOLD &&
    Math.abs(lon) < NEAR_ZERO_THRESHOLD
  ) {
    return null;
  }

  return { latitude: lat, longitude: lon };
};

/**
 * 경로 좌표의 형식/단위 정규화
 * - 값이 문자열일 경우 숫자로 변환
 * - 위/경도가 뒤집혔을 경우 보정
 * - (0,0) 근처나 범위밖 좌표 제거
 * - altitude 없을 경우 기본값 0 적용
 * @param logs
 * @returns
 */
const normalizeRouteLogs = (logs: unknown[]): GPS_LOG[] => {
  const normalized: GPS_LOG[] = [];

  logs.forEach((item) => {
    if (Array.isArray(item) && item.length >= 2) {
      // [lng, lat] 형태까지 감안
      const lon = toFiniteNumber(item[0]);
      const lat = toFiniteNumber(item[1]);
      if (lat !== null && lon !== null) {
        const coord = normalizeLatLon(lat, lon);
        if (coord) normalized.push({ ...coord, altitude: 0 });
      }
      return;
    }

    if (!item || typeof item !== 'object') return;

    const maybe = item as Record<string, unknown>;
    const lat =
      toFiniteNumber(maybe.latitude) ??
      toFiniteNumber(maybe.lat) ??
      toFiniteNumber(maybe.latitudeE7) ??
      toFiniteNumber(maybe.latE7) ??
      null;
    const lon =
      toFiniteNumber(maybe.longitude) ??
      toFiniteNumber(maybe.lng) ??
      toFiniteNumber(maybe.lon) ??
      toFiniteNumber(maybe.longitudeE7) ??
      toFiniteNumber(maybe.lngE7) ??
      null;
    const altitude = toFiniteNumber(maybe.altitude) ?? 0;

    if (lat === null || lon === null) return;

    const coord = normalizeLatLon(lat, lon);
    if (coord) normalized.push({ ...coord, altitude });
  });

  return normalized;
};

// 목업 데이터 (API 실패 시 fallback)
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
    }, 300);
  });
};

const ActivityDetailPage = () => {
  const route = useRoute<ActivityDetailRouteProp>();
  const { sessionId } = route.params;
  const [detailData, setDetailData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const routeLogs = detailData?.routeLogs ?? [];
  const { mapRef, mapRegion, mapKey, onMapReady, onMapLayout } =
    useActivityDetailMap(routeLogs, sessionId);

  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) return;
      setLoading(true);
      try {
        const data = await getSessionDetail(sessionId);
        const normalizedRouteLogs = normalizeRouteLogs(data.routeLogs);

        console.log(
          '>>> [ActivityDetail] routeLogs 정규화',
          JSON.stringify(
            {
              sessionId,
              originalCount: data.routeLogs?.length ?? 0,
              normalizedCount: normalizedRouteLogs.length,
              first: normalizedRouteLogs[0],
              rawFirst: data.routeLogs?.[0],
            },
            null,
            0
          )
        );
        if (
          (data.routeLogs?.length ?? 0) > 0 &&
          normalizedRouteLogs.length === 0
        ) {
          console.warn(
            '>>> [ActivityDetail] routeLogs 정규화 결과가 0개입니다. rawFirst를 확인하세요.'
          );
        }

        setDetailData({
          ...data,
          routeLogs: normalizedRouteLogs,
        });
      } catch (error) {
        console.error('>>> [ActivityDetail] 상세 데이터 로드 실패:', error);
        if (__DEV__) {
          console.warn(
            '>>> [ActivityDetail] API 실패로 목업 데이터를 사용합니다.'
          );
          try {
            const fallbackData = await fetchSessionDetail(sessionId);
            const normalizedRouteLogs = normalizeRouteLogs(
              fallbackData.routeLogs
            );
            setDetailData({
              ...fallbackData,
              routeLogs: normalizedRouteLogs,
            });
          } catch (fallbackError) {
            console.error(
              '>>> [ActivityDetail] 목업 데이터 로드 실패:',
              fallbackError
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sessionId]);

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
        <Text style={styles.emptyText}>데이터를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 총 달린 시간 계산 (항상 HH:MM:SS)
  const startDate = new Date(detailData.startTime);
  const endDate = new Date(detailData.endTime);
  const durationMs = Math.max(0, endDate.getTime() - startDate.getTime());
  const totalSeconds = Math.floor(durationMs / 1000);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedDuration = `${String(totalHours).padStart(2, '0')}:${String(
    totalMinutes
  ).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  const chipStepOrCalorie =
    detailData.stepCount > 0
      ? `${detailData.stepCount.toLocaleString()} 걸음`
      : `${detailData.burnCalories.toLocaleString()} kcal`;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.mapFrame}>
          <MapView
            key={mapKey}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            pointerEvents='none'
            // overlay blocker + 비활성화 옵션으로 제스처 차단
            scrollEnabled={false} // 드래그 이동 비활성화
            zoomEnabled={false} // 핀치 줌 비활성화
            zoomTapEnabled={false} // 더블탭 줌 비활성화
            scrollDuringRotateOrZoomEnabled={false}
            rotateEnabled={false} // 회전 비활성화
            pitchEnabled={false} // 3D 뷰(기울이기) 비활성화
            toolbarEnabled={false}
            moveOnMarkerPress={false}
            onMapReady={onMapReady}
            onLayout={onMapLayout}
            initialRegion={mapRegion}
          />
          <MapOverlayPolyline
            region={mapRegion}
            coordinates={routeLogs}
            height={MAP_HEIGHT}
            width={MAP_WIDTH}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {detailData.totalDistance.toFixed(2)} km
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{formattedDuration}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{chipStepOrCalorie}</Text>
            </View>
          </View>
          <View
            style={styles.mapBlocker}
            pointerEvents='auto'
            // 투명 레이어가 터치를 가로채 지도 상호작용을 완전히 막는다.
            onStartShouldSetResponder={() => true}
          />
        </View>
        <Text style={styles.sectionTitle}>러닝 요약</Text>
        <View style={styles.specCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>총 거리</Text>
            <Text style={styles.specValue}>
              {detailData.totalDistance.toFixed(2)} km
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>총 시간</Text>
            <Text style={styles.specValue}>{formattedDuration}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>평균 속도</Text>
            <Text style={styles.specValue}>
              {detailData.avgSpeedKmh.toFixed(2)} km/h
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>걸음수</Text>
            <Text style={styles.specValue}>
              {detailData.stepCount.toLocaleString()} 걸음
            </Text>
          </View>
          <View style={[styles.specRow, styles.specRowLast]}>
            <Text style={styles.specLabel}>소모 칼로리</Text>
            <Text style={styles.specValue}>
              {detailData.burnCalories.toLocaleString()} kcal
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityDetailPage;
