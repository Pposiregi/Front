import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import styles from '@styles/ProfilePage.styles';
import { ProfileStackNavigationProp } from '@navigation/profileStack';
import BodyRecordPrompt from '@components/BodyRecordPrompt';
import {
  createBodyHistory,
  getBodyHistoriesByUser,
  updateBodyHistory,
} from '@api/bodyHistoryApi';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import type {
  BodyHistoryFormValues,
  BodyHistoryResponse,
} from 'types/bodyHistory';

const CONTENT_PADDING = 20;
const CHART_CARD_PADDING = 14;
const API_USER_ID = 3;
const FALLBACK_HEIGHT = 0;
const FALLBACK_WEIGHT = 0;
const FALLBACK_BODY_FAT = 0;

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

  const [histories, setHistories] = useState<BodyHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);

  // 기록 저장 후 최신 데이터를 불러올지 여부
  const [shouldRefreshAfterRecord, setShouldRefreshAfterRecord] =
    useState(false);

  const loadBodyHistories = useCallback(async () => {
    try {
      const data = await getBodyHistoriesByUser(API_USER_ID);
      const sorted = [...data].sort((a, b) =>
        b.baseDate.localeCompare(a.baseDate)
      );
      setHistories(sorted);
    } catch (err) {
      Alert.alert('불러오기 실패', '몸 기록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면이 포커스될 때마다 최신 기록을 불러온다.
  useFocusEffect(
    useCallback(() => {
      loadBodyHistories();
    }, [loadBodyHistories])
  );

  // 팝업을 닫은 직후 최신 기록을 다시 불러와 화면을 갱신한다.
  useEffect(() => {
    if (!recordModalVisible && shouldRefreshAfterRecord) {
      loadBodyHistories().finally(() => setShouldRefreshAfterRecord(false));
    }
  }, [loadBodyHistories, recordModalVisible, shouldRefreshAfterRecord]);

  const latestHistory = useMemo(
    () => (histories.length ? histories[0] : null),
    [histories]
  );

  const heightValue = latestHistory?.heightCm ?? FALLBACK_HEIGHT;
  const weightValue = latestHistory?.weightKg ?? FALLBACK_WEIGHT;
  const bodyFatValue = latestHistory?.pbf ?? FALLBACK_BODY_FAT;

  const todayKey = formatDateKey(new Date());
  const todayLabel = formatDateLabel(new Date());

  /*
    차트용 초기 더미 데이터 생성
  */
  const fallbackChartData = useMemo(
    () => ({
      labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0],
          color: (opacity = 1) => `rgba(245, 134, 52, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: [1, 0, 1, 0, 1, 0, 1],
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ['체중(kg)', '체지방률(%)'],
    }),
    []
  );

  const chartData = useMemo(() => {
    if (!histories.length) return fallbackChartData;
    const sanitized = histories
      .map((history) => ({
        baseDate: history.baseDate ?? '',
        weightKg: Number(history.weightKg) || 0,
        pbf: Number(history.pbf) || 0,
      }))
      .filter((item) => item.baseDate);

    if (!sanitized.length) return fallbackChartData;

    const recent = sanitized.slice(0, 7).reverse(); // 차트는 시간순으로 표시
    return {
      labels: recent.map((history) => history.baseDate.slice(5)),
      datasets: [
        {
          data: recent.map((history) => history.weightKg),
          color: (opacity = 1) => `rgba(245, 134, 52, ${opacity})`,
          strokeWidth: 3,
        },
        {
          data: recent.map((history) => history.pbf),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ['체중(kg)', '체지방률(%)'],
    };
  }, [fallbackChartData, histories]);

  const handleSaveRecord = useCallback(
    async (values: BodyHistoryFormValues) => {
      setSavingRecord(true);
      try {
        const existing = histories.find(
          (history) => history.baseDate === values.baseDate
        );

        if (existing?.id) {
          await updateBodyHistory(existing.id, {
            heightCm: values.heightCm,
            weightKg: values.weightKg,
            pbf: values.pbf,
            baseDate: values.baseDate,
          });
        } else {
          await createBodyHistory({
            userId: API_USER_ID,
            heightCm: values.heightCm,
            weightKg: values.weightKg,
            pbf: values.pbf,
            baseDate: values.baseDate,
          });
        }

        setShouldRefreshAfterRecord(true);
        setRecordModalVisible(false);
        Alert.alert('기록 완료', '몸 기록을 저장했어요.');
      } catch (err) {
        console.error('[Profile] 몸 기록 저장 실패', err);
        Alert.alert('저장 실패', '몸 기록을 저장하지 못했어요.');
      } finally {
        setSavingRecord(false);
      }
    },
    [histories]
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#111827' />
      </View>
    );
  }

  return (
    <>
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
          <Text style={styles.sectionTitle}>내 몸 상태</Text>
          <Pressable
            style={styles.recordButton}
            onPress={() => setRecordModalVisible(true)}
            hitSlop={6}
          >
            <Text style={styles.recordIcon}>✏️</Text>
            <Text style={styles.recordText}>기록하기</Text>
          </Pressable>
        </View>

        <View style={styles.metricCardSingle}>
          <Text style={styles.metricLabel}>키</Text>
          <Text style={styles.metricValue}>
            <Text style={styles.metricNumber}>{heightValue}</Text>
            <Text style={styles.metricUnit}> cm</Text>
          </Text>
        </View>

        <MetricCard label='체중' value={weightValue} unit='kg' />
        <MetricCard label='체지방률' value={bodyFatValue} unit='%' />

        <View style={[styles.sectionHeader, styles.chartHeader]}>
          <Text style={styles.sectionTitle}>내 몸 변화</Text>
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

      <BodyRecordPrompt
        visible={recordModalVisible}
        dateLabel={todayLabel}
        baseDate={todayKey}
        initialHeight={heightValue}
        initialWeight={weightValue}
        initialBodyFat={bodyFatValue}
        onSave={handleSaveRecord}
        onLater={() => setRecordModalVisible(false)}
        secondaryLabel='취소'
        primaryLabel='기록 저장'
        showSkip={false}
        saving={savingRecord}
      />
    </>
  );
}

export default ProfilePage;
