import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { styles } from '@styles/Achievement_Ranking.styles';
import { getDailyStepRanking } from '@api/rankingApi';
import { DailyStepRankingResponse } from 'types/ranking';
import { useSelector } from 'react-redux';
import { RootState } from '@store/reducer';
import { ProfileAvatar } from '@components/ProfileAvatar';
import { RankingItem } from '@components/RankingItem';

function RankingTab() {
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] =
    useState<DailyStepRankingResponse | null>();
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );
  const myUserId = useSelector((state: RootState) => state.user.userId);
  const myGender = useSelector((state: RootState) => state.user.gender);
  // 추후에 랭킹 남성, 여성 별 탭에도 본인에게 맞는 성별 선택 시 랭킹 띄우기 위해 남겨둠
  const showMyRanking =
    rankingFilter === 'ALL' ||
    (rankingFilter === 'MALE' && myGender === 'male') ||
    (rankingFilter === 'FEMALE' && myGender === 'female');
  // 추후에는 랭킹 데이터에서 ID 받아오기
  const profileImageId = useSelector(
    (state: RootState) => state.user.profileImageId
  );

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await getDailyStepRanking({
          gender: rankingFilter,
        });
        setRankingData({
          topRankings: data.topRankings,
          myRanking: data.myRanking,
        });
      } catch (e) {
        console.log('랭킹 로드 실패', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [rankingFilter]);

  if (loading || !rankingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return (
    <ImageBackground
      source={require('@assets/images/ranking/ranking_background.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      <Image
        source={require('@assets/images/ranking/pet_podium.png')}
        style={{ width: '100%', height: 150 }}
        resizeMode='contain'
      />
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
      {/* 랭킹 리스트와 버튼을 담는 카드 박스 */}
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {/* 카드 스타일로 배경 */}
        <View>
          {/* 랭킹 리스트 */}
          {rankingData.topRankings.length === 0 ? (
            <View style={styles.noRankingContainer}>
              <Text style={styles.noRankingText}>
                랭킹에 아직 기록이 없어요!
              </Text>
            </View>
          ) : (
            rankingData.topRankings.map((item, index) => (
              <RankingItem
                key={item?.userId?.toString() ?? index.toString()}
                rank={index + 1}
                nickname={item.nickname}
                dailyStepCount={item.score}
                profileImageId={profileImageId}
                isTop3={index < 3}
                highlight={item.userId === myUserId}
              />
            ))
          )}
        </View>
      </ScrollView>
      {/* 내 순위 표시 */}
      {rankingFilter === 'ALL' && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
          }}
        >
          <RankingItem
            rank={rankingData.myRanking?.rank ?? 0}
            nickname='나'
            dailyStepCount={rankingData.myRanking?.score ?? 0}
            profileImageId={profileImageId}
            highlight={true}
          />
        </View>
      )}
    </ImageBackground>
  );
}
export default RankingTab;
