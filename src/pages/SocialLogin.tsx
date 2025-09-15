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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../AppInner';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';

const SocialLogin = () => {
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
  const firstLoginCheck = async (
    email: string,
    platform: string,
    accessToken: string
  ) => {
    try {
      // 임시 로직: 서버 응답 대신 `AsyncStorage`를 사용
      const isUserLoggedInBefore = await AsyncStorage.getItem(
        `hasLoggedIn_${email}`
      );
      const isNewUser = !isUserLoggedInBefore;

      // 최종적으로 Redux에 로그인 상태와 회원가입 필요 상태를 저장
      dispatch(userSlice.actions.setUser({ accessToken, email }));

      if (isNewUser) {
        await AsyncStorage.setItem(`hasLoggedIn_${email}`, 'true');
        dispatch(userSlice.actions.setSignUpInProgress(true));
      } else {
        dispatch(userSlice.actions.setSignUpInProgress(false));
      }
    } catch (err) {
      console.error('서버 로그인 처리 실패', err);
      // 실패 시 로그인 화면으로 복귀
      dispatch(userSlice.actions.resetUser());
    }
  };

  // 카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    const token = await login();
    const profile = await getProfile();

    await EncryptedStorage.setItem('refreshToken', token.refreshToken);
    await AsyncStorage.setItem('platform', 'kakao');

    await firstLoginCheck(profile.email, 'kakao', token.accessToken);
  };

  // 구글 로그인
  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const profile = await GoogleSignin.signIn();
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

    await firstLoginCheck(
      profile.data?.user.email!,
      'google',
      token.access_token
    );
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
              source={require('../assets/images/kakao_icon.png')}
              style={styles.kakaoIcon}
            />
            <Text style={styles.text}>카카오 계정으로 계속</Text>
          </Pressable>
          <Pressable
            style={styles.googleButton}
            onPress={() => handleLogin(signInWithGoogle)}
          >
            <Image
              source={require('../assets/images/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.text}>구글 계정으로 계속</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default SocialLogin;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  mainText: {
    fontSize: 50,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: height * 0.23,
    fontFamily: 'JUA',
  },
  kakaoButton: {
    backgroundColor: '#FDDC3F',
    borderRadius: 40,
    borderWidth: 1,
    width: width * 0.7,
    height: height * 0.05,
    paddingHorizontal: width * 0.02,
    paddingVertical: 7,
    marginTop: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kakaoIcon: {
    width: 35,
    height: 35,
    marginRight: 22,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    width: width * 0.7,
    height: height * 0.05,
    paddingHorizontal: width * 0.03,
    paddingVertical: 7,
    marginTop: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 33,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'GowunDodum',
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
