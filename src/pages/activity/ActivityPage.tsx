import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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
  getDailyActivity,
  getMonthlySessions,
  getWeeklySteps,
} from '@api/activityApi';
import { getUser } from '@api/mainApi';
import type { getUserResponse } from 'types/main';

function ActivityPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
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

  const formatStepLabel = useCallback((value: string) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return value;
    }
    const rounded = Math.round(numeric / 1000) * 1000;
    return Math.max(0, rounded).toLocaleString();
  }, []);

  // 월별 활동 기록을 가져오는 함수
  const fetchMonthlyActivities = useCallback(async (date: Date) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  // 월 이동 핸들러 (MealPage의 로직 응용)
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

  const fetchDailySummary = useCallback(async () => {
    try {
      const response = await getDailyActivity(today);
      setDailyActivity(response);
    } catch (err) {
      console.warn('오늘 활동 요약 fetch 실패', err);
      setDailyActivity(null);
    }
  }, [today]);

  const fetchWeeklySteps = useCallback(async () => {
    try {
      const response = await getWeeklySteps();
      setWeeklySteps(response);
    } catch (err) {
      console.warn('주간 걸음수 fetch 실패', err);
      setWeeklySteps([]);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await getUser();
      setUserProfile(response);
    } catch (err) {
      console.warn('유저 정보 fetch 실패', err);
      setUserProfile(null);
    }
  }, []);

  // 주간 걸음을 계산하고 그래프 데이터를 생성하는 함수
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
    fetchMonthlyActivities(currentMonth);
  }, [currentMonth, fetchMonthlyActivities]);

  useEffect(() => {
    fetchWeeklySteps();
    fetchDailySummary();
    fetchUserProfile();
  }, [fetchDailySummary, fetchUserProfile, fetchWeeklySteps]);

  useEffect(() => {
    calculateWeeklyChart();
  }, [calculateWeeklyChart]);

  const headerText = useMemo(() => {
    const month = currentMonth.getMonth() + 1;
    return `${month}월의 활동기록`;
  }, [currentMonth]);

  const handlePullToRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDailySummary(),
        fetchWeeklySteps(),
        fetchMonthlyActivities(currentMonth),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [
    currentMonth,
    fetchDailySummary,
    fetchMonthlyActivities,
    fetchWeeklySteps,
  ]);

  const stepsValue = dailyActivity?.steps ?? 0;
  const distanceValue = dailyActivity?.distanceKm ?? 0;
  const burnValue = dailyActivity?.burnCalories ?? 0;
  const targetSteps = userProfile?.targetStepCount ?? 0;

  const badgeInfo = useMemo(() => {
    if (targetSteps > 0) {
      if (stepsValue >= targetSteps) {
        return { label: '목표 달성', style: styles.badgeSuccess };
      }
      if (stepsValue <= 0) {
        return { label: '걸음 목표 미달', style: styles.badgeMuted };
      }
      return { label: '진행중', style: styles.badgeProgress };
    }
    if (stepsValue <= 0) {
      return { label: '오늘 걸음 없음', style: styles.badgeMuted };
    }
    return { label: '진행중', style: styles.badgeProgress };
  }, [stepsValue, targetSteps]);

  const showEmptyMonthly = !loading && monthlyActivities.length === 0;
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

          <Text style={styles.header}>{headerText}</Text>

          <TouchableOpacity
            onPress={() => handleChangeMonth(1)}
            style={styles.arrowButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        {showEmptyMonthly && (
          <Text style={styles.subHeaderText}>이번 달 첫 기록을 만들어보자</Text>
        )}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>오늘 요약</Text>
              <Text style={styles.summaryDateText}>{today}</Text>
            </View>
            <View style={[styles.badge, badgeInfo.style]}>
              <Text style={styles.badgeText}>{badgeInfo.label}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>걸음수</Text>
              <Text style={styles.summaryValue}>
                {stepsValue.toLocaleString()}
              </Text>
              <Text style={styles.summaryUnit}>걸음</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>거리</Text>
              <Text style={styles.summaryValue}>
                {distanceValue.toFixed(2)}
              </Text>
              <Text style={styles.summaryUnit}>km</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>소모 칼로리</Text>
              <Text style={styles.summaryValue}>
                {burnValue.toLocaleString()}
              </Text>
              <Text style={styles.summaryUnit}>kcal</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 7일 걸음수</Text>
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
              withVerticalLabels
              withInnerLines
              withOuterLines={false}
              withShadow={false}
              fromZero
              segments={2}
              formatYLabel={formatStepLabel}
              chartConfig={chartConfig}
              bezier
              style={StyleSheet.flatten([
                styles.lineChartStyle,
                { marginTop: chartTopInset },
              ])}
            />
          </>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>이번 달 기록</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#A5B4FC'
          style={styles.loadingIndicator}
        />
      ) : showEmptyMonthly ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardTitle}>
            이번 달 첫 기록을 만들어보자
          </Text>
          <Text style={styles.emptyCardText}>
            메인 화면에서 산책을 시작하면 자동으로 기록돼요.
          </Text>
        </View>
      ) : (
        monthlyActivities.map((session) => (
          <SessionItem key={session.sessionId} session={session} />
        ))
      )}
    </ScrollView>
  );
}

export default ActivityPage;
