import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store';
import userSlice from '../../slices/user';
import OptionalInfoPage from './OptionalInfoPage';
import PermissionPage from './PermissionPage';
import UserInfoPage from './UserInfoPage';
import { signUp } from '@api/authApi';
import { authRequest } from '../../types/auth';

const IntroPage = () => {
  //현재 페이지 주소 나타냄
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // 뒤로가기 동작 막음
    const backAction = () => {
      return true;
    };
    // 안드로이드 하드웨어 뒤로가기도 막음
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const startSignUpInProgress = async () => {
      try {
        await AsyncStorage.setItem('isSignUpInProgress', 'true');
        dispatch(userSlice.actions.setSignUpInProgress(true));
      } catch (err) {
        console.error('회원가입 상태 저장 실패', err);
      }
    };
    startSignUpInProgress();
  }, [dispatch]);

  // 서버에 보낼 사용자 정보 저장
  const [formData, setFormData] = useState({
    // PermissionPage 정보
    permissions: {
      locationAgree: false,
      privacyAgree: false,
      pushAgree: false,
    },
    // UserInfoPage 정보
    nickName: '',
    birth: { year: '', month: '', day: '' },
    gender: null as 'male' | 'female' | null,
    weightKg: '',
    heightCm: '',
    // OptionalInfoPage 정보
    targetWeightKg: '',
    pbf: '',
    targetPbf: '',
    targetStepCount: '',
  });
  const handleNext = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    goToNextPage();
  };

  // 각 페이지에서 버튼 눌렀을 때 호출 다음페이지로
  const goToNextPage = () => {
    const totalPages = 3;
    if (pagerRef.current && currentPage < totalPages - 1) {
      pagerRef.current.setPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFinish = async (data: Partial<typeof formData>) => {
    const finalFormData = { ...formData, ...data };
    // 생년월일 → 나이 계산
    const { year, month, day } = finalFormData.birth;
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const age =
      new Date().getFullYear() -
      birthDate.getFullYear() -
      (new Date().getMonth() < birthDate.getMonth() ||
      (new Date().getMonth() === birthDate.getMonth() &&
        new Date().getDate() < birthDate.getDate())
        ? 1
        : 0);

    // 빈 값 처리 + number 변환
    const toNumberOrUndefined = (value: string) =>
      value.trim() === '' ? undefined : Number(value);

    // authRequest 타입에 맞게 변환
    const requestBody: authRequest = {
      nickname: finalFormData.nickName,
      age,
      gender: finalFormData.gender as 'male' | 'female',
      weightKg: toNumberOrUndefined(finalFormData.weightKg),
      heightCm: toNumberOrUndefined(finalFormData.heightCm),
      targetWeightKg: toNumberOrUndefined(finalFormData.targetWeightKg),
      pbf: toNumberOrUndefined(finalFormData.pbf),
      targetPbf: toNumberOrUndefined(finalFormData.targetPbf),
      targetStepCount: toNumberOrUndefined(finalFormData.targetStepCount),
    };

    try {
      await signUp(requestBody);
      await AsyncStorage.setItem('isSignUpInProgress', 'false');
      dispatch(userSlice.actions.setSignUpInProgress(false));
    } catch (err) {
      console.error('회원가입 상태 업데이트 실패', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={(styles.text, { color: '#666666' })}>
          환영합니다! FietPet이 처음이신가요?
        </Text>
      </View>

      <View style={styles.dotContainer}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, currentPage === i && styles.activeDot]}
          />
        ))}
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        ref={pagerRef}
      >
        <PermissionPage key='1' onNext={handleNext} />
        <UserInfoPage key='2' onNext={handleNext} />
        <OptionalInfoPage key='3' onFinish={handleFinish} />
      </PagerView>
    </View>
  );
};

export default IntroPage;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pagerView: { flex: 1 },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'JUA',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.03,
    marginBottom: 5,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6347',
  },
});
