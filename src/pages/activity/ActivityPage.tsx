import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {
  ActivityDetailNavigationProp,
  ChartData,
  DailyActivity,
  GPS_SESSION,
  WeeklyStepItem,
} from '../../types/activity';
import { styles } from '@styles/Activity.styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@styles/dimensions';
import { getDailyActivity, getWeeklySteps } from '@api/activityApi';
import { getUser } from '@api/mainApi';
import type { getUserResponse } from 'types/main';
import { mock_data_by_month } from './mock';

function ActivityPage() {
  const navigation = useNavigation<ActivityDetailNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [monthlyActivities, setMonthlyActivities] = useState<GPS_SESSION[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(
    null
  );
  const [dailyLoading, setDailyLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<getUserResponse | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [weeklySteps, setWeeklySteps] = useState<WeeklyStepItem[]>([]);

  const SessionItem = ({ session }: { session: GPS_SESSION }) => {
    const handlePress = () => {
      // ActivityDetailPage로 이동 시 세션 ID 전달
      navigation.navigate('ActivityDetailPage', {
        sessionId: session.session_id,
      });
    };

    // 날짜 포매팅
    const formattedDate = new Date(session.start_time)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '/');

    // 시간 포매팅 옵션
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
        <Text style={styles.indexText}>🚩</Text>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.timeText}>
            {new Date(session.start_time).toLocaleTimeString([], options)} -
            {new Date(session.end_time).toLocaleTimeString([], options)}
          </Text>
        </View>
        <Text style={styles.distanceText}>
          *{session.total_distance.toFixed(2)} km*
        </Text>
        <Text style={styles.detailLink}> &gt;</Text>
      </TouchableOpacity>
    );
  };

  // 월별 활동 기록을 가져오는 함수 (추후 API 호출 로직으로 대체 필요)
  const fetchMonthlyActivities = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const data = mock_data_by_month[monthKey] || [];

      // 데이터 로딩 구현
      // start_time을 기준으로 최신순 정렬
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      setMonthlyActivities(sortedData);
    } catch (err) {
      console.log('월별 활동 조회 실패', err);
      setMonthlyActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // 월 이동 핸들러 (MealPage의 로직 응용)
  const handleChangeMonth = (offset: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);

      // 현재 월이거나 미래 월일 경우 (오른쪽 화살표 사용 X)
      const today = new Date();
      if (
        offset === 1 &&
        (next.getFullYear() > today.getFullYear() ||
          (next.getFullYear() === today.getFullYear() &&
            next.getMonth() > today.getMonth()))
      ) {
        return prev;
      }
      return next;
    });
  };

  const fetchDailySummary = useCallback(async () => {
    setDailyLoading(true);
    try {
      const response = await getDailyActivity(today);
      setDailyActivity(response);
    } catch (err) {
      console.warn('오늘 활동 요약 fetch 실패', err);
      setDailyActivity(null);
    } finally {
      setDailyLoading(false);
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
    if (weeklySteps.length === 0) return;
    const labels = weeklySteps.map((item) =>
      item.date.substring(5).replace('-', '/')
    );
    const dataValues = weeklySteps.map((item) => item.step);
    setChartData({
      labels,
      datasets: [{ data: dataValues, strokeWidth: 3 }],
    });
  }, [weeklySteps]);

  useEffect(() => {
    fetchMonthlyActivities(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    fetchWeeklySteps();
    fetchDailySummary();
    fetchUserProfile();
  }, [fetchDailySummary, fetchUserProfile, fetchWeeklySteps]);

  useEffect(() => {
    if (weeklySteps.length > 0) {
      calculateWeeklyChart();
    }
  }, [calculateWeeklyChart, weeklySteps]);

  const headerText = useMemo(() => {
    const month = currentMonth.getMonth() + 1;
    return `${month}월의 활동기록`;
  }, [currentMonth]);

  const handleStartGps = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Main' as never);
      return;
    }
    Alert.alert('GPS 산책 시작', '메인 화면에서 산책을 시작해주세요.');
  };

  const handleRefreshToday = () => {
    fetchDailySummary();
    fetchWeeklySteps();
  };

  const stepsValue = dailyActivity?.steps ?? 0;
  const distanceValue = dailyActivity?.distanceKm ?? 0;
  const burnValue = dailyActivity?.burnCalories ?? 0;
  const targetSteps = userProfile?.targetStepCount ?? 0;

  const badgeInfo = useMemo(() => {
    if (targetSteps > 0 && stepsValue >= targetSteps) {
      return { label: '목표 달성', style: styles.badgeSuccess };
    }
    if (stepsValue <= 0) {
      return { label: '미달성', style: styles.badgeMuted };
    }
    return { label: '진행중', style: styles.badgeProgress };
  }, [stepsValue, targetSteps]);

  const showEmptyMonthly = !loading && monthlyActivities.length === 0;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.topSection, { minHeight: SCREEN_HEIGHT * 0.3 }]}>
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
        <View style={styles.ctaRow}>
          <TouchableOpacity
            onPress={handleStartGps}
            style={styles.ctaPrimary}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaPrimaryText}>GPS 산책 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRefreshToday}
            style={styles.ctaGhost}
            activeOpacity={0.8}
            disabled={dailyLoading}
          >
            <Text style={styles.ctaGhostText}>
              {dailyLoading ? '불러오는 중...' : '오늘 걸음수 불러오기'}
            </Text>
          </TouchableOpacity>
        </View>
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
          <SessionItem key={session.session_id} session={session} />
        ))
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 7일 걸음수</Text>
      </View>
      <View style={styles.chartCard}>
        {chartData.labels.length === 0 ? (
          <View style={styles.chartEmpty}>
            <Text style={styles.chartEmptyText}>
              이번 주 기록이 모이면 그래프가 채워져요.
            </Text>
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={SCREEN_WIDTH - 40}
            height={190}
            yAxisLabel=''
            yAxisSuffix=''
            withHorizontalLabels={false}
            withVerticalLabels
            fromZero
            chartConfig={{
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 145, 77, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForBackgroundLines: {
                stroke: '#E5E7EB',
                strokeDasharray: '0',
              },
              propsForDots: {
                r: '3',
                strokeWidth: '2',
                stroke: '#FFFFFF',
              },
            }}
            bezier
            style={styles.lineChartStyle}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default ActivityPage;
