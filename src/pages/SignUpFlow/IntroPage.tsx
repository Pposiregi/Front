import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { styles } from '@styles/IntroPage.styles';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store';
import userSlice from '../../slices/user';
import OptionalInfoPage from './OptionalInfoPage';
import PermissionPage from './PermissionPage';
import AppPermissionGuidePage from './AppPermissionGuidePage';
import UserInfoPage from './UserInfoPage';
import { signUp } from '@api/authApi';
import { authRequest } from '../../types/auth';
import PetCreatePage from './PetCreatePage';
import { logSignUp } from '@utils/analytics';

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
      serviceAgree: false,
      privacyPolicyAgree: false,
      locationAgree: false,
      privacyAgree: false,
      healthAgree: false,
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
    const totalPages = 4;
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
    const {
      serviceAgree,
      privacyPolicyAgree,
      locationAgree,
      privacyAgree,
      healthAgree,
      pushAgree,
    } = finalFormData.permissions;

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
      termsAgreements: [
        { termsId: 4, isAgreed: serviceAgree }, // SERVICE_USE v2.0
        { termsId: 5, isAgreed: privacyPolicyAgree }, // PRIVACY_POLICY v2.0
        { termsId: 7, isAgreed: privacyAgree }, // PRIVACY_COLLECTION v2.0
        { termsId: 8, isAgreed: locationAgree }, // LOCATION_BASED v2.0
        { termsId: 9, isAgreed: healthAgree }, // HEALTH_INFO v2.0
        { termsId: 6, isAgreed: pushAgree }, // MARKETING v2.0
      ],
    };
    try {
      const signUpResult = await signUp(requestBody);
      if (!signUpResult) {
        throw new Error('회원가입 응답이 비어 있습니다.');
      }

      dispatch(
        userSlice.actions.setNickName({
          nickname: requestBody.nickname,
        })
      );

      const platform = await AsyncStorage.getItem('platform');
      if (platform === 'kakao' || platform === 'google') {
        await logSignUp(platform);
      }

      await AsyncStorage.setItem('isSignUpInProgress', 'false');
      dispatch(userSlice.actions.setSignUpInProgress(false));
    } catch (err) {
      console.error('회원가입 실패', err);
      Alert.alert(
        '회원가입 실패',
        '서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>환영합니다! FietPet이 처음이신가요?</Text>
      </View>

      <View style={styles.dotContainer}>
        {[0, 1, 2, 3].map((i) => (
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
        <AppPermissionGuidePage
          key='2'
          onNext={goToNextPage}
          pushAgree={formData.permissions.pushAgree}
        />
        <UserInfoPage key='3' onNext={handleNext} />
        <OptionalInfoPage key='4' onFinish={handleFinish} />
      </PagerView>
    </View>
  );
};

export default IntroPage;
