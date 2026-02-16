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
  stepCountMissing?: boolean;
};

const toKmh = (mps: number) => mps * 3.6;

const formatPacePerKm = (mps: number) => {
  // m/s -> sec/km (1000m / speed) 변환 후 mm:ss 포맷으로 표시한다.
  if (!Number.isFinite(mps) || mps <= 0) return '-';
  const rawSecondsPerKm = 1000 / mps;
  const roundedSecondsPerKm = Math.round(rawSecondsPerKm);
  const minutes = Math.floor(roundedSecondsPerKm / 60);
  const seconds = roundedSecondsPerKm % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} /km`;
};

const formatDistanceMeters = (meters: number) => {
  // 요약 모달은 러닝 종료 직후 원본 거리(m)를 그대로 노출한다.
  if (!Number.isFinite(meters) || meters < 0) return '-';
  return `${meters.toFixed(2)} m`;
};

const RunningSummaryModal = ({
  visible,
  onClose,
  durationText,
  distanceMeters,
  stepCount,
  avgSpeedMps,
  stepCountMissing = false,
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
              <Text style={styles.summaryValue}>
                {stepCountMissing
                  ? '미집계'
                  : `${stepCount.toLocaleString()} 보`}
              </Text>
            </View>
            {stepCountMissing && (
              <Text style={styles.summaryCaption}>
                Health Connect 권한을 확인해 주세요.
              </Text>
            )}
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
