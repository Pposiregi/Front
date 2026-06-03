import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles/Achievement.styles';

import RankingTab from './RankingTab';
import MissionTab from './MissionTab';
import BadgeTab from './BadgeTab';

type TabType = 'RANKING' | 'MISSION' | 'BADGE';

function AchievementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('RANKING');

  const activeSubtitle =
    activeTab === 'RANKING'
      ? '오늘의 걸음 수 순위를 확인해요'
      : activeTab === 'MISSION'
      ? '완료한 미션 기록을 모아봐요'
      : '획득한 뱃지를 한눈에 확인해요';

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
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => setActiveTab(tab as TabType)}
            accessibilityRole='tab'
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {label}
            </Text>
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
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.pageTitle}>업적</Text>
        <Text style={styles.pageSubtitle}>{activeSubtitle}</Text>
        <TabHeader />
      </View>
      <View style={{ flex: 1 }}>{renderActiveScreen()}</View>
    </View>
  );
}

export default AchievementPage;
