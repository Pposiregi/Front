import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store';
import userSlice from '../../slices/user';
import OptionalInfoPage from './OptionalInfoPage';
import PermissionPage from './PermissionPage';
import UserInfoPage from './UserInfoPage';

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
    console.log('검증', finalFormData);
    // AsyncStorage, Redux 업데이트
    try {
      await AsyncStorage.setItem('isSignUpInProgress', 'false');
      dispatch(userSlice.actions.setSignUpInProgress(false));
    } catch (err) {
      console.error('회원가입 상태 업데이트 실패', err);
    }

    // // 서버에 최종 데이터 전송
    // try {
    //   const res = await fetch('https://your-server.com/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(finalFormData),
    //   });
    //   if (!res.ok) throw new Error('회원가입 실패');
    //   const result = await res.json();
    //   console.log('회원가입 성공:', result);
    //   // 여기서 다음 화면 이동 가능
    // } catch (err) {
    //   console.error(err);
    //   Alert.alert(
    //     '오류',
    //     '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.'
    //   );
    // }
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
