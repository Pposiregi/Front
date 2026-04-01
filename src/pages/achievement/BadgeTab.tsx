import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { styles } from '@styles/Achievement_Badge.styles';
import { Badge, UserBadge } from '../../types/badge';
import { ItemModal } from './ItemModal';
import { getBadges, getUserBadges } from '@api/badgeApi';
import { badgeImages } from '@shared/constants/badgeImages';

interface BadgeUI extends Badge {
  unlocked: boolean;
  iconUrl: any;
}

const BadgeGrid = ({
  title,
  data,
  onBadgePress,
}: {
  title: string;
  data: BadgeUI[];
  onBadgePress: (item: BadgeUI) => void;
}) => {
  // 획득한 뱃지 수 계산
  const unlockedCount = data.filter((b) => b.unlocked).length;

  return (
    <View style={styles.badgeCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.badgeTitle}>{title}</Text>
        <Text style={styles.badgeCount}>
          {unlockedCount} / {data.length}
        </Text>
      </View>

      <FlatList
        data={data}
        numColumns={5}
        keyExtractor={(item) => item.badgeId.toString()}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.badgeItem}
            onPress={() => onBadgePress(item)}
            activeOpacity={0.7}
          >
            <Image
              source={item.iconUrl}
              style={[styles.badgeIcon, !item.unlocked && styles.lockedIcon]}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

function BadgeTab() {
  const [badges, setBadges] = useState<BadgeUI[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeUI | null>(null);
  const [loading, setLoading] = useState(true);
  const lockedImage = require('../../assets/images/badges/mission_unRanked.png');
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allBadges, userBadges]: [Badge[], UserBadge[]] =
          await Promise.all([getBadges(), getUserBadges()]);

        const userBadgeSet = new Set(userBadges.map((b) => b.badgeId));

        const merged = allBadges.map((badge) => {
          const unlocked = userBadgeSet.has(badge.badgeId);
          return {
            ...badge,
            unlocked,
            iconUrl: unlocked ? badgeImages[badge.badgeId] : lockedImage,
          };
        });

        setBadges(merged);
      } catch (e) {
        console.error('Badge Fetch Error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const stepBadges = useMemo(
    () => badges.filter((b) => b.type === 'STEP'),
    [badges]
  );
  const mealBadges = useMemo(
    () => badges.filter((b) => b.type === 'MEAL'),
    [badges]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#111827' />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <BadgeGrid
        title='🏃 걷기 챌린지'
        data={stepBadges}
        onBadgePress={setSelectedBadge}
      />

      <BadgeGrid
        title='🥗 식단 기록 챌린지'
        data={mealBadges}
        onBadgePress={setSelectedBadge}
      />

      {selectedBadge && (
        <ItemModal
          visible
          onClose={() => setSelectedBadge(null)}
          title={selectedBadge.title}
          imageUri={selectedBadge.iconUrl}
          extraText={`${selectedBadge.description}\n\n상태: ${
            selectedBadge.unlocked ? '✅ 획득함' : '🔒 미해금'
          }`}
        />
      )}
    </ScrollView>
  );
}

export default BadgeTab;
