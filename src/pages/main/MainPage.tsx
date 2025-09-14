import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useMainData } from '@hooks/useMainData';
import { StepProgress } from '@components/StepProgress';
import styles from '@styles/MainPage.styles';
import { getMissions } from './missions';
import { useMissions } from '@hooks/useMissions';
import TokkiImage from '@assets/images/main_temp_tokki.png'; // 토끼 배경 이미지
/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainScreen = () => {
  // 사용자 메인 데이터를 가져오는 척~ 커스텀 혹
  const { data, loading } = useMainData('u12345');

  // 위치 변화를 구독하여 좌표를 얻음
  const position = useMissions();

  // 데이터 로딩 중일 경우 스피너 표시
  if (loading) return <ActivityIndicator size='large' />;

  // 미션 가져오는 척
  const missions = getMissions(data!);

  return (
    <View style={styles.container}>
      {/*
        미션 진행 상황을 가로 스크롤로 표시 
      */}
      <View style={styles.progressContainer}>
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
      </View>

      {/* 토끼 배경 이미지와 함께 메시지 및 버튼 표시 */}
      <ImageBackground
        source={TokkiImage}
        style={styles.tokkiBackground}
        resizeMode='cover'
      >
        <Text style={styles.message}>{data!.ui.message}</Text>

        {/* 현재 위치 좌표 표시 (디버그용) */}
        <Text>
          {position
            ? `${position.coords.latitude.toFixed(
                5
              )}, ${position.coords.longitude.toFixed(5)}`
            : '위치를 가져오는 중...'}
        </Text>

        {/* 펫 아바타 
      <PetAvatar uri={data!.pet.image_uri} expression={data!.pet.expression} />
    */}
        {/* Start Button - 하단 배치 */}
        <TouchableOpacity
          style={styles.startButton}
          accessibilityRole='button'
          accessibilityLabel='산책 시작'
        >
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>
      </ImageBackground>
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
