import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, SectionList } from 'react-native';
import dayjs from 'dayjs';

import { styles } from '@styles/Achievement.styles';
import { MissionHistoryItem } from '../../../types/mission';
import { getMissionHistory } from '@api/missionApi';

type MissionStatus = 'LOADING' | 'READY' | 'ERROR';

type MissionSection = {
  title: string; // 날짜
  data: MissionHistoryItem[];
};

const MissionTab = () => {
  const [missions, setMissions] = useState<MissionHistoryItem[]>([]);
  const [status, setStatus] = useState<MissionStatus>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissionHistory();
        setMissions(data.missions);
        setStatus('READY');
      } catch (e) {
        console.error('미션 히스토리 조회 실패', e);
        setErrorMessage(
          '미션 기록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
        );
        setStatus('ERROR');
      }
    };

    fetchMissions();
  }, []);

  // ====================
  // 날짜별 섹션 데이터 생성
  // ====================
  const sections: MissionSection[] = useMemo(() => {
    const completed = missions
      .filter((m) => m.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime()
      );

    const grouped: Record<string, MissionHistoryItem[]> = {};

    completed.forEach((mission) => {
      const dateKey = dayjs(mission.completedAt).format('YYYY.MM.DD');

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(mission);
    });

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  }, [missions]);

  // ====================
  // LOADING
  // ====================
  if (status === 'LOADING') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#777' />
        <Text>불러오는 중...</Text>
      </View>
    );
  }
  // ====================
  // ERROR
  // ====================
  if (status === 'ERROR') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 16 }}>{errorMessage}</Text>
      </View>
    );
  }

  // ====================
  // EMPTY
  // ====================
  if (sections.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 16 }}>아직 완료된 미션이 없어요 🙂</Text>
        <Text style={{ marginTop: 6, color: '#999' }}>
          미션을 달성하면 이곳에 기록이 남아요!
        </Text>
      </View>
    );
  }

  // ====================
  // SECTION LIST
  // ====================
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.missionCheckId.toString()}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.listItemBox}>
          <Text style={styles.listItemTitle}>{item.title}</Text>
        </View>
      )}
    />
  );
};

export default MissionTab;
