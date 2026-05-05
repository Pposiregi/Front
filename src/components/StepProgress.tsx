import React from 'react';
import { Text, Dimensions, Pressable, Image } from 'react-native';
import styles from '@styles/StepProgress.styles';
import * as Progress from 'react-native-progress';
import { Colors } from '@styles/theme';

type Props = {
  title: string;
  current: number;
  goal: number;
  unit?: string;
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
  isCompleted,
  isReadyToComplete,
  onPress,
}: Props) => {
  const progress = goal > 0 ? current / goal : 0;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const cardWidth = Math.max(
    150,
    Math.min(220, Math.round(SCREEN_WIDTH * 0.4))
  );
  const barWidth = Math.max(100, cardWidth - 20); // padding 고려

  const disabled = !isReadyToComplete;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.card, isReadyToComplete && styles.readyCard]}
    >
      <Text style={[styles.title, isReadyToComplete && styles.readyTitle]}>
        {title}
      </Text>
      <Progress.Bar
        progress={progress}
        width={barWidth}
        color={isReadyToComplete ? Colors.surface : Colors.accentStrong}
        unfilledColor={
          isReadyToComplete ? Colors.surfaceOverlaySolid : Colors.divider
        }
        borderColor='transparent'
      />
      {isReadyToComplete && !isCompleted && (
        <Image
          source={require('../assets/images/paw_stamp.png')}
          style={styles.completeHint}
        />
      )}
      <Text style={[styles.text, isReadyToComplete && styles.readyText]}>
        {`${current} / ${goal}${unit ?? ''}`}
      </Text>
    </Pressable>
  );
};
