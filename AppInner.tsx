import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocialLogin from './src/pages/SocialLogin';
import Main from './src/pages/Main';
import Health from './src/pages/Health';
import Mission from './src/pages/Mission';
import Meal from './src/pages/Meal';
import Setting from './src/pages/Setting';
import { useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import userSlice from './src/slices/user';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID, KAKAO_CLIENT_ID } from '@env';

export type LoggedInParamList = {
  Main: undefined;
  Health: undefined;
  Meal: undefined;
  Mission: undefined;
  Setting: undefined;
};

export type RootStackParamList = {
  SocialLogin: undefined;
  SignUp: undefined;
};
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        // 리프레쉬 토큰을 기반으로 로그인 유지 로직
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (!refreshToken) {
          return;
        }
        const params = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: KAKAO_CLIENT_ID,
          refresh_token: refreshToken,
        }).toString();
        const res = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        );
        // 토큰 발급 성공시 갱신
        if (res.data.refresh_token) {
          await EncryptedStorage.setItem(
            'refreshToken',
            res.data.refresh_token
          );
        }
        dispatch(
          userSlice.actions.setUser({
            accessToken: res.data.access_token,
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name='Main'
            component={Main}
            options={{ title: '메인' }}
          />
          <Tab.Screen
            name='Health'
            component={Health}
            options={{ title: '헬스' }}
          />
          <Tab.Screen
            name='Mission'
            component={Mission}
            options={{ title: '미션' }}
          />
          <Tab.Screen
            name='Meal'
            component={Meal}
            options={{ title: '식사' }}
          />
          <Tab.Screen
            name='Setting'
            component={Setting}
            options={{ title: '설정' }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name='SocialLogin'
            component={SocialLogin}
            options={{ headerShown: false }} // 헤더안보임
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
