import React, { useMemo } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import styles from '@styles/ProfilePage.styles';
import { ProfileStackNavigationProp } from '@navigation/profileStack';

const CONTENT_PADDING = 20;
const CHART_CARD_PADDING = 14;

type MetricCardProps = {
  label: string;
  value: number;
  unit: string;
  aim?: number;
  progress?: number;
  barColor?: string;
};

const MetricCard = ({
  label,
  value,
  unit,
  aim,
  progress,
  barColor = '#9AAAFE',
}: MetricCardProps) => {
  const progressPercent = Math.min(Math.max(progress ?? 0, 0), 1) * 100;

  return (
    <View style={styles.metricCard}>
      <View>
        <Text style={styles.metricLabel}>{label}</Text>
        {typeof aim === 'number' && (
          <Text style={styles.metricAim}>aim: {aim}</Text>
        )}
      </View>
      <View style={styles.metricRight}>
        <Text style={styles.metricValue}>
          <Text style={styles.metricNumber}>{value}</Text>
          <Text style={styles.metricUnit}> {unit}</Text>
        </Text>
        {typeof progress === 'number' && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${progressPercent}%`, backgroundColor: barColor },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

function ProfilePage() {
  const navigation = useNavigation<ProfileStackNavigationProp<'ProfileMain'>>();
  const chartWidth =
    Dimensions.get('window').width -
    CONTENT_PADDING * 2 -
    CHART_CARD_PADDING * 2;

  const chartData = useMemo(
    () => ({
      labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      datasets: [
        {
          data: [3, 5, 4, 7, 5, 6, 4],
          color: (opacity = 1) => `rgba(245, 134, 52, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ['최근 7일 변화'],
    }),
    []
  );

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(245, 134, 52, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
    propsForBackgroundLines: {
      stroke: '#F3F4F6',
      strokeDasharray: '0',
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>😺</Text>
          </View>
          <Pressable
            style={styles.gearButton}
            onPress={() => navigation.navigate('ProfileSettings')}
            hitSlop={10}
          >
            <Text style={styles.gearText}>⚙️</Text>
          </Pressable>
        </View>
        <Text style={styles.name}>김왈왈</Text>
        <Text style={styles.caption}>오늘도 반려펫과 함께 건강관리</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>내 바디~~~</Text>
        <Pressable
          style={styles.recordButton}
          onPress={() => Alert.alert('기록하기', '다음 스프린트에서 연결 예정')}
          hitSlop={6}
        >
          <Text style={styles.recordIcon}>✏️</Text>
          <Text style={styles.recordText}>기록하기</Text>
        </Pressable>
      </View>

      <View style={styles.metricCardSingle}>
        <Text style={styles.metricLabel}>키</Text>
        <Text style={styles.metricValue}>
          <Text style={styles.metricNumber}>177</Text>
          <Text style={styles.metricUnit}> cm</Text>
        </Text>
      </View>

      <MetricCard
        label='체중'
        value={85}
        unit='kg'
        aim={43}
        progress={0.55}
        barColor='#97A6F9'
      />
      <MetricCard
        label='체지방률'
        value={18}
        unit='%'
        aim={12}
        progress={0.62}
        barColor='#8B5CF6'
      />

      <View style={[styles.sectionHeader, styles.chartHeader]}>
        <Text style={styles.sectionTitle}>내 바디 변화량~~~</Text>
      </View>

      <View style={styles.chartCard}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
          withInnerLines
          withOuterLines={false}
        />
      </View>
    </ScrollView>
  );
}

export default ProfilePage;
