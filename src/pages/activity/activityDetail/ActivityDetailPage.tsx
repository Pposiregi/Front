import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapOverlayPolyline from '@components/MapOverlayPolyline';
import { ActivityDetailRouteProp, GPS_LOG, SessionDetail } from './types';
import { styles } from '@styles/ActivityDetail.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import { getSessionDetail } from '@api/activityApi';
import { mock_gps_log, mockSessionMetadata } from './mock';

const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const E7_SCALE = 1e7;
const MAP_EDGE_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const NEAR_ZERO_THRESHOLD = 0.0001;
const MIN_REGION_DELTA = 0.01;
const FIT_SPAN_EPSILON = 0.00001;

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

  // 위/경도가 뒤집힌 케이스 보정 (lat가 90 초과이고 lon이 90 이하일 때)
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

// 받은 경로 중 센터 찾기
const getCenterRegion = (
  coordinates: { latitude: number; longitude: number }[]
) => {
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const latitude = (Math.min(...lats) + Math.max(...lats)) / 2;
  const longitude = (Math.min(...lons) + Math.max(...lons)) / 2;
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lonSpan = Math.max(...lons) - Math.min(...lons);
  const latitudeDelta = Math.max(latSpan + 0.002, MIN_REGION_DELTA);
  const longitudeDelta = Math.max(lonSpan + 0.002, MIN_REGION_DELTA);
  return { latitude, longitude, latitudeDelta, longitudeDelta };
};

const hasMeaningfulSpan = (coordinates: GPS_LOG[]) => {
  if (coordinates.length < 2) return false;
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lonSpan = Math.max(...lons) - Math.min(...lons);
  return latSpan > FIT_SPAN_EPSILON || lonSpan > FIT_SPAN_EPSILON;
};

const ActivityDetailPage = () => {
  const route = useRoute<ActivityDetailRouteProp>();
  const { sessionId } = route.params;
  const [detailData, setDetailData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const mapRef = useRef<MapView | null>(null);
  const centerRegion = useMemo(() => {
    if (!detailData || detailData.routeLogs.length === 0) return null;
    return getCenterRegion(detailData.routeLogs);
  }, [detailData]);
  const mapKey = `${mapRegion.latitude},${mapRegion.longitude},${mapRegion.latitudeDelta},${mapRegion.longitudeDelta}`;

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

  // 지도 준비 완료 이후 centerRegion이 바뀌면 해당 좌표로 이동
  useEffect(() => {
    if (!centerRegion) return;

    console.log(
      '>>> [ActivityDetail] centerRegion 계산',
      JSON.stringify(
        {
          sessionId,
          centerRegion,
          routeCount: detailData?.routeLogs.length ?? 0,
        },
        null,
        0
      )
    );
    setMapRegion(centerRegion);
  }, [centerRegion, detailData?.routeLogs.length, sessionId]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!centerRegion) return;

    const routeLogs = detailData?.routeLogs ?? [];
    const canFitToCoordinates = hasMeaningfulSpan(routeLogs);

    console.log(
      '>>> [ActivityDetail] map move',
      JSON.stringify(
        {
          sessionId,
          mapReady,
          centerRegion,
          routeCount: routeLogs.length,
          canFitToCoordinates,
        },
        null,
        0
      )
    );

    // 가능한 경우 경로 전체가 보이도록 맞춘다.
    if (routeLogs.length >= 2 && canFitToCoordinates) {
      mapRef.current.fitToCoordinates(routeLogs, {
        edgePadding: MAP_EDGE_PADDING,
        animated: true,
      });
      return;
    }

    // 단일 좌표이거나 모든 좌표가 동일한 경우에는 센터로 이동
    mapRef.current.animateToRegion(centerRegion, 250);
  }, [centerRegion, detailData?.routeLogs, mapReady, mapRegion, sessionId]);

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.mapPlaceholder}>활동 경로 기록</Text>
        <View style={styles.rowContainer}>
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
            onMapReady={() => {
              console.log('>>> [ActivityDetail] onMapReady', {
                sessionId,
                mapRegion,
              });
              setMapReady(true);
            }}
            onLayout={() => {
              // 일부 환경에서 onMapReady가 늦거나 누락되는 경우 대비
              setMapReady(true);
            }}
            initialRegion={mapRegion}
          />
          <MapOverlayPolyline
            region={mapRegion}
            coordinates={detailData.routeLogs}
            height={SCREEN_HEIGHT * 0.4}
            width={SCREEN_WIDTH * 0.8}
          />
          <View
            style={styles.mapBlocker}
            pointerEvents='auto'
            // 투명 레이어가 터치를 가로채 지도 상호작용을 완전히 막는다.
            onStartShouldSetResponder={() => true}
          />
        </View>
        <Text style={styles.header}>활동 상세 정보</Text>
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
