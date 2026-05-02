import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { styles } from '@styles/Achievement_Ranking.styles';
import { useFocusEffect } from '@react-navigation/native';
import { getDailyStepRanking } from '@api/rankingApi';
import { DailyStepRankingResponse } from 'types/ranking';
import { useSelector } from 'react-redux';
import { RootState } from '@store/reducer';
import { RankingItem } from '@components/RankingItem';
import { useSafeBottomSpacing } from '@hooks/useSafeBottomSpacing';

function RankingTab() {
  const { bottomInset, contentBottomPadding } = useSafeBottomSpacing();
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] =
    useState<DailyStepRankingResponse | null>();
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>(
    'ALL'
  );
  const myUserId = useSelector((state: RootState) => state.user.userId);
  const myProfileImageUrl = useSelector(
    (state: RootState) => state.user.profileImageUrl
  );

  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDailyStepRanking({ gender: rankingFilter });
      setRankingData({
        topRankings: data.topRankings,
        myRanking: data.myRanking,
      });
    } catch (e) {
      console.log('랭킹 로드 실패', e);
    } finally {
      setLoading(false);
    }
  }, [rankingFilter]);

  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      fetchRanking();
    }, [fetchRanking])
  );

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);
  const scrollContentStyle = useMemo(
    () => ({
      // 고정된 '내 순위' 바와 하단 시스템 버튼 영역만큼 리스트 하단 스크롤 여유를 만든다.
      paddingBottom: contentBottomPadding,
    }),
    [contentBottomPadding]
  );
  const myRankingContainerStyle = useMemo(
    () => [
      styles.myRankingFloatingContainer,
      // Android 3버튼 내비게이션이 safe-area를 0으로 주는 기기에서도 내 순위 바가 버튼 영역과 겹치지 않게 한다.
      { bottom: bottomInset },
    ],
    [bottomInset]
  );

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
        contentContainerStyle={scrollContentStyle}
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
                profileImageUrl={item.userId === myUserId ? myProfileImageUrl : item.profileImageUrl}
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
          style={myRankingContainerStyle}
        >
          <RankingItem
            rank={rankingData.myRanking?.rank ?? 0}
            nickname='나'
            dailyStepCount={rankingData.myRanking?.score ?? 0}
            profileImageUrl={myProfileImageUrl}
            highlight={true}
          />
        </View>
      )}
    </ImageBackground>
  );
}
export default RankingTab;
