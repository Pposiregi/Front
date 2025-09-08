import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  serviceTerms as getKakaoServiceTerms,
  unlink,
  getProfile,
} from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@env';

const SocialLogin = () => {
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<string>('');
  //카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login(); // 카카오에서 토큰 받아옴
      const profile = await getProfile(); // 카카오에서 사용자 정보 받아옴

      // 앱 껏다 켜도 로그인 유지 위해 리프레쉬 토큰을 EncryptedStorage에 저장
      await EncryptedStorage.setItem('refreshToken', token.refreshToken);
      dispatch(
        userSlice.actions.setUser({
          email: profile.email,
          accessToken: token.accessToken,
          platform: 'kakao',
        })
      );
    } catch (err) {
      console.error('login err', err);
    }
  };
  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const profile = await GoogleSignin.signIn(); // 1. 구글에 로그인
      // 2. 1에서 받은 authCode + clientId 를 활용하여 토큰 가져오기
      const res = await fetch('https://www.googleapis.com/oauth2/v3/token', {
        method: 'POST',
        body: JSON.stringify({
          code: profile.data?.serverAuthCode,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          grant_type: 'authorization_code',
        }),
      });
      // 3. 받아온 json 파일 풀기
      const token = await res.json();
      console.log('data확인', token);
      await EncryptedStorage.setItem('refreshToken', token.refresh_token);
      dispatch(
        userSlice.actions.setUser({
          email: profile.data?.user.email,
          accessToken: token.access_token,
          platform: 'google',
        })
      );
    } catch (err) {
      console.error('login err', err);
    }
  };
  // 임시 로그아웃
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess(); // 기존 토큰 무효화
      GoogleSignin.signOut();
      console.log('로그아웃');
    } catch (err) {
      console.error('login err', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>함께 달릴 준비 되셨나요?</Text>
      <Pressable
        style={styles.googleButton}
        onPress={() => {
          signOut();
        }}
      >
        <Text style={styles.text}>임시 로그아웃</Text>
      </Pressable>
      <Pressable
        style={styles.kakaoButton}
        onPress={() => {
          signInWithKakao();
        }}
      >
        <Image
          source={require('../assets/images/kakao_icon.png')}
          style={styles.kakaoIcon}
        />
        <Text style={styles.text}>카카오 계정으로 계속</Text>
      </Pressable>
      <Pressable
        style={styles.googleButton}
        onPress={() => {
          signInWithGoogle();
        }}
      >
        <Image
          source={require('../assets/images/google_icon.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.text}>구글 계정으로 계속</Text>
      </Pressable>
    </View>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  mainText: {
    fontSize: 49,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 170,
    fontFamily: 'JUA',
  },
  kakaoButton: {
    backgroundColor: '#FDDC3F',
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 7,
    paddingVertical: 7,
    marginTop: 10,
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
    width: 250,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
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
    fontWeight: 800,
  },
});
