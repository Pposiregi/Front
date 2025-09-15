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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenRefreshers from './src/utils/auth';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Index from './src/pages/SignUpFlow/Index';

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
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  // 앱 재시작시 로직

  // 리덕스에 accessToken이 존재하는지 여부로 로그인 여부 판단
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken
  );
  // 리덕스에 isSignUpInProgress 존재하는지 여부로 회원가입 여부 판단
  const isSignUpInProgress = useSelector(
    (state: RootState) => state.user.isSignUpInProgress
  );
  console.log('isLoggedIn 값 : ', isLoggedIn);
  console.log('isSignUpInProgress 값 : ', isSignUpInProgress);
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        // 저장소에서 회원가입 여부 상태 가져옴
        const signUpInProgressValue = await AsyncStorage.getItem(
          'isSignUpInProgress'
        );
        const isSignUp = signUpInProgressValue === 'true'; // 저장소에는 boolean 저장이 안되므로 string을 boolean으로 바꿔줌
        dispatch(userSlice.actions.setSignUpInProgress(isSignUp)); // 리덕스에 갱신

        // 앱에 저장되 있는 리프레쉬 토큰을 기반으로 로그인 유지 로직
        const platform = await AsyncStorage.getItem('platform'); // 플랫폼 값 들고오기
        const refreshToken = await EncryptedStorage.getItem('refreshToken'); // 리프레쉬토큰
        if (!refreshToken) {
          console.error(`[AuthError] 로그인 기록이 없어 토큰 값이 없습니다.`);
          return;
        }
        if (!platform || (platform !== 'kakao' && platform !== 'google')) {
          console.error(`[AuthError] 지원하지않는 플랫폼 요청 : ${platform}`);
          return;
        }
        //플랫폼 들고오기
        // 후에 tokenRefreshers함수는 서버에게 요청하는걸로 변경
        const platformRefresher =
          tokenRefreshers[platform as keyof typeof tokenRefreshers];
        // 해당 플랫폼의 토큰 갱신 함수 호출
        const { accessToken, refreshToken: newRefreshToken } =
          await platformRefresher(refreshToken);
        // 리프레쉬 토큰 재발급시 갱신
        if (newRefreshToken) {
          await EncryptedStorage.setItem('refreshToken', newRefreshToken);
        }
        dispatch(
          userSlice.actions.setUser({
            accessToken: accessToken,
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(true);
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
  if (!loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000000' />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {isLoggedIn && !isSignUpInProgress ? (
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
          <Stack.Screen
            name='Index'
            component={Index}
            options={{ headerShown: false, animation: 'slide_from_right' }}
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
