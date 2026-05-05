import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { BarChart } from 'react-native-chart-kit';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import {
  ChartData,
  DailyActivity,
  GPS_SESSION,
  WeeklyStepItem,
} from '../../types/activity';
import ActivityCardSurface from './ActivityCardSurface';
import SessionItem from './SessionItem';
import { activityTheme, styles } from '@styles/Activity.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import {
  getMonthlySessions,
  getSessionDetail,
  getWeeklySteps,
} from '@api/activityApi';
import { getUser } from '@api/mainApi';
import { useSafeBottomSpacing } from '@hooks/useSafeBottomSpacing';
import { formatDateKey, parseDateKey, parseGpsDateTime } from '@utils/dateUtil';
import { formatDistanceFromKm } from '@utils/distanceFormat';
import type { getUserResponse } from 'types/main';

/**
 * 요일 라벨 (일요일 시작).
 */
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

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

const getWeekDateKeys = (baseDate: Date) => {
  const startOfWeek = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() - baseDate.getDay()
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return formatDateKey(date);
  });
};

const getInitialActivityMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 1);

const isSameMonth = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth();

const formatRunningSeconds = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainSeconds = safeSeconds % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}min`;
  }
  return `${remainSeconds}s`;
};

type MonthlyDailySessionSummary = {
  date: string;
  totalDistanceMeters: number;
  sessionCount: number;
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

const PawTitleIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox='0 0 22 22' fill='none'>
    <Circle cx={6.2} cy={6.6} r={2.4} fill={color} />
    <Circle cx={11} cy={5.2} r={2.4} fill={color} />
    <Circle cx={15.8} cy={6.6} r={2.4} fill={color} />
    <Ellipse cx={11} cy={13.6} rx={5} ry={4} fill={color} />
  </Svg>
);

const SectionTitle = ({
  children,
  iconTone = 'default',
}: {
  children: React.ReactNode;
  iconTone?: 'accent' | 'default';
}) => (
  <View style={styles.sectionTitleContent}>
    <View style={styles.sectionTitleIcon}>
      <PawTitleIcon
        color={
          iconTone === 'accent'
            ? activityTheme.colors.accentStrong
            : activityTheme.colors.textPrimary
        }
      />
    </View>
    <Text style={styles.sectionTitle}>{children}</Text>
  </View>
);

/**
 * 활동 기록 메인 화면.
 * - 오늘 요약, 최근 7일, 이달 기록(일별/활동별) 제공
 */
function ActivityPage() {
  const { contentBottomPadding } = useSafeBottomSpacing();
  const [loading, setLoading] = useState<boolean>(true);
  const today = useMemo(() => formatDateKey(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(getInitialActivityMonth);
  const [monthlyActivities, setMonthlyActivities] = useState<GPS_SESSION[]>([]);
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
  const [hiddenSessionIds, setHiddenSessionIds] = useState<Set<number>>(
    () => new Set()
  );
  const chartPadding = activityTheme.spacing.lg;
  const contentPadding = activityTheme.spacing.xl;
  const chartWidth = SCREEN_WIDTH - contentPadding * 2 - chartPadding * 2;
  const chartHeight = Math.round(SCREEN_HEIGHT * 0.2);
  const chartTopInset = Math.round(chartPadding * 0.85);
  const selectedMonthKey = useMemo(
    () =>
      `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1
      ).padStart(2, '0')}`,
    [currentMonth]
  );
  const currentWeekDateKeys = useMemo(() => getWeekDateKeys(new Date()), []);
  const scrollContentStyle = useMemo(
    () => [
      styles.contentContainer,
      // 앱 하단 탭바와 Android 3버튼 내비게이션 영역 위까지 마지막 컨텐츠가 올라오도록 보정한다.
      { paddingBottom: contentBottomPadding },
    ],
    [contentBottomPadding]
  );

  const normalizedWeeklySteps = useMemo(
    () => {
      const stepsByDate = new Map<string, number>();

      weeklySteps.forEach((item) => {
        if (!item.date) return;
        const dateKey = item.date.slice(0, 10);
        const prev = stepsByDate.get(dateKey) ?? 0;
        stepsByDate.set(dateKey, prev + (Number(item.step) || 0));
      });

      return currentWeekDateKeys.map((date) => ({
        date,
        step: stepsByDate.get(date) ?? 0,
      }));
    },
    [currentWeekDateKeys, weeklySteps]
  );

  const hasWeeklySteps = normalizedWeeklySteps.some((item) => item.step > 0);

  const normalizedMonthlyDaily = useMemo(() => {
    const byDate = new Map<string, MonthlyDailySessionSummary>();

    monthlyActivities.forEach((session) => {
      if (!session.startTime) return;
      // 서버가 timezone 없는 UTC 문자열을 줄 수 있어 GPS 전용 파서로 일자를 맞춘다.
      const dayKey = formatDateKey(parseGpsDateTime(session.startTime));
      const totalDistanceMeters = Number(session.totalDistance) || 0;

      const prev = byDate.get(dayKey);
      if (!prev) {
        byDate.set(dayKey, {
          date: dayKey,
          totalDistanceMeters,
          sessionCount: 1,
        });
        return;
      }

      byDate.set(dayKey, {
        date: dayKey,
        totalDistanceMeters: prev.totalDistanceMeters + totalDistanceMeters,
        sessionCount: prev.sessionCount + 1,
      });
    });

    return [...byDate.values()].sort(
      (a, b) => parseDateKey(b.date).getTime() - parseDateKey(a.date).getTime()
    );
  }, [monthlyActivities]);

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
      backgroundGradientFromOpacity: 0,
      backgroundGradientToOpacity: 0,
      decimalPlaces: 0,
      color: (opacity = 1) => toRgba(activityTheme.colors.accent, opacity),
      labelColor: (opacity = 1) =>
        toRgba(activityTheme.colors.textSecondary, opacity),
      propsForBackgroundLines: {
        stroke: activityTheme.colors.divider,
        strokeDasharray: '0',
      },
      barPercentage: 0.58,
      barRadius: 5,
      useShadowColorFromDataset: false,
    }),
    [toRgba]
  );

  /**
   * 월간 GPS 세션 리스트
   */
  const fetchMonthlySessions = useCallback(async (date: Date) => {
    try {
      setMonthlyActivities([]);
      setHiddenSessionIds(new Set());
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const data = await getMonthlySessions(year, month);

      // startTime을 기준으로 최신순 정렬한다. timezone 없는 응답도 UTC 기준으로 해석한다.
      const sortedData = [...data].sort(
        (a, b) =>
          parseGpsDateTime(b.startTime).getTime() -
          parseGpsDateTime(a.startTime).getTime()
      );
      setMonthlyActivities(sortedData);
    } catch (err) {
      console.log('>>> 월별 활동 조회 실패', err);
      setMonthlyActivities([]);
    }
  }, []);

  /**
   * 월간 데이터(세션/일별)를 동시에 갱신한다.
   */
  const fetchMonthlyBundle = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        await fetchMonthlySessions(date);
      } finally {
        setLoading(false);
      }
    },
    [fetchMonthlySessions]
  );

  /**
   * 월 이동 핸들러.
   * - 미래 월로는 이동하지 않는다.
   */
  const handleChangeMonth = useCallback(
    (offset: number) => {
      const next = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + offset,
        1
      );

      // 현재 월이거나 미래 월일 경우 (오른쪽 화살표 사용 X)
      const todayDate = new Date();
      if (
        offset === 1 &&
        (next.getFullYear() > todayDate.getFullYear() ||
          (next.getFullYear() === todayDate.getFullYear() &&
            next.getMonth() > todayDate.getMonth()))
      ) {
        return;
      }

      setCurrentMonth(next);
      fetchMonthlyBundle(next);
    },
    [currentMonth, fetchMonthlyBundle]
  );

  /**
   * 오늘의 활동 요약
   */
  const fetchDailySummary = useCallback(async () => {
    try {
      const todayDate = parseDateKey(today);
      const monthSessions = await getMonthlySessions(
        todayDate.getFullYear(),
        todayDate.getMonth() + 1
      );
      const todaySessions = monthSessions.filter((session) => {
        // 오늘 요약도 러닝별 리스트와 같은 시간 해석 규칙을 사용한다.
        return formatDateKey(parseGpsDateTime(session.startTime)) === today;
      });

      if (todaySessions.length === 0) {
        setDailyActivity({
          date: today,
          steps: 0,
          distanceKm: 0,
          burnCalories: 0,
          runningSeconds: 0,
        });
        return;
      }

      const aggregated: DailyActivity = {
        date: today,
        steps: 0,
        distanceKm: 0,
        burnCalories: 0,
        runningSeconds: 0,
      };

      // 세션 상세는 서로 독립적이므로 병렬 조회하고, 일부 실패해도 가능한 값은 합산한다.
      const detailResults = await Promise.allSettled(
        todaySessions.map((session) => getSessionDetail(session.sessionId))
      );

      detailResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const detail = result.value;
          aggregated.steps += Math.max(0, Number(detail.stepCount) || 0);
          aggregated.distanceKm +=
            Math.max(0, Number(detail.totalDistance) || 0) / 1000;
          aggregated.burnCalories += Math.max(
            0,
            Number(detail.burnCalories) || 0
          );
          const startDate = parseGpsDateTime(detail.startTime);
          const endDate = detail.endTime
            ? parseGpsDateTime(detail.endTime)
            : startDate;
          aggregated.runningSeconds =
            (aggregated.runningSeconds ?? 0) +
            Math.max(
              0,
              Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
            );
          return;
        }

        console.warn(
          '[Activity] 세션 상세 조회 실패',
          todaySessions[index]?.sessionId,
          result.reason
        );
      });

      if (__DEV__) {
        console.log(
          '>>> [Activity] daily summary',
          JSON.stringify(
            {
              date: today,
              sessionCount: todaySessions.length,
              aggregated,
            },
            null,
            0
          )
        );
      }

      setDailyActivity(aggregated);
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
    const maxValue = Math.max(...dataValues);
    setChartData({
      labels,
      datasets: [
        {
          data: dataValues,
          colors: dataValues.map(
            (value) =>
              (opacity = 1) =>
                value === maxValue && value > 0
                  ? toRgba(activityTheme.colors.accent, opacity)
                  : toRgba(activityTheme.colors.divider, opacity)
          ),
        },
      ],
    });
  }, [normalizedWeeklySteps, toRgba]);

  useFocusEffect(
    useCallback(() => {
      const initialMonth = getInitialActivityMonth();

      setCurrentMonth((prev) =>
        isSameMonth(prev, initialMonth) ? prev : initialMonth
      );
      setListTab('daily');
      setHiddenSessionIds(new Set());
      fetchMonthlyBundle(initialMonth);
      fetchWeeklySteps();
      fetchDailySummary();
      fetchUserProfile();
    }, [
      fetchDailySummary,
      fetchMonthlyBundle,
      fetchUserProfile,
      fetchWeeklySteps,
    ])
  );

  useEffect(() => {
    calculateWeeklyChart();
  }, [calculateWeeklyChart]);

  const headerTitle = '통계';
  const monthlySectionTitle = useMemo(
    () => `${currentMonth.getMonth() + 1}월의 러닝들`,
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

  // 서버 기록은 지우지 않고, 현재 러닝별 목록에서만 임시로 숨긴다.
  const handleHideSession = useCallback((sessionId: number) => {
    setHiddenSessionIds((prev) => {
      const next = new Set(prev);
      next.add(sessionId);
      return next;
    });
  }, []);

  // 숨긴 항목을 초기화하고 서버의 현재 월 기록을 다시 받아온다.
  const handleReloadAllSessions = useCallback(async () => {
    setHiddenSessionIds(new Set());
    await fetchMonthlyBundle(currentMonth);
  }, [currentMonth, fetchMonthlyBundle]);

  const stepsValue = dailyActivity?.steps ?? 0;
  const distanceValue = dailyActivity?.distanceKm ?? 0;
  // 일일 요약은 km 응답을 받아 공통 규칙(1000m 미만 m, 이상 km)으로 표시한다.
  const distanceLabel = formatDistanceFromKm(distanceValue);
  const burnValue = dailyActivity?.burnCalories ?? 0;
  const runningSecondsValue = dailyActivity?.runningSeconds ?? 0;
  const runningTimeLabel = formatRunningSeconds(runningSecondsValue);
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
        return '오늘의 첫 러닝을 시작해봐요!';
      }
      return `오늘은 목표까지 ${Math.max(
        0,
        remainingSteps
      ).toLocaleString()} step 남았어요.`;
    }
    if (stepsValue <= 0) {
      return '오늘의 첫 러닝을 시작해봐요!';
    }
    return '오늘도 잘 걷고 있어요.';
  }, [remainingSteps, stepsValue, targetSteps]);

  const progressSize = Math.max(112, Math.round(SCREEN_WIDTH * 0.28));
  const progressStroke = Math.max(10, Math.round(progressSize * 0.1));

  const visibleMonthlyActivities = useMemo(
    () =>
      monthlyActivities.filter(
        (session) => !hiddenSessionIds.has(session.sessionId)
      ),
    [hiddenSessionIds, monthlyActivities]
  );
  // 복구 버튼은 사용자가 x로 숨긴 기록이 있을 때만 노출한다.
  const hasHiddenSessions = hiddenSessionIds.size > 0;
  const showEmptySessions = !loading && visibleMonthlyActivities.length === 0;
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
      contentContainerStyle={scrollContentStyle}
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
        <Text style={styles.header}>{headerTitle}</Text>
        <Text style={styles.summaryNotice}>우리가 얼마나 걷고 달렸을까요?</Text>
      </View>
      <View style={styles.sectionHeader}>
        <SectionTitle iconTone='accent'>오늘의 러닝</SectionTitle>
      </View>
      <View style={styles.summaryCard}>
        <ActivityCardSurface />
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
              <Text style={styles.progressTarget}>step</Text>
            </View>
          </View>
          <View style={styles.heroMetrics}>
            <View style={styles.heroMetricRow}>
              <Text style={styles.heroMetricLabel}>거리</Text>
              <Text style={styles.heroMetricValue}>
                {distanceLabel.value} {distanceLabel.unit}
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricRow}>
              <Text style={styles.heroMetricLabel}>러닝 시간</Text>
              <Text style={styles.heroMetricValue}>{runningTimeLabel}</Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricRow}>
              <Text style={styles.heroMetricLabel}>소비 열량</Text>
              <Text style={styles.heroMetricValue}>
                {burnValue.toLocaleString()} kcal
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.heroComment}>{progressComment}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <SectionTitle>이번 주 걸음 수</SectionTitle>
      </View>
      <View style={styles.chartCard}>
        <ActivityCardSurface />
        {chartData.labels.length === 0 || !hasWeeklySteps ? (
          <View style={styles.chartEmpty}>
            <Text style={styles.chartEmptyText}>
              이번 주 step 기록이 없어요.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.chartMetaRow}>
              <View style={styles.chartMetaItem}>
                <Text style={styles.chartMetaLabel}>주간 평균</Text>
                <Text style={styles.chartMetaValue}>
                  {weeklyStepStats.average.toLocaleString()}
                  <Text style={styles.chartMetaUnit}> step</Text>
                </Text>
              </View>
              <View style={[styles.chartMetaItem, styles.chartMetaItemAccent]}>
                <Text
                  style={[styles.chartMetaLabel, styles.chartMetaLabelAccent]}
                >
                  최고
                </Text>
                <Text
                  style={[styles.chartMetaValue, styles.chartMetaValueAccent]}
                >
                  {weeklyStepStats.max.toLocaleString()}
                  <Text
                    style={[styles.chartMetaUnit, styles.chartMetaUnitAccent]}
                  >
                    {' '}
                    step
                  </Text>
                </Text>
              </View>
            </View>
            <BarChart
              data={chartData}
              width={chartWidth}
              height={chartHeight}
              yAxisLabel=''
              yAxisSuffix=''
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withInnerLines
              fromZero
              segments={4}
              showBarTops={false}
              withCustomBarColorFromData
              flatColor
              chartConfig={chartConfig}
              style={StyleSheet.flatten([
                styles.barChartStyle,
                { marginTop: chartTopInset, paddingBottom: 1 },
              ])}
            />
          </>
        )}
      </View>

      <View style={styles.monthlySectionHeader}>
        <SectionTitle>{monthlySectionTitle}</SectionTitle>
      </View>
      <View style={styles.monthlyControlsRow}>
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
        <View style={styles.monthSwitcher}>
          <TouchableOpacity
            onPress={() => handleChangeMonth(-1)}
            style={styles.monthSwitchButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole='button'
            accessibilityLabel='이전 달 러닝 보기'
          >
            <Text style={styles.monthSwitchText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeMonth(1)}
            style={[
              styles.monthSwitchButton,
              isNextDisabled && styles.arrowButtonDisabled,
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={isNextDisabled}
            accessibilityRole='button'
            accessibilityLabel='다음 달 러닝 보기'
          >
            <Text
              style={[
                styles.monthSwitchText,
                isNextDisabled && styles.arrowTextDisabled,
              ]}
            >
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 러닝별에서 숨긴 항목이 있을 때만 전체 기록 복구 액션을 보여준다. */}
      {listTab === 'sessions' && hasHiddenSessions ? (
        <View style={styles.sessionReloadRow}>
          <Pressable
            accessibilityRole='button'
            onPress={handleReloadAllSessions}
            style={({ pressed }) => [
              styles.sessionReloadButton,
              pressed && styles.sessionReloadButtonPressed,
            ]}
          >
            <Text style={styles.sessionReloadText}>전체 기록 불러오기</Text>
          </Pressable>
        </View>
      ) : null}
      {loading ? (
        <ActivityIndicator
          size='large'
          color={activityTheme.colors.accent}
          style={styles.loadingIndicator}
        />
      ) : listTab === 'daily' ? (
        <View key={`${selectedMonthKey}-monthly-daily-list`}>
          {showEmptyDaily ? (
            <View style={styles.emptyCard}>
              <ActivityCardSurface />
              <Text style={styles.emptyCardTitle}>
                이달의 일별 기록이 없어요.
              </Text>
              <Text style={styles.emptyCardText}>
                오늘 러닝을 START 하면 자동으로 기록돼요.
              </Text>
            </View>
          ) : (
            normalizedMonthlyDaily.map((item) => {
              const itemDistanceLabel = formatDistanceFromKm(
                (Number(item.totalDistanceMeters) || 0) / 1000
              );
              return (
                <View key={item.date} style={styles.listCard}>
                  <ActivityCardSurface />
                  <View style={styles.listMarker} />
                  <View style={styles.listTextColumn}>
                    <Text style={styles.listTitle}>
                      {formatDailyLabel(item.date)}
                    </Text>
                    <Text style={styles.listSubtitle}>
                      러닝 {item.sessionCount}회
                    </Text>
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
                        {itemDistanceLabel.value}
                      </Text>
                      <Text style={styles.listValueUnit}>
                        {itemDistanceLabel.unit}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      ) : (
        <View key={`${selectedMonthKey}-monthly-session-list`}>
          {showEmptySessions ? (
            <View style={styles.emptyCard}>
              <ActivityCardSurface />
              <Text style={styles.emptyCardTitle}>
                이달의 러닝기록이 없어요.
              </Text>
              <Text style={styles.emptyCardText}>
                메인 화면에서 러닝(START)을 시작하면 자동으로 기록돼요.
              </Text>
            </View>
          ) : (
            visibleMonthlyActivities.map((session) => (
              <SessionItem
                key={session.sessionId}
                session={session}
                onDelete={handleHideSession}
              />
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default ActivityPage;
