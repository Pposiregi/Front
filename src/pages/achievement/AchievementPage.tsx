import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ImageSourcePropType,
  Modal,
} from 'react-native';
import styles from '@styles/Achievement.styles';

// ====================
// 타입 정의
// ====================
type Badge = {
  badgeId: number;
  title: string;
  type: 'STEP' | 'RUN' | 'MISSION' | 'ATTENDANCE' | 'EAT_KCAL';
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  iconUrl: ImageSourcePropType;
  createdAt: string;
};

type MissionData = {
  missionId: number;
  title: string;
  progress: number; // 0~100
};

type RankingItem = {
  userId: number;
  nickname: string;
  dailyStepCount: number;
};

type RankingData = {
  top10: RankingItem[];
  myRank: number;
};

// ====================
// 목업 데이터
// ====================
const mockBadges: Badge[] = [
  {
    badgeId: 1,
    title: '최초 10000보 달성',
    type: 'STEP',
    tier: 'BRONZE',
    iconUrl: require('../../assets/images/step_bronze.png'),
    createdAt: '2025-10-10T12:34:56Z',
  },
  {
    badgeId: 2,
    title: '주간 100000보 달성',
    type: 'MISSION',
    tier: 'GOLD',
    iconUrl: require('../../assets/images/mission_gold.png'),
    createdAt: '2025-10-12T09:00:00Z',
  },
];

const mockMissions: MissionData[] = [
  { missionId: 1, title: '오늘 5000보 걷기', progress: 80 },
  { missionId: 2, title: '주간 10km 달리기', progress: 50 },
  { missionId: 3, title: '칼로리 500kcal 소모', progress: 100 },
];

// 랭킹 데이터 목업
const mockRankingAll: RankingData = {
  top10: [
    { userId: 1, nickname: 'Alice', dailyStepCount: 20000 },
    { userId: 2, nickname: 'Bob', dailyStepCount: 19000 },
    { userId: 3, nickname: 'Charlie', dailyStepCount: 18000 },
    { userId: 4, nickname: 'Diana', dailyStepCount: 17500 },
    { userId: 5, nickname: 'Eve', dailyStepCount: 17000 },
    { userId: 6, nickname: 'Frank', dailyStepCount: 16500 },
    { userId: 7, nickname: 'Grace', dailyStepCount: 16000 },
    { userId: 8, nickname: 'Hank', dailyStepCount: 15500 },
    { userId: 9, nickname: 'Ivy', dailyStepCount: 15000 },
    { userId: 10, nickname: 'Jack', dailyStepCount: 14500 },
  ],
  myRank: 13,
};

// 전체/남/여 임시 복사본
const mockRankingMale: RankingData = JSON.parse(JSON.stringify(mockRankingAll));
const mockRankingFemale: RankingData = JSON.parse(
  JSON.stringify(mockRankingAll)
);

// ====================
// 모달 컴포넌트
// ====================
type ItemModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageUri: ImageSourcePropType;
  extraText?: string;
};

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

// ====================
// 메인 페이지
// ====================
function AchievementPage() {
  const [loading, setLoading] = useState(false);

  // 상단 탭 분리 초기는 RANKING
  const [activeTab, setActiveTab] = useState<'RANKING' | 'MISSION' | 'BADGE'>(
    'RANKING'
  );

  // RANKING 정렬 필터
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);

  // 뱃지 모달
  const handleBadgePress = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsBadgeModalVisible(true);
  };

  // ====================
  // 상단 탭 UI
  // ====================
  const TabHeader = () => (
    <View style={styles.tabHeaderContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'RANKING' && styles.activeTab]}
        onPress={() => setActiveTab('RANKING')}
      >
        <Text style={styles.tabText}>랭킹</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'MISSION' && styles.activeTab]}
        onPress={() => setActiveTab('MISSION')}
      >
        <Text style={styles.tabText}>달성 미션</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'BADGE' && styles.activeTab]}
        onPress={() => setActiveTab('BADGE')}
      >
        <Text style={styles.tabText}>획득한 뱃지</Text>
      </TouchableOpacity>
    </View>
  );

  // ====================
  // 화면별 렌더링
  // ====================
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'RANKING':
        const rankingData = (() => {
          switch (rankingFilter) {
            case 'ALL':
              return mockRankingAll;
            case 'MALE':
              return mockRankingMale;
            case 'FEMALE':
              return mockRankingFemale;
          }
        })();

        return (
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            {/* 필터 버튼 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 10,
              }}
            >
              {['ALL', 'MALE', 'FEMALE'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() =>
                    setRankingFilter(filter as 'ALL' | 'MALE' | 'FEMALE')
                  }
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginHorizontal: 4,
                    borderRadius: 8,
                    backgroundColor:
                      rankingFilter === filter ? '#007AFF' : '#EEE',
                  }}
                >
                  <Text
                    style={{
                      color: rankingFilter === filter ? '#FFF' : '#000',
                    }}
                  >
                    {filter === 'ALL'
                      ? '전체'
                      : filter === 'MALE'
                      ? '남자'
                      : '여자'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* top10 리스트 */}
            <FlatList
              data={rankingData.top10}
              keyExtractor={(item) => item.userId.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.listItem}>
                  <Text style={styles.rankingNumberText}>{index + 1}</Text>
                  <View style={styles.rankingNameScoreContainer}>
                    <Text style={styles.listItemText}>{item.nickname}</Text>
                    <Text style={styles.listItemText}>
                      {item.dailyStepCount}보
                    </Text>
                  </View>
                </View>
              )}
            />

            {/* 나의 순위 */}
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              나의 순위: {rankingData.myRank}위
            </Text>
          </View>
        );

      case 'MISSION':
        return (
          <View style={{ flex: 1 }}>
            <FlatList
              data={mockMissions}
              keyExtractor={(item) => item.missionId.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item.title}</Text>
                  <Text style={styles.listItemText}>{item.progress}%</Text>
                </View>
              )}
            />
          </View>
        );

      case 'BADGE':
        return (
          <View>
            <View style={styles.badgeCard}>
              <Text style={styles.badgeTitle}>나의 뱃지 목록</Text>
              <FlatList
                data={mockBadges}
                numColumns={5}
                keyExtractor={(item) => item.badgeId.toString()}
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
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#777' />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TabHeader />
      <View style={{ flex: 1 }}>{renderActiveScreen()}</View>

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
