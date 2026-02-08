import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle } from 'react-native-svg';
import {
  ChartData,
  DailyActivity,
  GPS_SESSION,
  WeeklyStepItem,
} from '../../types/activity';
import SessionItem from './SessionItem';
import { activityTheme, styles } from '@styles/Activity.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import {
  getActivityRange,
  getDailyActivity,
  getMonthlySessions,
  getWeeklySteps,
} from '@api/activityApi';
import { getUser } from '@api/mainApi';
import { formatDateKey, parseDateKey } from '@utils/dateUtil';
import type { getUserResponse } from 'types/main';

/**
 * 요일 라벨 (일요일 시작).
 */
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 해당 월의 시작/끝 날짜 키를 반환한다.
 */
const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    from: formatDateKey(start),
    to: formatDateKey(end),
  };
};

/**
 * 일별 리스트용 날짜 라벨을 생성한다.
 * - 포맷: MM/DD (요일)
 */
const formatDailyLabel = (dateKey: string) => {
  const parsed = parseDateKey(dateKey);
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const weekday = WEEKDAY_LABELS[parsed.getDay()] ?? '';
  return `${month}/${day} (${weekday})`;
};

type ProgressRingProps = {
  size: number;
  strokeWidth: number;
  progress: number;
  trackColor: string;
  progressColor: string;
};

/**
 * 원형 진행률 컴포넌트.
 * - progress(0~1)를 strokeDashoffset으로 표현한다.
 */
const ProgressRing = ({
  size,
  strokeWidth,
  progress,
  trackColor,
  progressColor,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(progress, 1));
  const dashOffset = circumference * (1 - clamped);

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill='none'
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        fill='none'
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

/**
 * 활동 기록 메인 화면.
 * - 오늘 요약, 최근 7일, 이달 기록(일별/활동별) 제공
 */
function ActivityPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const today = useMemo(() => formatDateKey(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [monthlyActivities, setMonthlyActivities] = useState<GPS_SESSION[]>([]);
  const [monthlyDailyActivities, setMonthlyDailyActivities] = useState<
    DailyActivity[]
  >([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<getUserResponse | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [weeklySteps, setWeeklySteps] = useState<WeeklyStepItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [listTab, setListTab] = useState<'daily' | 'sessions'>('daily');
  const chartPadding = activityTheme.spacing.lg;
  const contentPadding = activityTheme.spacing.xl;
  const chartWidth = SCREEN_WIDTH - contentPadding * 2 - chartPadding * 2;
  const chartHeight = Math.round(SCREEN_HEIGHT * 0.2);
  const chartTopInset = Math.round(chartPadding * 0.6);

  const normalizedWeeklySteps = useMemo(
    () =>
      weeklySteps
        .map((item) => ({
          date: item.date ?? '',
          step: Number(item.step) || 0,
        }))
        .filter((item) => item.date),
    [weeklySteps]
  );

  const hasWeeklySteps = normalizedWeeklySteps.some((item) => item.step > 0);

  const normalizedMonthlyDaily = useMemo(
    () => {
      const byDate = new Map<string, DailyActivity>();

      monthlyDailyActivities.forEach((item) => {
        if (!item.date) return;
        // 백엔드가 date-time 문자열을 내려줄 수 있어 일 단위 키로 정규화한다.
        const dayKey = item.date.slice(0, 10);

        const prev = byDate.get(dayKey);
        if (!prev) {
          byDate.set(dayKey, {
            date: dayKey,
            steps: Number(item.steps) || 0,
            distanceKm: Number(item.distanceKm) || 0,
            burnCalories: Number(item.burnCalories) || 0,
          });
          return;
        }

        byDate.set(dayKey, {
          date: dayKey,
          steps: (Number(prev.steps) || 0) + (Number(item.steps) || 0),
          distanceKm:
            (Number(prev.distanceKm) || 0) + (Number(item.distanceKm) || 0),
          burnCalories:
            (Number(prev.burnCalories) || 0) + (Number(item.burnCalories) || 0),
        });
      });

      return [...byDate.values()].sort(
        (a, b) =>
          parseDateKey(b.date).getTime() - parseDateKey(a.date).getTime()
      );
    },
    [monthlyDailyActivities]
  );

  const weeklyStepStats = useMemo(() => {
    if (normalizedWeeklySteps.length === 0) {
      return { average: 0, max: 0 };
    }

    const steps = normalizedWeeklySteps.map((item) => item.step);
    const total = steps.reduce((acc, value) => acc + value, 0);
    return {
      average: Math.round(total / steps.length),
      max: Math.max(...steps),
    };
  }, [normalizedWeeklySteps]);

  /**
   * HEX 컬러를 RGBA 문자열로 변환한다.
   */
  const toRgba = useCallback((hex: string, opacity = 1) => {
    const normalized = hex.replace('#', '');
    const value =
      normalized.length === 3
        ? normalized
            .split('')
            .map((char) => `${char}${char}`)
            .join('')
        : normalized;
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }, []);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: activityTheme.colors.surface,
      backgroundGradientTo: activityTheme.colors.surface,
      backgroundGradientFromOpacity: 1,
      backgroundGradientToOpacity: 1,
      decimalPlaces: 0,
      color: (opacity = 1) => toRgba(activityTheme.colors.accent, opacity),
      labelColor: (opacity = 1) =>
        toRgba(activityTheme.colors.textSecondary, opacity),
      propsForBackgroundLines: {
        stroke: activityTheme.colors.divider,
        strokeDasharray: '0',
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: activityTheme.colors.surface,
      },
      useShadowColorFromDataset: false,
    }),
    [toRgba]
  );

  /**
   * Y축 레이블을 보기 좋은 값(천 단위)으로 보정한다.
   */
  const formatStepLabel = useCallback((value: string) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return value;
    }
    const rounded = Math.round(numeric / 1000) * 1000;
    return Math.max(0, rounded).toLocaleString();
  }, []);

  /**
   * 월간 GPS 세션 리스트
   */
  const fetchMonthlySessions = useCallback(async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const data = await getMonthlySessions(year, month);

      // startTime을 기준으로 최신순 정렬
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setMonthlyActivities(sortedData);
    } catch (err) {
      console.log('>>> 월별 활동 조회 실패', err);
      setMonthlyActivities([]);
    }
  }, []);

  /**
   * 월간 일별 요약 리스트
   */
  const fetchMonthlyDaily = useCallback(async (date: Date) => {
    try {
      const { from, to } = getMonthRange(date);
      const data = await getActivityRange(from, to);
      setMonthlyDailyActivities(data ?? []);
    } catch (err) {
      console.log('>>> 월별 일일 활동 조회 실패', err);
      setMonthlyDailyActivities([]);
    }
  }, []);

  /**
   * 월간 데이터(세션/일별)를 동시에 갱신한다.
   */
  const fetchMonthlyBundle = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMonthlySessions(date),
          fetchMonthlyDaily(date),
        ]);
      } finally {
        setLoading(false);
      }
    },
    [fetchMonthlyDaily, fetchMonthlySessions]
  );

  /**
   * 월 이동 핸들러.
   * - 미래 월로는 이동하지 않는다.
   */
  const handleChangeMonth = (offset: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);

      // 현재 월이거나 미래 월일 경우 (오른쪽 화살표 사용 X)
      const todayDate = new Date();
      if (
        offset === 1 &&
        (next.getFullYear() > todayDate.getFullYear() ||
          (next.getFullYear() === todayDate.getFullYear() &&
            next.getMonth() > todayDate.getMonth()))
      ) {
        return prev;
      }
      return next;
    });
  };

  /**
   * 오늘의 활동 요약
   */
  const fetchDailySummary = useCallback(async () => {
    try {
      const response = await getDailyActivity(today);
      if (__DEV__) {
        console.log(
          '>>> [Activity] daily summary',
          JSON.stringify(
            {
              date: today,
              response,
            },
            null,
            0
          )
        );
      }
      setDailyActivity(response);
    } catch (err) {
      console.warn('오늘 활동 요약 fetch 실패', err);
      setDailyActivity(null);
    }
  }, [today]);

  /**
   * 최근 7일 걸음수
   */
  const fetchWeeklySteps = useCallback(async () => {
    try {
      const response = await getWeeklySteps();
      setWeeklySteps(response);
    } catch (err) {
      console.warn('주간 걸음수 fetch 실패', err);
      setWeeklySteps([]);
    }
  }, []);

  /**
   * 유저 프로필(목표 걸음수 포함)
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await getUser();
      setUserProfile(response);
    } catch (err) {
      console.warn('유저 정보 fetch 실패', err);
      setUserProfile(null);
    }
  }, []);

  /**
   * 주간 차트 데이터와 목표선(점선) 구성
   */
  const calculateWeeklyChart = useCallback(() => {
    if (normalizedWeeklySteps.length === 0) {
      setChartData({
        labels: [],
        datasets: [{ data: [] }],
      });
      return;
    }
    const labels = normalizedWeeklySteps.map((item) =>
      item.date.substring(5).replace('-', '/')
    );
    const dataValues = normalizedWeeklySteps.map((item) => item.step);
    setChartData({
      labels,
      datasets: [{ data: dataValues, strokeWidth: 3 }],
    });
  }, [normalizedWeeklySteps]);

  useEffect(() => {
    fetchMonthlyBundle(currentMonth);
  }, [currentMonth, fetchMonthlyBundle]);

  useEffect(() => {
    fetchWeeklySteps();
    fetchDailySummary();
    fetchUserProfile();
  }, [fetchDailySummary, fetchUserProfile, fetchWeeklySteps]);

  useEffect(() => {
    calculateWeeklyChart();
  }, [calculateWeeklyChart]);

  const headerTitle = '러닝';
  const headerSubtitle = useMemo(
    () => `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`,
    [currentMonth]
  );

  const todayLabel = useMemo(() => {
    const date = dailyActivity?.date
      ? parseDateKey(dailyActivity.date)
      : new Date();
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }, [dailyActivity?.date]);

  /**
   * 풀투리프레시 핸들러.
   * - 오늘 요약/주간/월간 데이터를 한번에 갱신한다.
   */
  const handlePullToRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDailySummary(),
        fetchWeeklySteps(),
        fetchMonthlyBundle(currentMonth),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [currentMonth, fetchDailySummary, fetchMonthlyBundle, fetchWeeklySteps]);

  const stepsValue = dailyActivity?.steps ?? 0;
  const distanceValue = dailyActivity?.distanceKm ?? 0;
  const burnValue = dailyActivity?.burnCalories ?? 0;
  const targetSteps = userProfile?.targetStepCount ?? 0;

  const progressValue =
    targetSteps > 0
      ? Math.min(stepsValue / targetSteps, 1)
      : stepsValue > 0
      ? 1
      : 0;
  const remainingSteps = targetSteps > 0 ? targetSteps - stepsValue : 0;

  const progressComment = useMemo(() => {
    if (targetSteps > 0) {
      if (stepsValue >= targetSteps) {
        return '목표 달성! 펫 표정이 바뀐 것 같아요.';
      }
      if (stepsValue <= 0) {
        return '오늘의 첫 걸음을 시작해볼까요?';
      }
      return `오늘은 목표까지 ${Math.max(
        0,
        remainingSteps
      ).toLocaleString()}걸음 남았어요.`;
    }
    if (stepsValue <= 0) {
      return '오늘의 첫 걸음을 시작해볼까요?';
    }
    return '오늘도 잘 걷고 있어요.';
  }, [remainingSteps, stepsValue, targetSteps]);

  const progressSize = Math.max(112, Math.round(SCREEN_WIDTH * 0.28));
  const progressStroke = Math.max(10, Math.round(progressSize * 0.1));

  const showEmptySessions = !loading && monthlyActivities.length === 0;
  const showEmptyDaily = !loading && normalizedMonthlyDaily.length === 0;
  const isNextDisabled = useMemo(() => {
    const todayDate = new Date();
    return (
      currentMonth.getFullYear() > todayDate.getFullYear() ||
      (currentMonth.getFullYear() === todayDate.getFullYear() &&
        currentMonth.getMonth() >= todayDate.getMonth())
    );
  }, [currentMonth]);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handlePullToRefresh}
          tintColor={activityTheme.colors.accent}
        />
      }
    >
      <View style={styles.topSection}>
        <View style={styles.monthHeaderContainer}>
          <TouchableOpacity
            onPress={() => handleChangeMonth(-1)}
            style={styles.arrowButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.header}>{headerTitle}</Text>
            <Text style={styles.headerSub}>{headerSubtitle}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleChangeMonth(1)}
            style={[
              styles.arrowButton,
              isNextDisabled && styles.arrowButtonDisabled,
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={isNextDisabled}
          >
            <Text
              style={[
                styles.arrowText,
                isNextDisabled && styles.arrowTextDisabled,
              ]}
            >
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.summaryNotice}>
          오늘 러닝한 내용에 대해서만 집계돼요! (그냥 걸은 건 말구요!)
        </Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘 하루 요약</Text>
      </View>
      <View style={styles.summaryCard}>
        <View style={styles.summaryMetaRow}>
          <Text style={styles.summaryDateText}>{todayLabel}</Text>
        </View>
        <View style={styles.heroRow}>
          <View style={styles.progressWrapper}>
            <ProgressRing
              size={progressSize}
              strokeWidth={progressStroke}
              progress={progressValue}
              trackColor={activityTheme.colors.divider}
              progressColor={activityTheme.colors.accent}
            />
            <View style={styles.progressCenter}>
              <Text style={styles.progressValue}>
                {stepsValue.toLocaleString()}
              </Text>
              <Text style={styles.progressTarget}>
                {targetSteps > 0
                  ? `/ ${targetSteps.toLocaleString()} 걸음`
                  : '목표 미설정'}
              </Text>
            </View>
          </View>
          <View style={styles.heroMetrics}>
            <View style={styles.heroMetricRow}>
              <Text style={styles.heroMetricLabel}>거리</Text>
              <Text style={styles.heroMetricValue}>
                {distanceValue.toFixed(2)} km
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricRow}>
              <Text style={styles.heroMetricLabel}>칼로리</Text>
              <Text style={styles.heroMetricValue}>
                {burnValue.toLocaleString()} kcal
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.heroComment}>{progressComment}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 7일</Text>
      </View>
      <View style={styles.chartCard}>
        {chartData.labels.length === 0 || !hasWeeklySteps ? (
          <View style={styles.chartEmpty}>
            <Text style={styles.chartEmptyText}>
              이번 주 걸음 기록이 없어요.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.chartMetaRow}>
              <View style={styles.chartMetaItem}>
                <Text style={styles.chartMetaLabel}>주간 평균</Text>
                <Text style={styles.chartMetaValue}>
                  {weeklyStepStats.average.toLocaleString()}
                  <Text style={styles.chartMetaUnit}> 걸음</Text>
                </Text>
              </View>
              <View style={styles.chartMetaDivider} />
              <View style={styles.chartMetaItem}>
                <Text style={styles.chartMetaLabel}>최고</Text>
                <Text style={styles.chartMetaValue}>
                  {weeklyStepStats.max.toLocaleString()}
                  <Text style={styles.chartMetaUnit}> 걸음</Text>
                </Text>
              </View>
            </View>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={chartHeight}
              yAxisLabel=''
              yAxisSuffix=''
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withInnerLines
              withOuterLines={false}
              withShadow={false}
              fromZero
              segments={4}
              formatYLabel={formatStepLabel}
              chartConfig={chartConfig}
              bezier
              style={StyleSheet.flatten([
                styles.lineChartStyle,
                { marginTop: chartTopInset, paddingBottom: 1 },
              ])}
            />
          </>
        )}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>이달 기록</Text>
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setListTab('daily')}
            style={[
              styles.segmentedButton,
              listTab === 'daily' && styles.segmentedButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentedText,
                listTab === 'daily' && styles.segmentedTextActive,
              ]}
            >
              일별
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setListTab('sessions')}
            style={[
              styles.segmentedButton,
              listTab === 'sessions' && styles.segmentedButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentedText,
                listTab === 'sessions' && styles.segmentedTextActive,
              ]}
            >
              러닝별
            </Text>
          </Pressable>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator
          size='large'
          color={activityTheme.colors.accent}
          style={styles.loadingIndicator}
        />
      ) : listTab === 'daily' ? (
        <View key='monthly-daily-list'>
          {showEmptyDaily ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardTitle}>
                이달의 일별 기록이 없어요.
              </Text>
              <Text style={styles.emptyCardText}>
                오늘 러닝을 START 하면 자동으로 기록돼요.
              </Text>
            </View>
          ) : (
            normalizedMonthlyDaily.map((item) => (
              <View key={item.date} style={styles.listCard}>
                <View style={styles.listMarker} />
                <View style={styles.listTextColumn}>
                  <Text style={styles.listTitle}>
                    {formatDailyLabel(item.date)}
                  </Text>
                  <Text style={styles.listSubtitle}>
                    {(Number(item.distanceKm) || 0).toFixed(2)} km ·{' '}
                    {(Number(item.burnCalories) || 0).toLocaleString()} kcal
                  </Text>
                </View>
                <View style={styles.listRight}>
                  <Text style={[styles.listValue, styles.listValueAccent]}>
                    {(Number(item.steps) || 0).toLocaleString()} 걸음
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View key='monthly-session-list'>
          {showEmptySessions ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardTitle}>
                이달의 러닝기록이 없어요.
              </Text>
              <Text style={styles.emptyCardText}>
                메인 화면에서 러닝(START)을 시작하면 자동으로 기록돼요.
              </Text>
            </View>
          ) : (
            monthlyActivities.map((session) => (
              <SessionItem key={session.sessionId} session={session} />
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default ActivityPage;
