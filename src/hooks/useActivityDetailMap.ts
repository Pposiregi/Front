import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import type { GPS_LOG } from '@pages/activity/activityDetail/types';
import type { MapRegion } from '@shared/types/location';
import { SCREEN_WIDTH } from '@styles/dimensions';

/**
 * 초기 좌표: 서울
 * Delta:지도의 줌/범위
 *  - 작을 경우: 확대
 *  - 클 경우: 축소
 */
const DEFAULT_REGION: MapRegion = {
  latitude: 37.413294,
  longitude: 127.0016985,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

/**
 * 안드로이드 SCREEN 비율을 통한 MAP 간격 조정
 */
const EDGE_BASE = Math.max(12, Math.round(SCREEN_WIDTH * 0.06));
const MAP_EDGE_PADDING = {
  top: EDGE_BASE,
  right: EDGE_BASE,
  bottom: EDGE_BASE,
  left: EDGE_BASE,
};
const MIN_REGION_DELTA = 0.01;
const FIT_SPAN_EPSILON = 0.00001;

/**
 * RUNNING 좌표들의 중심점과 적절한 줌 범위 계산
 * - 좌표들의 최소/최대 위경도를 기준으로 중심을 잡는다.
 * - 화면에 여유를 주기 위해 delta에 최소값과 패딩을 더한다.
 */
const getCenterRegion = (coordinates: GPS_LOG[]) => {
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

/**
 * 좌표들이 "같은 점"에 가깝지 않은지 판별한다.
 * - 위/경도 범위가 너무 작으면 fitToCoordinates가 무의미해진다.
 */
const hasMeaningfulSpan = (coordinates: GPS_LOG[]) => {
  if (coordinates.length < 2) return false;
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lonSpan = Math.max(...lons) - Math.min(...lons);
  return latSpan > FIT_SPAN_EPSILON || lonSpan > FIT_SPAN_EPSILON;
};

export const useActivityDetailMap = (
  routeLogs: GPS_LOG[],
  sessionId?: string
) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapRegion, setMapRegion] = useState<MapRegion>(DEFAULT_REGION);
  const mapRef = useRef<MapView | null>(null);
  const mapReadyFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * 경로 좌표가 있을 때만 지도 중심/줌을 계산한다.
   * - 좌표가 없으면 null로 두고 지도 이동을 건너뛴다.
   */
  const centerRegion = useMemo(() => {
    if (!routeLogs || routeLogs.length === 0) return null;
    return getCenterRegion(routeLogs);
  }, [routeLogs]);

  /**
   * Region 변경 시 MapView를 강제 리렌더링하기 위한 키.
   * - 일부 환경에서 region 변경만으로 카메라가 갱신되지 않는 경우를 대비한다.
   */
  const mapKey = `${mapRegion.latitude},${mapRegion.longitude},${mapRegion.latitudeDelta},${mapRegion.longitudeDelta}`;

  /**
   * MapView가 준비되었음을 알리는 콜백.
   * - onMapReady가 호출되면 fallback 타이머를 정리하고 mapReady를 true로 만든다.
   */
  const onMapReady = useCallback(() => {
    if (__DEV__) {
      console.log('>>> [ActivityDetail] onMapReady', {
        sessionId,
        mapRegion,
      });
    }
    if (mapReadyFallbackRef.current) {
      clearTimeout(mapReadyFallbackRef.current);
      mapReadyFallbackRef.current = null;
    }
    setMapReady(true);
  }, [mapRegion, sessionId]);

  /**
   * 레이아웃 완료 시 fallback 타이머를 거는 콜백.
   * - onMapReady가 오지 않는 환경을 대비해 5초 뒤 mapReady를 true로 만든다.
   */
  const onMapLayout = useCallback(() => {
    // 일부 환경에서 onMapReady가 늦거나 누락되는 경우 대비
    if (mapReadyFallbackRef.current || mapReady) return;
    mapReadyFallbackRef.current = setTimeout(() => {
      setMapReady((prev) => prev || true);
      mapReadyFallbackRef.current = null;
    }, 5000);
  }, [mapReady]);

  /**
   * centerRegion이 변경되면 mapRegion을 갱신한다.
   * - 이 값은 MapView initialRegion과 mapKey에 사용된다.
   */
  useEffect(() => {
    if (!centerRegion) {
      setMapRegion(DEFAULT_REGION);
      return;
    }

    if (__DEV__) {
      console.log(
        '>>> [ActivityDetail] centerRegion 계산',
        JSON.stringify(
          {
            sessionId,
            centerRegion,
            routeCount: routeLogs.length,
          },
          null,
          0
        )
      );
    }
    setMapRegion(centerRegion);
  }, [centerRegion, routeLogs.length, sessionId]);

  /**
   * mapReady + centerRegion이 준비되면 카메라 이동
   * - 경로가 충분히 길면 fitToCoordinates로 전체 경로가 보이게 한다.
   * - 그렇지 않으면 중심 좌표로 animateToRegion 한다.
   */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!centerRegion) return;

    const canFitToCoordinates = hasMeaningfulSpan(routeLogs);

    if (__DEV__) {
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
    }

    if (routeLogs.length >= 2 && canFitToCoordinates) {
      mapRef.current.fitToCoordinates(routeLogs, {
        edgePadding: MAP_EDGE_PADDING,
        animated: true,
      });
      return;
    }

    mapRef.current.animateToRegion(centerRegion, 250);
  }, [centerRegion, mapReady, routeLogs, sessionId]);

  /**
   * 언마운트 시 fallback 타이머 정리.
   */
  useEffect(() => {
    return () => {
      if (mapReadyFallbackRef.current) {
        clearTimeout(mapReadyFallbackRef.current);
        mapReadyFallbackRef.current = null;
      }
    };
  }, []);

  return {
    mapRef,
    mapRegion,
    mapKey,
    onMapReady,
    onMapLayout,
  };
};

export default useActivityDetailMap;
