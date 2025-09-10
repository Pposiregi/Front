import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  const progress = current / goal;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Progress.Bar progress={progress} width={120} color='#7450FF' />
      <Text style={styles.text}>{`${current} / ${goal}${unit ?? ''}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: 160,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
});
