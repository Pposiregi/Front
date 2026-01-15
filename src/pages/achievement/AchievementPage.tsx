import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles/Achievement.styles';

import RankingTab from './RankingTab';
import MissionTab from './mission/MissionTab';
import BadgeTab from './BadgeTab';

type TabType = 'RANKING' | 'MISSION' | 'BADGE';

function AchievementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('RANKING');

  // ====================
  // 상단 탭 헤더
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
  // 탭별 화면 렌더링
  // ====================
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'RANKING':
        return <RankingTab />;
      case 'MISSION':
        return <MissionTab />;
      case 'BADGE':
        return <BadgeTab />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TabHeader />
      <View style={{ flex: 1 }}>{renderActiveScreen()}</View>
    </View>
  );
}

export default AchievementPage;
