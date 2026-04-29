import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '@styles/Activity.styles';
import { formatDistanceFromMeters } from '@utils/distanceFormat';
import { parseGpsDateTime } from '@utils/dateUtil';
import type {
  ActivityDetailNavigationProp,
  GPS_SESSION,
} from '../../types/activity';

type SessionItemProps = {
  session: GPS_SESSION;
  onDelete?: (sessionId: number) => void;
};

/**
 * 요일 라벨 (일요일 시작)
 */
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const FALLBACK_TIME_LABEL = '--:--';
const FALLBACK_DURATION_LABEL = '--:--:--';

/** Date 파싱 실패 여부를 UI 표시 직전에 검증한다. */
const isValidDate = (date: Date) => Number.isFinite(date.getTime());

/** 종료되지 않은 세션처럼 유효하지 않은 시각은 fallback 라벨로 표시한다. */
const formatTime = (date: Date) => {
  if (!isValidDate(date)) return FALLBACK_TIME_LABEL;

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return date.toLocaleTimeString([], options);
};

/**
 * 월간 GPS 세션 리스트 아이템
 * - 클릭 시 상세 화면으로 이동한다.
 */
function SessionItem({ session, onDelete }: SessionItemProps) {
  const navigation = useNavigation<ActivityDetailNavigationProp>();

  const formattedDate = useMemo(() => {
    // GPS API 응답은 timezone 없는 UTC 문자열일 수 있어 전용 파서를 사용한다.
    const date = parseGpsDateTime(session.startTime);
    if (!isValidDate(date)) return '날짜 없음';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekday = WEEKDAY_LABELS[date.getDay()] ?? '';
    return `${month}월 ${day}일 (${weekday})`;
  }, [session.startTime]);

  const timeRange = useMemo(() => {
    const startDate = parseGpsDateTime(session.startTime);
    const endDate = parseGpsDateTime(session.endTime);

    // endTime이 null이면 서버상 종료되지 않은 세션으로 보고 "진행 중"으로 표시한다.
    return `${formatTime(startDate)} - ${
      isValidDate(endDate) ? formatTime(endDate) : '진행 중'
    }`;
  }, [session.startTime, session.endTime]);

  const durationLabel = useMemo(() => {
    const start = parseGpsDateTime(session.startTime).getTime();
    const end = parseGpsDateTime(session.endTime).getTime();
    // 시작/종료 중 하나라도 없으면 Invalid Date 대신 고정 fallback을 보여준다.
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return FALLBACK_DURATION_LABEL;
    }

    const durationSeconds = Math.max(0, Math.floor((end - start) / 1000));
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  }, [session.endTime, session.startTime]);

  const distanceLabel = useMemo(() => {
    // 서버 응답이 null/undefined일 수 있어 UI 표시 직전에 안전하게 보정한다.
    // 러닝별 세션 totalDistance는 meter 기준 응답을 가정한다.
    const numericDistance = Number(session.totalDistance);
    const safeDistance = Number.isFinite(numericDistance) ? numericDistance : 0;
    return formatDistanceFromMeters(safeDistance);
  }, [session.totalDistance]);

  const handlePress = () => {
    navigation.navigate('ActivityDetailPage', {
      sessionId: String(session.sessionId),
    });
  };

  const handleDeletePress = (event: GestureResponderEvent) => {
    // 카드 전체의 상세 이동 press가 같이 실행되지 않도록 삭제 버튼에서 전파를 막는다.
    event.stopPropagation();
    onDelete?.(session.sessionId);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.listCard}>
      {/* 삭제 액션은 카드 콘텐츠를 밀지 않도록 우상단에 독립 배치한다. */}
      {onDelete ? (
        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel='러닝 기록 삭제'
          onPress={handleDeletePress}
          style={styles.sessionDeleteButton}
        >
          <Text style={styles.sessionDeleteText}>×</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.listMarker} />
      <View style={styles.listTextColumn}>
        <Text style={styles.listTitle}>{formattedDate}</Text>
        <Text style={styles.listSubtitle}>{timeRange}</Text>
        <Text style={styles.listMeta}>{durationLabel}</Text>
      </View>
      <View style={styles.listRight}>
        <View style={styles.listDistanceRow}>
          <Text
            style={[
              styles.listValue,
              styles.listValueAccent,
              styles.listValueNumber,
            ]}
          >
            {distanceLabel.value}
          </Text>
          <Text style={styles.listValueUnit}>{distanceLabel.unit}</Text>
        </View>
        <Text style={styles.detailLink}>&gt;</Text>
      </View>
    </TouchableOpacity>
  );
}

export default SessionItem;
