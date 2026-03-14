import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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

function BadgeTab() {
  const [badges, setBadges] = useState<BadgeUI[]>([]);

  const [selectedBadge, setSelectedBadge] = useState<BadgeUI | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const allBadges: Badge[] = await getBadges();
        const userBadges: UserBadge[] = await getUserBadges();
        const userBadgeSet = new Set(userBadges.map((b) => b.badgeId));
        const merged = allBadges.map((badge) => {
          const unlocked = userBadgeSet.has(badge.badgeId);

          return {
            ...badge,
            unlocked,
            iconUrl: unlocked
              ? badgeImages[badge.badgeId]
              : require('../../assets/images/badges/mission_unRanked.png'),
          };
        });
        setBadges(merged);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#111827' />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.badgeCard}>
        <Text style={styles.badgeTitle}>나의 뱃지 목록</Text>

        <FlatList
          data={badges}
          numColumns={5}
          keyExtractor={(item) => item.badgeId.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.badgeItem}
              disabled={false}
              onPress={() => setSelectedBadge(item)}
            >
              <Image
                source={item.iconUrl}
                style={[
                  styles.badgeIcon,
                  !item.unlocked && {
                    opacity: 0.6,
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedBadge && (
        <ItemModal
          visible
          onClose={() => setSelectedBadge(null)}
          title={selectedBadge.title}
          imageUri={selectedBadge.iconUrl}
          extraText={`${selectedBadge.type}\n${selectedBadge.description}\n${
            selectedBadge.unlocked ? '획득함' : '미해금'
          }`}
        />
      )}
    </View>
  );
}

export default BadgeTab;
