import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  login,
  logout,
  getProfile as getKakaoProfile,
  shippingAddresses as getKakaoShippingAddresses,
  serviceTerms as getKakaoServiceTerms,
  unlink,
} from '@react-native-seoul/kakao-login';
import ResultView from './IntroView';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Intro = () => {
  const [result, setResult] = useState<string>('');
  //카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      setResult(JSON.stringify(token));
      console.log('토큰', token);
    } catch (err) {
      console.error('login err', err);
    }
  };
  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log('test userInfo ::: ', response);
    } catch (err) {
      console.error('login err', err);
    }
  };

  return (
    <View style={styles.container}>
      <ResultView result={result} />
      <Text style={styles.mainText}>함께 달릴 준비 되셨나요?</Text>
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

export default Intro;

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
