import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import { PetAvatar } from '@components/PetAvatar';
import styles from '@styles/MainPage.styles';

export const MainScreen = () => {
  const { data, loading } = useMainData('u12345');

  if (loading) return <ActivityIndicator size='large' />;
  const missions = [
    {
      id: 'walk',
      title: `${data!.daily_walk.goal_step}보 걷기`,
      current: data!.daily_walk.step,
      goal: data!.daily_walk.goal_step,
      unit: '보',
    },
    {
      id: 'run',
      title: '3km 달리기',
      current: data!.daily_walk.distance_km,
      goal: 3,
      unit: 'km',
    },
    {
      id: 'cal',
      title: '100kcal 소모',
      current: data!.daily_walk.burn_calories,
      goal: 100,
      unit: 'kcal',
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StepProgress
            title={item.title}
            current={item.current}
            goal={item.goal}
            unit={item.unit}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.progressRow}
      />

      {/* 안내 메시지 */}
      <Text style={styles.message}>{data!.ui.message}</Text>

      {/* 펫 아바타 */}
      <PetAvatar uri={data!.pet.image_uri} expression={data!.pet.expression} />

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startText}>START</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text style={styles.navIcon}>👣</Text>
        <Text style={styles.navIcon}>🍽️</Text>
        <Text style={styles.navIcon}>🦴</Text>
        <Text style={styles.navIcon}>👤</Text>
      </View>
    </View>
  );
};
