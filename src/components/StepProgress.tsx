import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from '@styles/StepProgress.styles';
import * as Progress from 'react-native-progress';

type Props = {
  title: string;
  current: number;
  goal: number;
  unit?: string;
};

/**
 * Progress card used on the main page
 * @param title - card title (ex: "15000보 걷기")
 * @param current - current progress value
 * @param goal - goal value
 * @param unit - optional unit string (ex: "보", "km")
 */
export const StepProgress = ({ title, current, goal, unit }: Props) => {
  const progress = goal > 0 ? current / goal : 0;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const cardWidth = Math.max(
    150,
    Math.min(220, Math.round(SCREEN_WIDTH * 0.4))
  );
  const barWidth = Math.max(100, cardWidth - 20); // padding 고려

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Progress.Bar progress={progress} width={barWidth} color='#7450FF' />
      <Text style={styles.text}>{`${current} / ${goal}${unit ?? ''}`}</Text>
    </View>
  );
};
