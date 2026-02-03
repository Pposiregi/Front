import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '@styles/Achievement_Badge.styles';
import { Badge } from './types';
import { ItemModal } from './ItemModal';

// 임시 목업
const mockBadges: Badge[] = [
  {
    badgeId: 1,
    title: '최초 10000보 달성',
    type: 'STEP',
    tier: 'BRONZE',
    iconUrl: require('../../assets/images/step_bronze.png'),
    createdAt: '2025-10-10T12:34:56Z',
  },
];

function BadgeTab() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

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
              onPress={() => setSelectedBadge(item)}
            >
              <Image source={item.iconUrl} style={styles.badgeIcon} />
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
          extraText={`${selectedBadge.type} / ${selectedBadge.tier}\n${new Date(
            selectedBadge.createdAt
          ).toLocaleDateString()}`}
        />
      )}
    </View>
  );
}

export default BadgeTab;
