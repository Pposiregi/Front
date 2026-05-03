import React from 'react';
import { View, Text } from 'react-native';
import styles from '@styles/MainStatCards.styles';

type MainStatCardsProps = {
  stepCount: number;
  totalRunSec: number;
  estimatedKcal: number;
};

const formatTotalRunTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

const MainStatCards = ({
  stepCount,
  totalRunSec,
  estimatedKcal,
}: MainStatCardsProps) => {
  return (
    <View pointerEvents='none' style={styles.metricLayer}>
      <View style={styles.metricGrid}>
        <View style={styles.metricCardShell}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>러닝 시간</Text>
            <Text style={styles.metricValue}>
              {formatTotalRunTime(totalRunSec)}
            </Text>
          </View>
        </View>
        <View style={[styles.metricCardShell, styles.metricCardShellPrimary]}>
          <View style={[styles.metricCard, styles.metricCardPrimary]}>
            <Text style={styles.metricLabel}>걸음 수</Text>
            <Text style={styles.metricValuePrimary}>
              {`${stepCount.toLocaleString()} steps`}
            </Text>
          </View>
        </View>
        <View style={styles.metricCardShell}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>소비 열량</Text>
            <Text style={styles.metricValue}>
              {`${estimatedKcal.toLocaleString()} kcal`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainStatCards;
