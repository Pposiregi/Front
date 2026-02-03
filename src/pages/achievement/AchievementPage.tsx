import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles/Achievement.styles';

import RankingTab from './RankingTab';
import MissionTab from './MissionTab';
import BadgeTab from './BadgeTab';

type TabType = 'RANKING' | 'MISSION' | 'BADGE';

function AchievementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('RANKING');

  // ====================
  // 상단 탭 헤더
  // ====================
  const TabHeader = () => (
    <View style={styles.tabHeaderContainer}>
      {['RANKING', 'MISSION', 'BADGE'].map((tab) => {
        const isActive = activeTab === (tab as TabType);
        const label =
          tab === 'RANKING' ? '랭킹' : tab === 'MISSION' ? '달성 미션' : '뱃지';
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab as TabType)}
          >
            <View style={styles.tabInner}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {label}
              </Text>
              {isActive && <View style={styles.tabUnderline} />}
            </View>
          </TouchableOpacity>
        );
      })}
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
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <TabHeader />
      <View style={{ flex: 1 }}>{renderActiveScreen()}</View>
    </View>
  );
}

export default AchievementPage;
