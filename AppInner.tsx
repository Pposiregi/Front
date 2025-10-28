import React, { useEffect, useState } from 'react';
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
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import userSlice from './src/slices/user';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenRefreshers from './src/utils/auth';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Index from './src/pages/SignUpFlow/IntroPage';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export type LoggedInParamList = {
  Main: undefined;
  Health: undefined;
  Meal: undefined;
  Mission: undefined;
  Setting: undefined;
};

export type RootStackParamList = {
  SocialLogin: undefined;
  Index: undefined;
};

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Redux 상태를 선택

  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken
  );
  const isSignUpInProgress = useSelector(
    (state: RootState) => state.user.isSignUpInProgress
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // AsyncStorage에서 회원가입 상태를 가져와 리덕스에 동기화
        const signUpInProgressValue = await AsyncStorage.getItem(
          'isSignUpInProgress'
        );
        const isSignUp = signUpInProgressValue === 'true';
        dispatch(userSlice.actions.setSignUpInProgress(isSignUp)); // EncryptedStorage에서 토큰을 가져와 로그인 상태를 확인

        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (refreshToken) {
          const platform = await AsyncStorage.getItem('platform');
          if (platform) {
            const platformRefresher =
              tokenRefreshers[platform as keyof typeof tokenRefreshers];
            const { accessToken, refreshToken: newRefreshToken } =
              await platformRefresher(refreshToken);
            if (newRefreshToken) {
              await EncryptedStorage.setItem('refreshToken', newRefreshToken);
            } // 로그인 상태를 리덕스에 동기화
            dispatch(userSlice.actions.setUser({ accessToken }));
          }
        }
      } catch (err) {
        console.error(`[AuthError] 인증 상태 확인 실패:`, err);
      } finally {
        // 4. 모든 비동기 작업이 완료된 후 로딩 상태를 false로 변경
        SplashScreen.hide();
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]); // 로딩 중일 때는 로딩 화면만 렌더링

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000000' />
      </View>
    );
  } // 최종 상태를 기준으로 내비게이션 결정

  console.log('Final isLoggedIn 값:', isLoggedIn);
  console.log('Final isSignUpInProgress 값:', isSignUpInProgress);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // 로그인 상태일 때
        isSignUpInProgress ? (
          // 회원가입 진행 중일 때 -> Index 화면으로 이동
          <Stack.Navigator>
            <Stack.Screen
              name='Index'
              component={Index}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
          </Stack.Navigator>
        ) : (
          // 회원가입이 완료되었을 때 -> 메인 화면으로 이동
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
              options={{ headerShown: false }}
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
        )
      ) : (
        // 로그인 상태가 아닐 때 -> SocialLogin 화면으로 이동
        <Stack.Navigator>
          <Stack.Screen
            name='SocialLogin'
            component={SocialLogin}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default AppInner;
