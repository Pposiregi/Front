import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@styles/Activity.styles';
import type {
  ActivityDetailNavigationProp,
  GPS_SESSION,
} from '../../types/activity';

type SessionItemProps = {
  session: GPS_SESSION;
};

/**
 * 요일 라벨 (일요일 시작)
 */
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 월간 GPS 세션 리스트 아이템
 * - 클릭 시 상세 화면으로 이동한다.
 */
function SessionItem({ session }: SessionItemProps) {
  const navigation = useNavigation<ActivityDetailNavigationProp>();

  const formattedDate = useMemo(() => {
    const date = new Date(session.startTime);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekday = WEEKDAY_LABELS[date.getDay()] ?? '';
    return `${month}월 ${day}일 (${weekday})`;
  }, [session.startTime]);

  const timeRange = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return `${new Date(session.startTime).toLocaleTimeString(
      [],
      options
    )} - ${new Date(session.endTime).toLocaleTimeString([], options)}`;
  }, [session.startTime, session.endTime]);

  const durationLabel = useMemo(() => {
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const durationSeconds = Math.max(0, Math.floor((end - start) / 1000));
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  }, [session.endTime, session.startTime]);

  const distanceValue = useMemo(() => {
    // 서버 응답이 null/undefined일 수 있어 UI 표시 직전에 안전하게 보정한다.
    const numericDistance = Number(session.totalDistance);
    const safeDistance = Number.isFinite(numericDistance) ? numericDistance : 0;
    return safeDistance.toFixed(2);
  }, [session.totalDistance]);

  const handlePress = () => {
    navigation.navigate('ActivityDetailPage', {
      sessionId: String(session.sessionId),
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.listCard}>
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
            {distanceValue}
          </Text>
          <Text style={styles.listValueUnit}>km</Text>
        </View>
        <Text style={styles.detailLink}>&gt;</Text>
      </View>
    </TouchableOpacity>
  );
}

export default SessionItem;
