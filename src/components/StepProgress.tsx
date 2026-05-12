import React from 'react';
import { Text, Dimensions, Pressable, Image, View } from 'react-native';
import styles from '@styles/StepProgress.styles';
import { Colors } from '@styles/theme';

type Props = {
  title: string;
  current: number;
  goal: number;
  unit?: string;
  category?: 'STEP' | 'MEAL';
  tone?: 'lime' | 'violet' | 'orange';
  isCompleted?: boolean;
  isReadyToComplete?: boolean;
  onPress?: () => void;
};

/**
 * Progress card used on the main page
 * @param title - card title (ex: "15000보 걷기")
 * @param current - current progress value
 * @param goal - goal value
 * @param unit - optional unit string (ex: "보", "km")
 * @param isReadyToComplete
 */
export const StepProgress = ({
  title,
  current,
  goal,
  unit,
  category,
  tone = 'lime',
  isCompleted,
  isReadyToComplete,
  onPress,
}: Props) => {
  const progress = goal > 0 ? Math.min(current / goal, 1) : 0;
  const toneColor = {
    lime: 'rgba(22, 163, 74, 0.82)',
    violet: 'rgba(37, 99, 235, 0.82)',
    orange: 'rgba(220, 38, 38, 0.78)',
  }[tone];
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const cardWidth = Math.max(
    128,
    Math.min(138, Math.round(SCREEN_WIDTH * 0.345))
  );
  const barWidth = Math.max(104, cardWidth - 24); // padding 고려

  const disabled = !isReadyToComplete;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.card, isReadyToComplete && styles.readyCard]}
    >
      <View style={styles.titleRow}>
        <Text style={styles.cardIcon}>{category === 'MEAL' ? '✎' : '👟'}</Text>
        <Text
          numberOfLines={1}
          style={[styles.title, isReadyToComplete && styles.readyTitle]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.progressTrack,
          { width: barWidth },
          isReadyToComplete && styles.readyProgressTrack,
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isReadyToComplete ? Colors.surface : toneColor,
            },
          ]}
        >
          <View style={styles.progressFillGloss} />
        </View>
      </View>
      {isReadyToComplete && !isCompleted && (
        <Image
          source={require('../assets/images/paw_stamp.png')}
          style={styles.completeHint}
        />
      )}
      <View style={styles.valueRow}>
        <Text
          style={[
            styles.currentValue,
            { color: isReadyToComplete ? Colors.accentDeep : toneColor },
          ]}
        >
          {current.toLocaleString()}
        </Text>
        <Text style={[styles.goalValue, isReadyToComplete && styles.readyText]}>
          {` / ${goal.toLocaleString()}${unit ?? ''}`}
        </Text>
      </View>
    </Pressable>
  );
};
