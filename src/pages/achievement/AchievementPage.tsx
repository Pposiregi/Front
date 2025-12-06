import React, { useEffect, useState } from 'react';
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
import { styles } from '@styles/Achievement.styles';
import { getDailyStepRanking } from '@api/rankingApi';
import { Badge, MissionData, RankingData } from './types';

// ====================
// 목업 데이터 (뱃지, 미션)
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

const mockMissions: MissionData = [
  { missionId: 1, title: '오늘 5000보 걷기', progress: 80 },
  { missionId: 2, title: '주간 10km 달리기', progress: 50 },
  { missionId: 3, title: '칼로리 500kcal 소모', progress: 100 },
];

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
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [activeTab, setActiveTab] = useState<'RANKING' | 'MISSION' | 'BADGE'>(
    'RANKING'
  );
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);

  // 뱃지 모달 열기
  const handleBadgePress = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsBadgeModalVisible(true);
  };

  // ====================
  // 랭킹 API 호출
  // ====================
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await getDailyStepRanking({
          limit: 10,
          gender: rankingFilter,
        });
        setRankingData({
          top10: data.top10,
          myRank: data.myRank,
        });
      } catch (error) {
        console.log('랭킹 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [rankingFilter]);

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
        if (!rankingData) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' />
            </View>
          );
        }
        return (
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            {/* 필터 버튼 */}
            <View style={styles.filterButton}>
              {['ALL', 'MALE', 'FEMALE'].map((filter) => {
                const isActive = rankingFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() =>
                      setRankingFilter(filter as 'ALL' | 'MALE' | 'FEMALE')
                    }
                    style={[
                      styles.rankingFilterButton,
                      isActive && styles.rankingFilterButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankingFilterButtonText,
                        isActive && styles.rankingFilterButtonTextActive,
                      ]}
                    >
                      {filter === 'ALL'
                        ? '전체'
                        : filter === 'MALE'
                        ? '남자'
                        : '여자'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* top10 리스트 */}
            <FlatList
              data={rankingData.top10}
              keyExtractor={(item, index) =>
                item && item.userId ? item.userId.toString() : index.toString()
              }
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
            {/* 전체 탭에서만 나의 순위 표시 */}
            {rankingFilter === 'ALL' && (
              <Text style={{ textAlign: 'center', marginTop: 10 }}>
                나의 순위: {rankingData.myRank}위
              </Text>
            )}
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

  // ====================
  // 로딩 화면 처리
  // ====================
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
