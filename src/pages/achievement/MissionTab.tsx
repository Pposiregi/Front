import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { styles } from '@styles/Achievement.styles';
import { MissionHistoryItem } from '../../types/achievemnet';
import { getMissionHistory } from '@api/achievementApi';

type MissionStatus = 'LOADING' | 'EMPTY' | 'READY';

const MissionTab = () => {
  const [missions, setMissions] = useState<MissionHistoryItem[]>([]);
  const [status, setStatus] = useState<MissionStatus>('LOADING');

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissionHistory();

        if (data.missions.length === 0) {
          setStatus('EMPTY');
        } else {
          setMissions(data.missions);
          setStatus('READY');
        }
      } catch (e) {
        console.log('미션 히스토리 조회 실패', e);
        setStatus('EMPTY'); // 지금 단계에서는 fallback
      }
    };

    fetchMissions();
  }, []);

  // ====================
  // 상태별 렌더링
  // ====================
  if (status === 'LOADING') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#777' />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  if (status === 'EMPTY') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 16 }}>아직 완료된 미션이 없어요 🙂</Text>
        <Text style={{ marginTop: 6, color: '#999' }}>
          미션을 달성하면 이곳에 기록이 남아요!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={missions}
      keyExtractor={(item) => item.mission_check_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.title}</Text>
          <Text style={styles.listItemText}>
            {item.progress_value}/{item.goal_value}
          </Text>
        </View>
      )}
    />
  );
};

export default MissionTab;
