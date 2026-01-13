import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { MissionActiveItem } from 'types/mission';
import { StepProgress } from '@components/StepProgress'; // 기존 컴포넌트 import

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
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '95%',
            height: '83%',
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 12 }}>
            미션
          </Text>

          {/* 탭 버튼 */}
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {['DAILY', 'WEEKLY', 'MONTHLY'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() =>
                  setActiveTab(tab as 'DAILY' | 'WEEKLY' | 'MONTHLY')
                }
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  marginHorizontal: 4,
                  borderBottomWidth: activeTab === tab ? 2 : 0,
                  borderBottomColor: '#2196F3',
                  alignItems: 'center',
                }}
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
              <Text style={{ textAlign: 'center', color: '#888' }}>
                미션이 없습니다.
              </Text>
            ) : (
              filteredMissions.map((mission) => {
                const progress =
                  mission.goalValue > 0
                    ? mission.progressValue / mission.goalValue
                    : 0;

                return (
                  <View
                    key={mission.missionCheckId}
                    style={{
                      padding: 12,
                      marginVertical: 6,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 8,
                    }}
                  >
                    {/* 한 줄로 타이틀과 진행값 배치 */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {mission.title}
                      </Text>
                      <Text style={{ fontSize: 16, color: '#555' }}>
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
            style={{
              marginTop: 12,
              alignSelf: 'flex-end',
              padding: 8,
              backgroundColor: '#2196F3',
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 20 }}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissionModal;
