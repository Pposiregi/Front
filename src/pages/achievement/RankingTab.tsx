import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styles } from '@styles/Achievement.styles';
import { getDailyStepRanking } from '@api/rankingApi';
import { DailyStepRankingResponse } from 'types/ranking';

function RankingTab() {
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] =
    useState<DailyStepRankingResponse | null>(null);
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );

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
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      {/* 필터 */}
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

      {/* 랭킹 리스트 */}
      <FlatList
        data={rankingData.top10}
        keyExtractor={(item, index) =>
          item?.userId?.toString() ?? index.toString()
        }
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.rankingNumberText}>{index + 1}</Text>
            <View style={styles.rankingNameScoreContainer}>
              <Text style={styles.listItemText}>{item.nickname}</Text>
              <Text style={styles.listItemText}>{item.dailyStepCount}보</Text>
            </View>
          </View>
        )}
      />

      {rankingFilter === 'ALL' && (
        <Text style={styles.myRankingText}>
          나의 순위: {rankingData.myRank}위
        </Text>
      )}
    </View>
  );
}

export default RankingTab;
