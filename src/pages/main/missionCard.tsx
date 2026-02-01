// MissionCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import type { MissionActiveItem } from 'types/mission';
import styles from '@styles/missionModal.styles';

interface MissionCardProps {
  mission: MissionActiveItem;
  onComplete: (id: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete }) => {
  const progress =
    mission.goalValue > 0 ? mission.progressValue / mission.goalValue : 0;
  const isReadyToComplete =
    !mission.isCompleted && mission.progressValue >= mission.goalValue;

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={[
        styles.missionUICard,
        isReadyToComplete && styles.missionUICardReadbyBorder,
      ]}
    >
      <View style={styles.missionUICardHeader}>
        <Text style={styles.missionIcon}>
          {mission.category === 'STEP'
            ? '🌱'
            : mission.category === 'MEAL'
            ? '🍴'
            : '📄'}
        </Text>
        <Text style={styles.missionUITextTitle}>{mission.title}</Text>
        <View style={styles.flexEndContainer}>
          <TouchableOpacity
            disabled={!isReadyToComplete}
            onPress={() => console.log('눌림')}
            style={[
              styles.completeButton,
              isReadyToComplete
                ? { backgroundColor: '#2196F3' }
                : { backgroundColor: '#ccc' },
            ]}
          >
            <Text
              style={
                isReadyToComplete
                  ? styles.completeButtonText
                  : styles.completeButtonTextDisabled
              }
            >
              완료
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.missionUIText}>
        {mission.progressValue} / {mission.goalValue}{' '}
        {mission.category === 'STEP'
          ? '보'
          : mission.category === 'MEAL'
          ? '회'
          : '장'}
      </Text>

      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarForeground,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

export default MissionCard;
