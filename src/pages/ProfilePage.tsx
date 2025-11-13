import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import { logout } from '@react-native-seoul/kakao-login';

function ProfilePage() {
  const dispatch = useAppDispatch();
  // 임시 구글 로그아웃
  const googleSignOut = async () => {
    try {
      //await logout(); // 카카오 로그인
      await GoogleSignin.revokeAccess(); // 기존 토큰 무효화
      GoogleSignin.signOut();

      //저장된 값들 삭제
      await EncryptedStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('platform');
      await AsyncStorage.removeItem('isSignUpInProgress');

      //리덕스 초기화
      dispatch(
        userSlice.actions.setUser({
          email: '',
          accessToken: '',
        })
      );
      console.log('로그아웃');
      Alert.alert('로그아웃');
    } catch (err) {
      console.error('logout err', err);
    }
  };
  // 임시 카카오 로그아웃
  const kakaoSignOut = async () => {
    try {
      await logout(); // 카카오 로그아웃
      //저장된 값들 삭제
      await EncryptedStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('platform');
      await AsyncStorage.removeItem('isSignUpInProgress');

      //리덕스 초기화
      dispatch(
        userSlice.actions.setUser({
          email: '',
          accessToken: '',
        })
      );
      console.log('로그아웃');
      Alert.alert('로그아웃');
    } catch (err) {
      console.error('logout err', err);
    }
  };
  return (
    <View>
      <Text>설정</Text>
      <Pressable
        style={styles.googleButton}
        onPress={() => {
          googleSignOut();
        }}
      >
        <Text style={styles.text}>구글 로그아웃</Text>
      </Pressable>
      <Pressable
        style={styles.googleButton}
        onPress={() => {
          kakaoSignOut();
        }}
      >
        <Text style={styles.text}>카카오 로그아웃</Text>
      </Pressable>
    </View>
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
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
  text: {
    textAlign: 'center',
    fontFamily: 'GowunDodum',
    fontWeight: 800,
  },
});
