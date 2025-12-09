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

const SocialLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      console.log('초기화 버튼 클릭: 초기화 시작');

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
      const result = await getSocialLogin({
        idToken,
        accessToken,
        platform,
      });

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
    } catch (err) {
      console.error(err);
      Alert.alert('로그인 실패', '서버 통신에 오류가 발생했습니다.');
    }
  };

  // 카카오 로그인 // 라이브러리 삭제 후 웹뷰 형식으로 변경 예정
  const signInWithKakao = async (): Promise<void> => {
    const token = await login();
    const profile = await getProfile();
    await EncryptedStorage.setItem('refreshToken', token.refreshToken);
    await AsyncStorage.setItem('platform', 'kakao');
    console.log('카카오 idToken : ', token.idToken!);
    console.log('카카오 accessToken : ', token.accessToken);
    await firstLoginCheck({
      platform: 'kakao',
      idToken: token.idToken!,
      accessToken: token.accessToken,
    });
  };

  // 구글 로그인
  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure({
      webClientId:
        '670074275623-4pqtm5i7a7octebi7qnpgsvb1m0sh3l6.apps.googleusercontent.com', // 서버와 동일하게
      offlineAccess: true, // refresh token 발급 원하면 true
    });
    const profile = await GoogleSignin.signIn();
    console.log('프로필', profile);
    // const idToken= profile.data?.idToken 아이디 토큰
    const res = await fetch('https://www.googleapis.com/oauth2/v3/token', {
      method: 'POST',
      body: JSON.stringify({
        code: profile.data?.serverAuthCode,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
      }),
    });
    const token = await res.json();
    await EncryptedStorage.setItem('refreshToken', token.refresh_token);
    await AsyncStorage.setItem('platform', 'google');
    console.log('구글 idToken : ', profile.data?.idToken!);
    console.log('구글 accessToken : ', token.access_token);
    await firstLoginCheck({
      platform: 'google',
      idToken: profile.data?.idToken!,
      accessToken: token.access_token,
    });
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
