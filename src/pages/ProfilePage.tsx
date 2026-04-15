import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import styles from '@styles/ProfilePage.styles';
import { Colors } from '@styles/theme';
import { ProfileStackNavigationProp } from '@navigation/profileStack';
import BodyRecordPrompt from '@components/BodyRecordPrompt';
import {
  createBodyHistory,
  getBodyHistoriesByUser,
  updateBodyHistory,
} from '@api/bodyHistoryApi';
import { formatDateKey, formatDateLabel } from '@utils/dateUtil';
import { loadBodyGoals, type BodyGoals } from '@utils/bodyGoalsStorage';
import type {
  BodyHistoryFormValues,
  BodyHistoryResponse,
} from 'types/bodyHistory';
import { useSelector } from 'react-redux';
import { RootState } from '@store/reducer';
import { ProfileAvatar } from '@components/ProfileAvatar';
import ProfileImageModal from './ProfileImageModal';

const FALLBACK_HEIGHT = 0;
const FALLBACK_WEIGHT = 0;
const FALLBACK_BODY_FAT = 0;
const WEIGHT_COLOR = Colors.infoStrong;
const BODY_FAT_COLOR = Colors.accentStrong;

/** hex 색상을 chart-kit 호환 rgba 문자열로 변환한다. */
const hexToRgba = (hex: string, opacity = 1) => {
  const normalized = hex.replace('#', '');
  const safeHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const value = parseInt(safeHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

type MetricCardProps = {
  label: string;
  value: number;
  unit: string;
  aim?: number;
  progress?: number;
  barColor?: string;
};

/** 목표 진행률을 포함한 프로필 지표 카드를 렌더한다. */
const MetricCard = ({
  label,
  value,
  unit,
  aim,
  progress,
  barColor = WEIGHT_COLOR,
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

/** 최신 몸 기록, 차트, 기록 저장 진입점을 제공하는 프로필 메인 화면이다. */
function ProfilePage() {
  const navigation = useNavigation<ProfileStackNavigationProp<'ProfileMain'>>();
  const { width: windowWidth } = useWindowDimensions();
  const contentPadding = Math.max(16, Math.round(windowWidth * 0.048));
  const chartWidth =
    windowWidth - Math.max(12, contentPadding * 1.5) * 2;
  const chartHeight = Math.max(188, Math.round(windowWidth * 0.52));
  const chartStrokeWidth = Math.max(2, Math.round(windowWidth * 0.008));
  const chartDotRadius = Math.max(3, Math.round(windowWidth * 0.01));
  const chartDotStrokeWidth = Math.max(2, Math.round(windowWidth * 0.005));
  const headerHitSlop = Math.max(8, Math.round(windowWidth * 0.025));

  const [histories, setHistories] = useState<BodyHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [bodyGoals, setBodyGoals] = useState<BodyGoals>({});

  // 기록 저장 후 최신 데이터를 불러올지 여부
  const [shouldRefreshAfterRecord, setShouldRefreshAfterRecord] =
    useState(false);

  const loadBodyHistories = useCallback(async () => {
    try {
      const data = await getBodyHistoriesByUser();
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

  const loadGoals = useCallback(async () => {
    // 저장된 목표 체중/체지방률을 로컬에서 불러와 진행률 계산에 사용
    const goals = await loadBodyGoals();
    setBodyGoals(goals);
  }, []);

  // 화면이 포커스될 때마다 최신 기록을 불러온다.
  useFocusEffect(
    useCallback(() => {
      loadBodyHistories();
      loadGoals();
    }, [loadBodyHistories, loadGoals])
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
  const weightAim = bodyGoals.weightAim;
  const bodyFatAim = bodyGoals.bodyFatAim;

  const weightProgress = useMemo(() => {
    if (!weightAim || weightAim <= 0 || weightValue <= 0) return undefined;
    return Math.min(weightAim / Math.max(weightValue, weightAim), 1);
  }, [weightAim, weightValue]);

  const bodyFatProgress = useMemo(() => {
    if (!bodyFatAim || bodyFatAim <= 0 || bodyFatValue <= 0) return undefined;
    return Math.min(bodyFatAim / Math.max(bodyFatValue, bodyFatAim), 1);
  }, [bodyFatAim, bodyFatValue]);

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
          color: (opacity = 1) => hexToRgba(WEIGHT_COLOR, opacity),
          strokeWidth: chartStrokeWidth,
        },
        {
          data: [1, 0, 1, 0, 1, 0, 1],
          color: (opacity = 1) => hexToRgba(BODY_FAT_COLOR, opacity),
          strokeWidth: chartStrokeWidth,
        },
      ],
      legend: ['체중(kg)', '체지방률(%)'],
    }),
    [chartStrokeWidth]
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
      labels: recent.map(
        (history) =>
          `${history.baseDate.slice(5, 7)}/${history.baseDate.slice(8, 10)}`
      ), // "MM/DD"
      datasets: [
        {
          data: recent.map((history) => history.weightKg),
          color: (opacity = 1) => hexToRgba(WEIGHT_COLOR, opacity),
          strokeWidth: chartStrokeWidth,
        },
        {
          data: recent.map((history) => history.pbf),
          color: (opacity = 1) => hexToRgba(BODY_FAT_COLOR, opacity),
          strokeWidth: chartStrokeWidth,
        },
      ],
      legend: ['체중(kg)', '체지방률(%)'],
    };
  }, [chartStrokeWidth, fallbackChartData, histories]);

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
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => hexToRgba(Colors.accentStrong, opacity),
    labelColor: (opacity = 1) => hexToRgba(Colors.textSecondary, opacity),
    propsForBackgroundLines: {
      stroke: Colors.divider,
      strokeDasharray: '0',
    },
    propsForDots: {
      r: `${chartDotRadius}`,
      strokeWidth: `${chartDotStrokeWidth}`,
      stroke: Colors.surface,
    },
    useShadowColorFromDataset: false,
  };

  const nickname = useSelector((state: RootState) => state.user.nickname);
  const profileImageUrl = useSelector(
    (state: RootState) => state.user.profileImageUrl
  );

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.textPrimary} />
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
            <Pressable onPress={() => setProfileModalVisible(true)}>
              <View style={styles.avatar}>
                <ProfileAvatar profileImageUrl={profileImageUrl} />
              </View>
            </Pressable>
            <Pressable
              style={styles.gearButton}
              onPress={() => navigation.navigate('ProfileSettings')}
              hitSlop={headerHitSlop}
            >
              <Text style={styles.gearText}>⚙️</Text>
            </Pressable>
          </View>
          <Text style={styles.name}>{nickname || '김돌돌'}</Text>
          <Text style={styles.caption}>오늘도 반려펫과 함께 건강관리</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>내 몸 상태</Text>
          <Pressable
            style={styles.recordButton}
            onPress={() => setRecordModalVisible(true)}
            hitSlop={headerHitSlop}
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

        <MetricCard
          label='체중'
          value={weightValue}
          unit='kg'
          aim={weightAim}
          progress={weightProgress}
          barColor={WEIGHT_COLOR}
        />
        <MetricCard
          label='체지방률'
          value={bodyFatValue}
          unit='%'
          aim={bodyFatAim}
          progress={bodyFatProgress}
          barColor={BODY_FAT_COLOR}
        />

        <View style={[styles.sectionHeader, styles.chartHeader]}>
          <Text style={styles.sectionTitle}>내 몸 변화</Text>
        </View>

        <View style={styles.chartCard}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            fromZero
            style={styles.chartStyle}
            withInnerLines
            withOuterLines={false}
          />
        </View>
      </ScrollView>
      <ProfileImageModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        currentImageUrl={profileImageUrl}
      />
      <BodyRecordPrompt
        visible={recordModalVisible}
        dateLabel={todayLabel}
        baseDate={todayKey}
        initialHeight={heightValue}
        initialWeight={weightValue}
        initialBodyFat={bodyFatValue}
        weightAim={weightAim}
        bodyFatAim={bodyFatAim}
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
