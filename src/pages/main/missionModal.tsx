import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import type { MissionActiveItem } from 'types/mission';
import styles from '@styles/missionModal.styles';
import MissionCard from './missionCard';
import { postMissionComplete } from '@api/missionApi';

interface MissionModalProps {
  visible: boolean;
  onClose: () => void;
  missions: MissionActiveItem[];
  onComplete?: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  visible,
  onClose,
  missions,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>(
    'DAILY'
  );

  // 탭별 미션 필터링
  const filteredMissions = missions.filter((m) => m.periodType === activeTab);

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.missionView}>
        <View style={styles.modalBox}>
          <Text style={styles.missionTitle}>진행중인 미션</Text>
          <View style={styles.tabRow}>
            {['DAILY', 'WEEKLY', 'MONTHLY'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() =>
                  setActiveTab(tab as 'DAILY' | 'WEEKLY' | 'MONTHLY')
                }
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab === 'DAILY'
                    ? '일일'
                    : tab === 'WEEKLY'
                    ? '주간'
                    : '월간'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            {filteredMissions.length === 0 ? (
              <Text style={styles.emptyMissionText}>미션이 없습니다.</Text>
            ) : (
              filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.missionCheckId}
                  mission={mission}
                  onComplete={async (missionCheckId) => {
                    console.log('API 호출 전 missionCheckId:', missionCheckId); // 로그 확인
                    try {
                      await postMissionComplete(missionCheckId);
                      onComplete?.();
                    } catch (error) {
                      console.error('오류 발생!!:', error);
                    }
                  }}
                />
              ))
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={styles.missionUIExitButton}
          >
            <Text style={styles.missionUIExitText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
