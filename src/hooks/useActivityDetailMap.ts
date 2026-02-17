import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import type { GPS_LOG } from '@pages/activity/activityDetail/types';
import type { MapRegion } from '@shared/types/location';
import { SCREEN_WIDTH } from '@styles/dimensions';

/**
 * 경로가 없거나 파싱 실패 시 보여줄 기본 지도 영역.
 * - 서울 좌표를 중심으로 시작하며, 너무 넓지도 좁지도 않은 delta를 사용한다.
 */
const DEFAULT_REGION: MapRegion = {
  latitude: 37.413294,
  longitude: 127.0016985,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

/**
 * fitToCoordinates에서 사용하는 edge padding.
 * - 화면 폭 기반으로 비율 계산하여 기기 크기에 따라 여백이 과도하게 달라지지 않게 한다.
 */
const EDGE_BASE = Math.max(12, Math.round(SCREEN_WIDTH * 0.06));
const MAP_EDGE_PADDING = {
  top: EDGE_BASE,
  right: EDGE_BASE,
  bottom: EDGE_BASE,
  left: EDGE_BASE,
};

/**
 * 지도 이동 파라미터 상수들.
 * - MIN_REGION_DELTA: span이 너무 작은 데이터에서 과도한 줌인을 방지하기 위한 최소 delta.
 * - FIT_SPAN_EPSILON: 좌표 span이 사실상 0인지 판단하기 위한 임계값.
 * - SINGLE_POINT_DELTA: 단일 지점/거의 같은 지점 경로에서 보여줄 목표 줌 레벨.
 */
const MIN_REGION_DELTA = 0.01;
const FIT_SPAN_EPSILON = 0.00001;
const SINGLE_POINT_DELTA = 0.0045;

/**
 * 지도 준비/이동 타이밍 상수.
 * - onMapReady 누락 대비 fallback, 초기 지연, 이동 재시도 주기, 안전 종료 타임아웃을 관리한다.
 */
const MAP_READY_FALLBACK_MS = 1200;
const MAP_RELOCATE_DELAY_MS = 1500;
const MAP_RETRY_INTERVAL_MS = 300;
const MAP_MAX_RETRY_COUNT = 6;
const MAP_RELOCATE_END_DELAY_MS = 350;
const MAP_RELOCATE_SAFETY_TIMEOUT_MS = 2800;

/**
 * 타이머 참조 타입.
 * - 훅 내부 여러 setTimeout을 일관된 타입으로 정리해 cleanup 실수를 줄인다.
 */
type TimerRef = ReturnType<typeof setTimeout> | null;

/**
 * 경로 좌표 배열을 중심점 + delta(MapRegion)로 변환한다.
 * - min/max bounding box로 중심을 계산하고, span에 여유값(0.002)을 더해 경로가 잘리지 않게 한다.
 * - span이 너무 작으면 MIN_REGION_DELTA로 보정한다.
 */
const getCenterRegion = (coordinates: GPS_LOG[]): MapRegion => {
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
 * 좌표 span이 "의미 있게 넓은지" 판단한다.
 * - 거의 같은 점들의 반복 데이터일 경우 fitToCoordinates가 과도하게 좁아지거나 무의미해질 수 있어
 *   animateToRegion 경로로 분기하기 위해 사용한다.
 */
const hasMeaningfulSpan = (coordinates: GPS_LOG[]) => {
  if (coordinates.length < 2) return false;
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lonSpan = Math.max(...lons) - Math.min(...lons);
  return latSpan > FIT_SPAN_EPSILON || lonSpan > FIT_SPAN_EPSILON;
};

/**
 * Activity 상세 지도 제어 훅.
 * - map ready / 중심 region / 카메라 이동 타이밍을 일원화한다.
 * - 지연 이동 중에는 isMapRelocating=true로 UI 인디케이터를 제어한다.
 */
export const useActivityDetailMap = (routeLogs: GPS_LOG[]) => {
  // 지도 준비 상태(onMapReady 또는 onLayout fallback)
  const [mapReady, setMapReady] = useState(false);
  // "지도 이동 중" 상태: 상세 페이지에서 로딩 overlay 표시 용도
  const [isMapRelocating, setIsMapRelocating] = useState(false);
  // 현재 지도가 기준으로 삼을 region (initialRegion + mapKey 계산에 사용)
  const [mapRegion, setMapRegion] = useState<MapRegion>(DEFAULT_REGION);
  // MapView 인스턴스 접근용 ref
  const mapRef = useRef<MapView | null>(null);

  // 타이머 ref들: 모두 cleanup 대상
  const readyFallbackTimerRef = useRef<TimerRef>(null);
  const relocateDelayTimerRef = useRef<TimerRef>(null);
  const retryTimerRef = useRef<TimerRef>(null);
  const stopTimerRef = useRef<TimerRef>(null);
  const safetyTimerRef = useRef<TimerRef>(null);

  /**
   * "지도 이동" 관련 타이머만 정리한다.
   * - useEffect 재실행/언마운트/재진입 시 중복 타이머로 인한
   *   카메라 튐/인디케이터 잔상 방지를 위해 공통 함수로 분리했다.
   */
  const clearRelocateTimers = useCallback(() => {
    if (relocateDelayTimerRef.current) {
      clearTimeout(relocateDelayTimerRef.current);
      relocateDelayTimerRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  /**
   * routeLogs -> 중심 region 계산.
   * - 경로가 없으면 null을 반환해 이동 로직을 스킵한다.
   */
  const centerRegion = useMemo(() => {
    if (routeLogs.length === 0) return null;
    return getCenterRegion(routeLogs);
  }, [routeLogs]);

  /**
   * mapKey는 region 변경 시 MapView를 재생성시키기 위한 키.
   * - 일부 환경에서 initialRegion만으로 카메라 반영이 애매할 때 안전장치 역할을 한다.
   */
  const mapKey = `${mapRegion.latitude},${mapRegion.longitude},${mapRegion.latitudeDelta},${mapRegion.longitudeDelta}`;

  /**
   * MapView 준비 완료 콜백.
   * - fallback 타이머가 이미 돌고 있으면 정리하고, mapReady를 true로 확정한다.
   */
  const onMapReady = useCallback(() => {
    if (readyFallbackTimerRef.current) {
      clearTimeout(readyFallbackTimerRef.current);
      readyFallbackTimerRef.current = null;
    }
    setMapReady(true);
  }, []);

  /**
   * 레이아웃 완료 콜백.
   * - 일부 단말에서 onMapReady가 늦거나 누락되는 케이스를 대비해
   *   일정 시간 후 mapReady를 강제로 true 처리한다.
   */
  const onMapLayout = useCallback(() => {
    if (mapReady || readyFallbackTimerRef.current) return;
    readyFallbackTimerRef.current = setTimeout(() => {
      setMapReady(true);
      readyFallbackTimerRef.current = null;
    }, MAP_READY_FALLBACK_MS);
  }, [mapReady]);

  /**
   * 실제 카메라 이동 실행.
   * - 경로 span이 충분하면 fitToCoordinates로 전체 경로를 화면 안에 맞춘다.
   * - 단일점/유사 단일점이면 animateToRegion으로 동네 단위 줌을 보장한다.
   * - 예외가 나면 false를 반환해 상위 재시도 로직으로 넘긴다.
   */
  const moveCamera = useCallback(
    (region: MapRegion): boolean => {
      if (!mapRef.current) return false;

      try {
        if (routeLogs.length >= 2 && hasMeaningfulSpan(routeLogs)) {
          mapRef.current.fitToCoordinates(routeLogs, {
            edgePadding: MAP_EDGE_PADDING,
            animated: true,
          });
          return true;
        }

        mapRef.current.animateToRegion(
          {
            ...region,
            latitudeDelta: Math.min(region.latitudeDelta, SINGLE_POINT_DELTA),
            longitudeDelta: Math.min(region.longitudeDelta, SINGLE_POINT_DELTA),
          },
          280
        );
        return true;
      } catch {
        return false;
      }
    },
    [routeLogs]
  );

  /**
   * 중심 region 동기화.
   * - centerRegion이 있으면 mapRegion을 갱신하고,
   * - 경로가 없으면 기본 지역으로 복원한다.
   */
  useEffect(() => {
    if (!centerRegion) {
      setMapRegion(DEFAULT_REGION);
      return;
    }
    setMapRegion(centerRegion);
  }, [centerRegion]);

  /**
   * 지도 이동 오케스트레이션.
   * 1) mapReady + centerRegion 조건에서만 시작
   * 2) 짧은 지연(MAP_RELOCATE_DELAY_MS) 후 이동 시도
   * 3) 실패 시 제한 횟수까지 재시도
   * 4) 성공 후 짧은 딜레이로 인디케이터 종료
   * 5) 어떤 케이스든 safety timeout으로 무한 로딩 방지
   */
  useEffect(() => {
    if (!mapReady || !centerRegion) return;

    let cancelled = false;
    let retryCount = 0;

    // 이전 사이클 타이머를 먼저 정리하고 이번 사이클을 시작한다.
    clearRelocateTimers();
    setIsMapRelocating(true);

    // 이동 사이클 종료 공통 함수
    const finishRelocation = () => {
      if (cancelled) return;
      setIsMapRelocating(false);
    };

    // 이동 시도 + 재시도 로직
    const tryMove = () => {
      if (cancelled) return;
      const moved = moveCamera(centerRegion);
      if (moved) {
        if (retryCount === 0) {
          retryTimerRef.current = setTimeout(() => {
            retryCount += 1;
            tryMove();
          }, MAP_RETRY_INTERVAL_MS);
        }
        // stop 타이머가 이미 걸려 있다면 먼저 정리해 중복 종료 호출을 막는다.
        if (stopTimerRef.current) {
          clearTimeout(stopTimerRef.current);
          stopTimerRef.current = null;
        }
        // 이동 직후 바로 종료하지 않고 약간의 여유를 둬 UI 깜빡임을 완화한다.
        stopTimerRef.current = setTimeout(
          finishRelocation,
          MAP_RELOCATE_END_DELAY_MS
        );
        return;
      }

      if (retryCount >= MAP_MAX_RETRY_COUNT) {
        finishRelocation();
        return;
      }

      retryCount += 1;
      retryTimerRef.current = setTimeout(tryMove, MAP_RETRY_INTERVAL_MS);
    };

    // 어떤 예외 상황에서도 인디케이터가 무한 노출되지 않도록 안전 종료 타이머를 건다.
    safetyTimerRef.current = setTimeout(
      finishRelocation,
      MAP_RELOCATE_SAFETY_TIMEOUT_MS
    );
    // 0ms 즉시 이동은 단말/전환 타이밍에서 불안정할 수 있어 의도적으로 지연을 둔다.
    relocateDelayTimerRef.current = setTimeout(tryMove, MAP_RELOCATE_DELAY_MS);

    return () => {
      // effect 재실행/언마운트 시 현재 이동 사이클을 무효화한다.
      cancelled = true;
      clearRelocateTimers();
      setIsMapRelocating(false);
    };
  }, [centerRegion, mapReady, clearRelocateTimers, moveCamera]);

  /**
   * 언마운트 cleanup.
   * - map ready fallback + relocate 타이머를 모두 정리한다.
   */
  useEffect(() => {
    return () => {
      if (readyFallbackTimerRef.current) {
        clearTimeout(readyFallbackTimerRef.current);
        readyFallbackTimerRef.current = null;
      }
      clearRelocateTimers();
    };
  }, [clearRelocateTimers]);

  /**
   * 소비 컴포넌트(ActivityDetailPage)에서 사용하는 지도 제어 API.
   */
  return {
    mapRef,
    mapRegion,
    mapKey,
    isMapRelocating,
    onMapReady,
    onMapLayout,
  };
};

export default useActivityDetailMap;
