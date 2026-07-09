import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '@styles/missionModal.styles';

type RunningSummaryModalProps = {
  visible: boolean;
  onClose: () => void;
  durationText: string;
  distanceMeters: number;
  stepCount: number;
  avgSpeedMps: number;
  strideLength: number;
};

/** 평균 속도를 km/h로 변환한다. */
const toKmh = (mps: number) => mps * 3.6;

/** 평균 속도를 분/km 페이스 문자열로 변환한다. */
const formatPacePerKm = (mps: number) => {
  // m/s -> sec/km (1000m / speed) 변환 후 mm:ss 포맷으로 표시한다.
  if (!Number.isFinite(mps) || mps <= 0) return '-';
  const rawSecondsPerKm = 1000 / mps;
  const roundedSecondsPerKm = Math.round(rawSecondsPerKm);
  const minutes = Math.floor(roundedSecondsPerKm / 60);
  const seconds = roundedSecondsPerKm % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} /km`;
};

/** 미터 단위 거리를 1km 이상이면 km, 미만이면 m로 포맷한다. */
const formatDistanceMeters = (meters: number) => {
  if (!Number.isFinite(meters) || meters < 0) return '-';
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
};

/** 보폭(m)을 cm 단위 문자열로 포맷한다. */
const formatStride = (meters: number) => {
  if (!Number.isFinite(meters) || meters <= 0) return '-';
  return `${Math.round(meters * 100)} cm`;
};

/** 러닝 종료 직후 핵심 요약 수치를 보여주는 모달이다. */
const RunningSummaryModal = ({
  visible,
  onClose,
  durationText,
  distanceMeters,
  stepCount,
  avgSpeedMps,
  strideLength,
}: RunningSummaryModalProps) => {
  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.missionView}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>러닝 완료!</Text>
          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>운동 시간</Text>
              <Text style={styles.summaryValue}>{durationText}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>총 거리</Text>
              <Text style={styles.summaryValue}>
                {formatDistanceMeters(distanceMeters)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>총 걸음 수</Text>
              <Text style={styles.summaryValue}>{`${stepCount.toLocaleString()} 보`}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>평균 페이스</Text>
              <View style={styles.summaryValueGroup}>
                <Text style={styles.summaryValue}>
                  {formatPacePerKm(avgSpeedMps)}
                </Text>
                <Text style={styles.summarySubValue}>
                  {Number.isFinite(avgSpeedMps) && avgSpeedMps > 0
                    ? `${toKmh(avgSpeedMps).toFixed(2)} km/h`
                    : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>평균 보폭</Text>
              <Text style={styles.summaryValue}>{formatStride(strideLength)}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.missionUIExitButton}
          >
            <Text style={styles.missionUIExitText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RunningSummaryModal;
