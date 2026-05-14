import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '@styles/MainStatCards.styles';

type MainStatCardsProps = {
  stepCount: number;
  estimatedKcal: number;
  onStartRun: () => void;
};

const MainStatCards = ({
  stepCount,
  estimatedKcal,
  onStartRun,
}: MainStatCardsProps) => {
  return (
    <View style={styles.metricLayer}>
      <View style={styles.metricGrid}>
        <View style={styles.metricCardShell}>
          <View style={styles.metricCard}>
            <View style={styles.metricLabelRow}>
              <Text style={[styles.metricSmallIcon, styles.metricStepIcon]}>
                👟
              </Text>
              <Text style={styles.metricLabel}>오늘 걸음 수</Text>
            </View>
            <Text style={styles.metricValue}>
              {stepCount.toLocaleString()}
              <Text style={styles.metricUnit}> 걸음</Text>
            </Text>
          </View>
        </View>
        <View style={styles.metricDivider} />
        <View style={[styles.metricCardShell, styles.metricCardShellPrimary]}>
          <TouchableOpacity
            style={[styles.metricCard, styles.metricCardPrimary]}
            activeOpacity={0.85}
            accessibilityRole='button'
            accessibilityLabel='러닝 시작'
            onPress={onStartRun}
          >
            <View style={styles.metricRunIconWrap}>
              <Image
                source={require('@assets/images/Icon_colored/fb_run_2.png')}
                style={styles.metricRunIcon}
                resizeMode='contain'
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCardShell}>
          <View style={[styles.metricCard, styles.metricCardKcal]}>
            <View style={styles.metricLabelRow}>
              <Text style={[styles.metricSmallIcon, styles.metricKcalIcon]}>
                🔥
              </Text>
              <Text style={styles.metricLabel}>소비 열량</Text>
            </View>
            <Text style={styles.metricValue}>
              {estimatedKcal.toLocaleString()}
              <Text style={styles.metricUnit}> kcal</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainStatCards;
