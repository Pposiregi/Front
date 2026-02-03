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
import { styles } from '@styles/Achievement.styles';
import { getDailyStepRanking } from '@api/rankingApi';
import { DailyStepRankingResponse } from 'types/ranking';
import { useSelector } from 'react-redux';
import { RootState } from '@store/reducer';

function RankingTab() {
  const mockRankingData = {
    top10: [
      { userId: 11, nickname: 'user11', dailyStepCount: 1200 },
      { userId: 12, nickname: 'user12', dailyStepCount: 1150 },
      { userId: 13, nickname: 'user13', dailyStepCount: 1100 },
      { userId: 14, nickname: 'user14', dailyStepCount: 1050 },
      { userId: 15, nickname: 'user15', dailyStepCount: 1000 },
      { userId: 16, nickname: 'user16', dailyStepCount: 950 },
      { userId: 17, nickname: 'user17', dailyStepCount: 900 },
      { userId: 18, nickname: 'user18', dailyStepCount: 850 },
      { userId: 19, nickname: 'user19', dailyStepCount: 800 },
      { userId: 20, nickname: 'user20', dailyStepCount: 750 },
    ],
    myRank: 5, // 내 순위는 top10 안에 없지만 5위라고 가정
  };
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] =
    useState<DailyStepRankingResponse | null>(mockRankingData);
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );
  const myUserId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    const fetchRanking = async () => {
      // if (__DEV__) {
      //   setRankingData(mockRankingData);
      //   return;
      // }
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
  const top3 = rankingData.top10.slice(0, 3);
  return (
    <ImageBackground
      source={require('@assets/images/배경2.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      {/* 상단 장식 이미지 (반투명 오버레이 가능) */}
      <Image
        source={require('@assets/images/강아지들-Photoroom.png')}
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
          {rankingData.top10.length === 0 ? (
            <View style={styles.noRankingContainer}>
              <Text style={styles.noRankingText}>
                랭킹에 아직 기록이 없어요!
              </Text>
            </View>
          ) : (
            <FlatList
              data={rankingData.top10}
              keyExtractor={(item, index) =>
                item?.userId?.toString() ?? index.toString()
              }
              renderItem={({ item, index }) => {
                const Me = item.userId === myUserId;
                return (
                  <View
                    style={[
                      styles.listItemBox,
                      Me && styles.myRankingHighlight,
                    ]}
                  >
                    <Text style={styles.rankingNumberText}>{index + 1}</Text>
                    <View style={styles.rankingNameScoreContainer}>
                      <Text style={styles.listItemText}>{item.nickname}</Text>
                      <Text style={styles.listItemText}>
                        {item.dailyStepCount}보
                      </Text>
                    </View>
                  </View>
                );
              }}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
      {/* 내 순위 표시 */}
      <View style={[styles.myRankingBox, { backgroundColor: '#FEC288' }]}>
        <Text style={styles.rankingNumberText}>{rankingData.myRank}</Text>
        <View style={styles.rankingNameScoreContainer}>
          <Text style={styles.listItemText}>나</Text>
          <Text style={styles.listItemText}>
            {rankingData.myStepCount ?? 0}보
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
export default RankingTab;
