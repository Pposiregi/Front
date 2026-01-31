import { useNavigation } from '@react-navigation/native';
import chartConfig from '@utils/chartConfig';
import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {
  ActivityDetailNavigationProp,
  ChartData,
  GPS_SESSION,
  WeeklyStepItem,
} from '../../types/activity';
import { mock_data_by_month } from './mock';
import { styles } from '@styles/Activity.styles';
import { SCREEN_WIDTH } from '@styles/dimensions';
import { getMonthlySessions, getWeeklySteps } from '@api/activityApi';

function ActivityPage() {
  const navigation = useNavigation<ActivityDetailNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [monthlyActivities, setMonthlyActivities] = useState<GPS_SESSION[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [weeklySteps, setWeeklySteps] = useState<WeeklyStepItem[]>([]);

  const SessionItem = ({ session }: { session: GPS_SESSION }) => {
    const handlePress = () => {
      // ActivityDetailPage로 이동 시 세션 ID 전달
      navigation.navigate('ActivityDetailPage', {
        sessionId: session.sessionId,
      });
    };
    // 날짜 포매팅
    const formattedDate = new Date(session.startTime)
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
            {new Date(session.startTime).toLocaleTimeString([], options)} -
            {new Date(session.endTime).toLocaleTimeString([], options)}
          </Text>
        </View>
        <Text style={styles.distanceText}>
          *{session.totalDistance.toFixed(2)} km*
        </Text>
        <Text style={styles.detailLink}> &gt;</Text>
      </TouchableOpacity>
    );
  };

  // 월별 활동 기록을 가져오는 함수
  const fetchMonthlyActivities = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      //const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      // 현재는 목업 데이터 사용
      //const data = mock_data_by_month[monthKey] || [];

      // api 연결
      const data = await getMonthlySessions(year, month);
      console.log('raw session:', data[0]);
      // 데이터 로딩 구현
      // start_time을 기준으로 최신순 정렬
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
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

  // 주간 거리를 계산하고 그래프 데이터를 생성하는 함수
  const calculateWeeklyChart = () => {
    if (weeklySteps.length === 0) return;
    const labels = weeklySteps.map((item) =>
      item.date.substring(5).replace('-', '/')
    );
    const dataValues = weeklySteps.map((item) => item.step);
    setChartData({
      labels,
      datasets: [{ data: dataValues }],
    });
  };
  useEffect(() => {
    fetchMonthlyActivities(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    fetchWeeklySteps();
  }, []);

  useEffect(() => {
    if (weeklySteps.length > 0) {
      calculateWeeklyChart();
    }
  }, [weeklySteps]);

  const headerText = useMemo(() => {
    const month = currentMonth.getMonth() + 1;
    return `${month}월의 활동기록`;
  }, [currentMonth]);

  const fetchWeeklySteps = async () => {
    try {
      const response = await getWeeklySteps(); // userId 동적이면 본인 ID 넣기
      setWeeklySteps(response);
    } catch (err) {
      console.warn('주간 걸음수 fetch 실패', err);
    }
  };
  return (
    <View style={styles.container}>
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
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#007aff'
          style={styles.loadingIndicator}
        />
      ) : monthlyActivities.length === 0 ? (
        <Text style={styles.noActivityText}>
          {currentMonth.getMonth() + 1}월에는 활동 기록이 없습니다.
        </Text>
      ) : (
        monthlyActivities.map((session) => (
          <SessionItem key={session.sessionId} session={session} />
        ))
      )}

      {/* 주간 통계 차트 */}
      <View style={styles.chartCard}>
        {chartData.labels.length === 0 ? (
          <ActivityIndicator size='small' color='#555' />
        ) : (
          <View style={styles.chartMaskContainer}>
            <LineChart
              data={chartData}
              width={SCREEN_WIDTH}
              height={180}
              yAxisLabel=''
              yAxisSuffix=''
              withHorizontalLabels={false}
              withVerticalLabels={true}
              fromZero={true}
              chartConfig={chartConfig}
              bezier
              style={styles.lineChartShiftStyle}
            />
            <Text style={styles.chartTitle}>최근 7일 STEP</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default ActivityPage;
