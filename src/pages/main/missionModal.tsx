import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { MissionActiveItem } from 'types/mission';
import styles from '@styles/MainPage.styles';

interface MissionModalProps {
  visible: boolean;
  onClose: () => void;
  missions: MissionActiveItem[];
}

const MissionModal: React.FC<MissionModalProps> = ({
  visible,
  onClose,
  missions,
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
          <Text style={styles.missionTitle}>미션</Text>

          {/* 탭 버튼 */}
          <View style={styles.tabRow}>
            {['DAILY', 'WEEKLY', 'MONTHLY'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() =>
                  setActiveTab(tab as 'DAILY' | 'WEEKLY' | 'MONTHLY')
                }
                style={[
                  styles.tabButton,
                  activeTab === tab && {
                    borderBottomWidth: 2,
                    borderBottomColor: '#2196F3',
                  },
                ]}
              >
                <Text
                  style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
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
              filteredMissions.map((mission) => {
                const progress =
                  mission.goalValue > 0
                    ? mission.progressValue / mission.goalValue
                    : 0;

                return (
                  <View
                    key={mission.missionCheckId}
                    style={styles.missionUICard}
                  >
                    {/* 한 줄로 타이틀과 진행값 배치 */}
                    <View style={styles.missionUICardHeader}>
                      <Text style={styles.missionUITextTitle}>
                        {mission.title}
                      </Text>
                      <Text style={styles.missionUIText}>
                        {mission.progressValue} / {mission.goalValue}{' '}
                        {mission.category === 'STEP'
                          ? '보'
                          : mission.category === 'MEAL'
                          ? '회'
                          : '장'}
                      </Text>
                    </View>
                  </View>
                );
              })
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
