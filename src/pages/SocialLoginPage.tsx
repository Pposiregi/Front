import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {
  login,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  serviceTerms as getKakaoServiceTerms,
  unlink,
  getProfile,
} from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../AppInner';
import { styles } from '@styles/SocialLogin.styles';
import { getSocialLogin } from '@api/socialLoginApi';

// 임시 우회 플래그: 백엔드 장애 시 로컬에서 로그인 성공 처리
const BYPASS_SOCIAL_LOGIN = true;

const SocialLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      console.log('초기화 버튼 클릭: 초기화 시작');
      await GoogleSignin.signOut();
      // 저장소의 모든 데이터 삭제
      await AsyncStorage.clear();
      await EncryptedStorage.clear();

      console.log('저장소 초기화 완료');

      // 리덕스 상태를 초기화
      dispatch(userSlice.actions.resetUser());
      console.log('리덕스 resetUser 액션 디스패치 완료');

      // 앱을 로그인 화면으로 강제 리셋 (가장 확실한 방법)
      navigation.reset({
        index: 0,
        routes: [{ name: 'SocialLogin' }],
      });
      console.log('앱 초기 화면으로 강제 리셋');
    } catch (e) {
      console.error('초기화 실패', e);
    }
  };

  // 로딩 상태를 관리하는 함수
  const handleLogin = async (loginFunction: () => Promise<void>) => {
    try {
      setLoading(true);
      await loginFunction();
    } catch (err) {
      console.error('로그인 에러', err);
    } finally {
      setLoading(false);
    }
  };

  // 서버에 소셜 로그인 + 최초 로그인 체크 요청 함수
  const firstLoginCheck = async ({
    idToken,
    accessToken,
    platform,
  }: {
    idToken: string;
    accessToken: string;
    platform: 'kakao' | 'google';
  }) => {
    try {
      if (BYPASS_SOCIAL_LOGIN) {
        const mockToken = 'dev-bypass-token';
        await EncryptedStorage.setItem('serverAccessToken', mockToken);
        dispatch(
          userSlice.actions.setUser({
            accessToken: mockToken,
            platform,
          })
        );
        dispatch(userSlice.actions.setSignUpInProgress(false));
        console.log('백엔드 우회: 로컬에서 로그인 처리 완료');
        return;
      }

      console.log('>>> firstLoginCheck request', {
        platform,
        idToken: idToken,
        accessToken: accessToken,
      });

      const result = await getSocialLogin({
        idToken,
        accessToken,
        platform,
      });
      console.log('로그인 성공 후 전달받은 result : ', result);
      if (!result.success) {
        throw new Error('서버 로그인 실패');
      }

      // 서버 액세스 토큰 저장
      await EncryptedStorage.setItem(
        'serverAccessToken',
        result.serverAccessToken
      );

      // Redux 저장
      dispatch(
        userSlice.actions.setUser({
          accessToken: result.serverAccessToken,
          platform,
        })
      );

      // 신규/기존 회원 분기
      if (result.registrationStatus === 'INCOMPLETE') {
        dispatch(userSlice.actions.setSignUpInProgress(true));
      } else {
        dispatch(userSlice.actions.setSignUpInProgress(false));
      }
    } catch (err: any) {
      console.error('>>> firstLoginCheck error', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
        raw: err,
      });
      Alert.alert('로그인 실패', '서버 통신에 오류가 발생했습니다.');
    }
  };

  // 카카오 로그인 // 라이브러리 삭제 후 웹뷰 형식으로 변경 예정
  const signInWithKakao = async (): Promise<void> => {
    const token = await login();
    await AsyncStorage.setItem('platform', 'kakao');
    await firstLoginCheck({
      platform: 'kakao',
      idToken: token.idToken!,
      accessToken: token.accessToken,
    });
  };

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      const profile = await GoogleSignin.signIn();
      const idToken = profile.data?.idToken;
      if (!idToken) {
        throw new Error('idToken 없음');
      }
      await AsyncStorage.setItem('platform', 'google');
      await firstLoginCheck({
        platform: 'google',
        idToken,
        accessToken: '',
      });
    } catch (err) {
      console.error('error', err);
      throw err;
    }
  };
  return (
    <View style={styles.container}>
      {loading ? (
        // loading이 true일 때 로딩 스피너를 보여줍니다.
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#000000' />
        </View>
      ) : (
        // loading이 false일 때 버튼들을 보여줍니다.
        <>
          <Text style={styles.mainText}>함께 달릴 준비 되셨나요?</Text>
          <Pressable style={styles.kakaoButton} onPress={handleReset}>
            <Text style={styles.text}>앱 초기화 (테스트용)</Text>
          </Pressable>
          <Pressable
            style={styles.kakaoButton}
            onPress={() => handleLogin(signInWithKakao)}
          >
            <Image
              source={require('../assets/images/icon/kakao_icon.png')}
              style={styles.kakaoIcon}
            />
            <Text style={styles.text}>카카오 계정으로 계속</Text>
          </Pressable>
          <Pressable
            style={styles.googleButton}
            onPress={() => handleLogin(signInWithGoogle)}
          >
            <Image
              source={require('../assets/images/icon/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.text}>구글 계정으로 계속</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default SocialLoginPage;
