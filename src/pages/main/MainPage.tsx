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
import { getMissions } from './missions';

/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainScreen = () => {
  // 사용자 메인 데이터를 가져오는 척~ 커스텀 혹
  const { data, loading } = useMainData('u12345');

  // 데이터 로딩 중일 경우 스피너 표시
  if (loading) return <ActivityIndicator size='large' />;

  // 미션 가져오는 척
  const missions = getMissions(data!);

  return (
    <View style={styles.container}>
      {/*
        미션 진행 상황을 가로 스크롤로 표시 
      */}
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

      {/* 안내 메시지, from Server */}
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
