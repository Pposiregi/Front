import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '@styles/missionModal.styles';

type RunningSummaryModalProps = {
  visible: boolean;
  onClose: () => void;
  durationText: string;
  stepCount: number;
  avgSpeedKmh: number;
};

const RunningSummaryModal = ({
  visible,
  onClose,
  durationText,
  stepCount,
  avgSpeedKmh,
}: RunningSummaryModalProps) => {
  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
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
              <Text style={styles.summaryLabel}>총 걸음 수</Text>
              <Text style={styles.summaryValue}>
                {stepCount.toLocaleString()} 보
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>평균 속도</Text>
              <Text style={styles.summaryValue}>
                {avgSpeedKmh.toFixed(1)} km/h
              </Text>
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
