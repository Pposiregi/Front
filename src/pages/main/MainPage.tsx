import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import { PetAvatar } from '@components/PetAvatar';
import styles from '@styles/MainPage.styles';

export const MainScreen = () => {
  const { data, loading } = useMainData('u12345');

  if (loading) return <ActivityIndicator size='large' />;

  return (
    <View style={styles.container}>
      {/* Progress Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.progressRow}
      >
        <StepProgress
          title={`${data!.daily_walk.goal_step}보 걷기`}
          current={data!.daily_walk.step}
          goal={data!.daily_walk.goal_step}
          unit='보'
        />
        <StepProgress
          title='3km 달리기'
          current={data!.daily_walk.distance_km}
          goal={3}
          unit='km'
        />
      </ScrollView>

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
