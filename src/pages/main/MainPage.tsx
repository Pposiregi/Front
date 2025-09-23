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
import useStepCount from '@hooks/useStepCount';
import TokkiImage from '@assets/images/main_temp_tokki.png'; // 토끼 배경 이미지
/**
 * 메인 화면 컴포넌트
 * - 사용자 데이터 로딩
 * - 미션 목록을 가로 스크롤로 표시
 */
export const MainPage = () => {
  // 사용자 메인 데이터를 가져오는 척~ 커스텀 혹
  const { data, loading } = useMainData('u12345');
  const { stepCount, isAvailable } = useStepCount(); //

  // 위치 변화를 구독하여 좌표를 얻음
  // 데이터 로딩 중이거나 실패로 인해 데이터가 없을 때 스피너 표시
  if (loading || !data) {
    return <ActivityIndicator size='large' />;
  }

  // 미션 가져오는 척
  const missions = getMissions(data, {
    stepOverride: isAvailable ? stepCount : undefined,
  });

  const displayedSteps = isAvailable ? stepCount : data?.daily_walk.step ?? 0;

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
        <Text style={styles.message}>
          {`${displayedSteps.toLocaleString()}보 걸었어요!`}
        </Text>
        {!isAvailable && (
          <Text style={styles.stepFallback}>
            디바이스 걸음 센서를 찾을 수 없어 서버 데이터를 표시해요.
          </Text>
        )}

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
    </View>
  );
};

export default MainPage;
