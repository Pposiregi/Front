import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocialLogin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // 로그인 및 로딩 상태를 관리하는 함수
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

  // 카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    const token = await login();
    const profile = await getProfile();

    await EncryptedStorage.setItem('refreshToken', token.refreshToken);
    await AsyncStorage.setItem('platform', 'kakao');

    dispatch(
      userSlice.actions.setUser({
        email: profile.email,
        accessToken: token.accessToken,
      })
    );
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
    dispatch(
      userSlice.actions.setUser({
        email: profile.data?.user.email,
        accessToken: token.access_token,
      })
    );
  };

  // 임시 로그아웃
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await EncryptedStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('platform');
      console.log('로그아웃');
      Alert.alert('로그아웃');
    } catch (err) {
      console.error('로그아웃 에러', err);
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
          <Pressable
            style={styles.googleButton}
            onPress={() => {
              signOut();
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
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
