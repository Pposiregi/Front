import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import EventSource from 'react-native-sse';
import { useSelector } from 'react-redux';
import { RootState } from '@store/reducer';
import { API_BASE_URL } from '@env';
import type { MissionProgressEvent } from 'types/mission';

/**
 * /missions/progress/stream SSE 구독 훅.
 * 화면이 활성화된 동안 연결을 유지하고, 앱이 백그라운드에서 복귀하면 자동 재연결.
 *
 * @param onMissionProgress - mission-progress 이벤트 수신 시 호출되는 콜백 (useCallback으로 감싸야 함)
 * @param enabled - false이면 연결하지 않음
 */
export function useMissionSSE(
  onMissionProgress: (event: MissionProgressEvent) => void,
  enabled: boolean = true
) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const esRef = useRef<EventSource | null>(null);
  const onMissionProgressRef = useRef(onMissionProgress);

  // 최신 콜백을 ref에 동기화 (SSE 재연결 없이 항상 최신 콜백 사용)
  useEffect(() => {
    onMissionProgressRef.current = onMissionProgress;
  }, [onMissionProgress]);

  useEffect(() => {
    if (!enabled || !accessToken) return;

    const connect = () => {
      if (esRef.current) {
        console.log('[useMissionSSE] 기존 SSE 연결 해제');
        esRef.current.close();
      }

      console.log('[useMissionSSE] SSE 연결 시작');

      const es = new EventSource<'mission-progress' | 'ping' | 'connected'>(
        `${API_BASE_URL}/missions/progress/stream`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      es.addEventListener('open', () => {
        console.log('[useMissionSSE] SSE 연결 성공');
      });

      es.addEventListener('mission-progress', (event) => {
        if (!event.data) return;
        try {
          const data: MissionProgressEvent = JSON.parse(event.data);
          console.log('[useMissionSSE] mission-progress 수신', data);
          onMissionProgressRef.current(data);
        } catch (e) {
          console.error('[useMissionSSE] mission-progress 파싱 실패', e);
        }
      });

      es.addEventListener('error', (event) => {
        console.warn('[useMissionSSE] SSE 오류 발생', event);
      });

      esRef.current = es;
    };

    connect();

    // 앱이 백그라운드에서 포그라운드로 복귀하면 재연결
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        console.log('[useMissionSSE] 포그라운드 복귀 → SSE 재연결');
        connect();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      console.log('[useMissionSSE] SSE 연결 해제 (cleanup)');
      esRef.current?.close();
      esRef.current = null;
      subscription.remove();
    };
  }, [enabled, accessToken]);
}
