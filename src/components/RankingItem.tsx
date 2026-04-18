import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '@styles/Achievement_Ranking.styles';
import { ProfileAvatar } from '@components/ProfileAvatar';

type RankingItemProps = {
  rank: number;
  nickname: string;
  dailyStepCount: number;
  profileImageUrl?: string;
  isTop3?: boolean;
  highlight?: boolean;
};

export const RankingItem = ({
  rank,
  nickname,
  dailyStepCount,
  profileImageUrl,
  isTop3 = false,
  highlight = false,
}: RankingItemProps) => {
  const rankingImages = [
    require('@assets/images/ranking/1st.png'),
    require('@assets/images/ranking/2st.png'),
    require('@assets/images/ranking/3st.png'),
  ];

  return (
    <View style={[styles.listItemBox, highlight && styles.myRankingHighlight]}>
      <View style={styles.rankAvatarContainer}>
        {isTop3 ? (
          <Image
            source={rankingImages[rank - 1]}
            style={styles.rankingNumberImage}
          />
        ) : (
          <Text style={styles.rankingNumberText}>{rank}</Text>
        )}
      </View>

      <View style={styles.rankAvatarContainer}>
        <ProfileAvatar profileImageUrl={profileImageUrl} />
      </View>

      <View style={styles.rankingNameScoreContainer}>
        <Text style={styles.listItemText}>{nickname}</Text>
        <Text style={styles.listItemText}>{dailyStepCount}보</Text>
      </View>
    </View>
  );
};
