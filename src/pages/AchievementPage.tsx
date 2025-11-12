import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  FlatList,
  Modal,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { MapOverlayPolyline } from '@components/MapOverlayPolyline';
import styles from '@styles/Mission.styles';

// 타입 정의
type MissionData = {
  date: string;
  distanceKm: number;
  burnCalories: number;
  step: number;
};

type Meal = {
  mealId: string;
  title: string;
  imageUri: ImageSourcePropType; // 후에는 url로 교체
  kcal: number;
};

type Badge = {
  badgeId: number;
  title: string;
  type: 'STEP' | 'RUN' | 'MISSION' | 'ATTENDANCE' | 'EAT_KCAL';
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  iconUrl: ImageSourcePropType; // require 또는 URL
  createdAt: string;
};

// 목업 date에 쓰이는 오늘 기준 지난 7일 계산
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// 목업 데이터
const mockWeeklyMissionData: MissionData[] = [
  { date: getDateString(6), distanceKm: 6.42, burnCalories: 246, step: 8900 },
  { date: getDateString(5), distanceKm: 1.6, burnCalories: 61, step: 2225 },
  { date: getDateString(4), distanceKm: 3.21, burnCalories: 123, step: 4450 },
  { date: getDateString(3), distanceKm: 6.42, burnCalories: 246, step: 8900 },
  { date: getDateString(2), distanceKm: 1.6, burnCalories: 61, step: 2225 },
  { date: getDateString(1), distanceKm: 3.21, burnCalories: 123, step: 4450 },
  { date: getDateString(0), distanceKm: 3.21, burnCalories: 123, step: 8900 },
];

const mockMeals: Meal[] = [
  {
    mealId: '1',
    title: '연어 포케',
    imageUri: require('../assets/images/mock_rice_1.png'),
    kcal: 321,
  },
  {
    mealId: '2',
    title: '닭가슴살 샐러드',
    imageUri: require('../assets/images/mock_rice_2.png'),
    kcal: 287,
  },
];

const mockBadges: Badge[] = [
  {
    badgeId: 1,
    title: '최초 10000보 달성',
    type: 'STEP',
    tier: 'BRONZE',
    iconUrl: require('../assets/images/step_bronze.png'),
    createdAt: '2025-10-10T12:34:56Z',
  },
  {
    badgeId: 2,
    title: '주간 100000보 달성',
    type: 'MISSION',
    tier: 'GOLD',
    iconUrl: require('../assets/images/mission_gold.png'),
    createdAt: '2025-10-12T09:00:00Z',
  },
];

type ItemModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageUri: ImageSourcePropType;
  extraText?: string;
};

// 모달 통합
const ItemModal = ({
  visible,
  onClose,
  title,
  imageUri,
  extraText,
}: ItemModalProps) => (
  <Modal
    visible={visible}
    transparent
    animationType='fade'
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalBackground}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        <Image
          source={imageUri}
          style={styles.fullScreenImage}
          resizeMode='contain'
        />
        <Text style={styles.modalTitleText}>{title}</Text>
        {extraText && <Text style={{ textAlign: 'center' }}>{extraText}</Text>}
      </View>
    </TouchableOpacity>
  </Modal>
);

function AchievementPage() {
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyDistance, setWeeklyDistance] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const mapRef = useRef<MapView | null>(null);
  const [isToday, setIsToday] = useState<boolean>(false);
  // 오늘 날짜 (yyyy-mm-dd)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 목업 데이터를 불러오는 것처럼 시뮬레이션
    setTimeout(() => {
      setMissionData(mockWeeklyMissionData[mockWeeklyMissionData.length - 1]);
      setTodayMeals(mockMeals);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (missionData) {
      setIsToday(missionData.date === today);
    }
  }, [missionData]);
  // 더미 경로 데이터 (DB에서 불러온다고 가정)
  const dummyPath = [
    { latitude: 35.1516, longitude: 128.9976 },
    { latitude: 35.1498, longitude: 128.998 },
    { latitude: 35.1485, longitude: 128.9984 },
    { latitude: 35.1483, longitude: 129.0018 },
    { latitude: 35.1485, longitude: 129.0035 },
    { latitude: 35.1505, longitude: 129.0033 },
    { latitude: 35.152, longitude: 129.0031 },
    { latitude: 35.1521, longitude: 129.001 },
    { latitude: 35.152, longitude: 128.9987 },
  ];
  // 경로 중 가운데 지점을 계산
  const getCenter = (
    coordinates: { latitude: number; longitude: number }[]
  ) => {
    const lats = coordinates.map((c) => c.latitude);
    const lons = coordinates.map((c) => c.longitude);
    const latitude = (Math.min(...lats) + Math.max(...lats)) / 2;
    const longitude = (Math.min(...lons) + Math.max(...lons)) / 2;
    const latitudeDelta = Math.max(...lats) - Math.min(...lats) + 0.002;
    const longitudeDelta = Math.max(...lons) - Math.min(...lons) + 0.002;
    return { latitude, longitude, latitudeDelta, longitudeDelta };
  };
  // 가운데 지점
  const CENTER_REGION = getCenter(dummyPath);

  // 각 데이터를 다 받아오면 로딩을 끝내고 화면 이동
  useEffect(() => {
    if (!loading && mapRef.current && dummyPath.length > 0) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(CENTER_REGION, 0);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, CENTER_REGION]);

  // 모달 관련 상태 추가
  const [isMealModalVisible, setIsMealModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // 이미지 클릭 핸들러
  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsMealModalVisible(true);
  };

  const handleBadgePress = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsBadgeModalVisible(true);
  };

  // 로딩중~~
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#777' />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  const HeaderContent = () => (
    <View>
      {/* 뱃지 카드 섹션  */}
      <View style={styles.badgeCard}>
        <View>
          <Text style={styles.badgeTitle}>나의 뱃지 목록</Text>
        </View>
        <FlatList
          data={mockBadges}
          numColumns={5}
          keyExtractor={(item) => item.badgeId.toString()}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.badgeItem}
              onPress={() => handleBadgePress(item)}
            >
              <Image source={item.iconUrl} style={styles.badgeIcon} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
  // scrollView와 FlatList를 동시에 쓰면 문제가 있을 수 있다고 하여 FlatList만을 사용하여 스크롤 구현
  return (
    <View>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={HeaderContent} // 여기에 UI를 넣어줌
        keyExtractor={() => 'header'}
      />

      {/* 모달 */}
      {/* {selectedMeal && (
        <ItemModal
          visible={isMealModalVisible}
          onClose={() => setIsMealModalVisible(false)}
          title={selectedMeal.title}
          imageUri={selectedMeal.imageUri}
          extraText={`${selectedMeal.kcal} kcal`}
        />
      )} */}
      {selectedBadge && (
        <ItemModal
          visible={isBadgeModalVisible}
          onClose={() => setIsBadgeModalVisible(false)}
          title={selectedBadge.title}
          imageUri={selectedBadge.iconUrl}
          extraText={`${selectedBadge.type} / ${selectedBadge.tier}\n${new Date(
            selectedBadge.createdAt
          ).toLocaleDateString()}`}
        />
      )}
    </View>
  );
}

export default AchievementPage;
