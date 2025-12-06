import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocialLogin from './src/pages/SocialLoginPage';
import activityStack from './src/navigation/activityStack';
import Main from '@pages/main/MainPage';
import Meal from '@pages/meal/MealPage';
import Achievement from '@pages/achievement/AchievementPage';
import Profile from '@pages/ProfilePage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import userSlice from './src/slices/user';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tokenRefreshers from './src/utils/auth';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Index from './src/pages/SignUpFlow/IntroPage';
import SplashScreen from 'react-native-splash-screen';

// 헬스 커넥트 권한 요청 훅
import useHealthConnectPrompt from '@hooks/useHealthConnectPrompt';
import HealthConnectRequired from '@pages/HealthConnectRequired';
import { tabIcons, TabIconKey } from '@assets/icons';

export type LoggedInParamList = {
  Activity: undefined;
  Meal: undefined;
  Main: undefined;
  Achievement: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  SocialLogin: undefined;
  Intro: undefined;
};

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/***
 * tabBarIcon 생성 함수
 * @param routeName - 탭 네비게이션의 라우트 이름
 * @returns 탭 아이콘 컴포넌트
 */
const createTabBarIcon =
  (routeName: TabIconKey) =>
  ({ focused }: { focused: boolean }) => {
    const icon = tabIcons[routeName];

    if (!icon) {
      console.warn(`>>> ICON을 찾을 수 없습니다 : ${routeName}`);
      return null;
    }

    return (
      <Image
        source={focused ? icon.focused : icon.unfocused}
        style={styles.tabIcon}
      />
    );
  };

const getTabScreenOptions = (routeName: TabIconKey) => ({
  headerShown: false,
  tabBarStyle: styles.tabBar,
  tabBarItemStyle: styles.tabBarItem,
  tabBarIcon: createTabBarIcon(routeName),
  tabBarShowLabel: false,
});

function AppInner() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Redux 상태를 선택

  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken
  );
  const isSignUpInProgress = useSelector(
    (state: RootState) => state.user.isSignUpInProgress
  );

  // 25.10.24, MAN: 헬스 커넥트 권한 요청 훅 사용
  const {
    isHealthConnectReady,
    isCheckingStatus: isCheckingHealthConnect,
    requirement: healthConnectRequirement,
    openStore: openHealthConnectStore,
    retryCheck: retryHealthConnectCheck,
  } = useHealthConnectPrompt({
    enabled: !loading && isLoggedIn && !isSignUpInProgress,
  });

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
    console.log('>>> Rendering loading indicator');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000000' />
      </View>
    );
  }

  // Health Connect 필수 체크 (로그인 완료 후)
  console.log('>>> Final isHealthConnectReady 값:', isHealthConnectReady);
  if (isLoggedIn && !isSignUpInProgress && !isHealthConnectReady) {
    console.log('>>> Rendering HealthConnectRequired ');
    if (isCheckingHealthConnect) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#000000' />
        </View>
      );
    }

    return (
      <HealthConnectRequired
        requirement={healthConnectRequirement}
        onRetry={retryHealthConnectCheck}
        onOpenStore={openHealthConnectStore}
        isChecking={isCheckingHealthConnect}
      />
    );
  } // 최종 상태를 기준으로 내비게이션 결정

  console.log('Final isLoggedIn 값:', isLoggedIn);
  console.log('Final isSignUpInProgress 값:', isSignUpInProgress);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // 로그인 상태일 때
        isSignUpInProgress ? (
          // 회원가입 진행 중일 때 -> Intro 화면으로 이동
          <Stack.Navigator>
            <Stack.Screen
              name='Intro'
              component={Index}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
          </Stack.Navigator>
        ) : (
          // 회원가입이 완료되었을 때 -> 메인 화면으로 이동
          <Tab.Navigator
            initialRouteName='Main'
            screenOptions={({ route }) =>
              getTabScreenOptions(route.name as TabIconKey)
            }
          >
            <Tab.Screen name='Activity' component={activityStack} />
            <Tab.Screen name='Meal' component={Meal} />
            <Tab.Screen name='Main' component={Main} />
            <Tab.Screen name='Achievement' component={Achievement} />
            <Tab.Screen name='Profile' component={Profile} />
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
    backgroundColor: '#fff',
  },
  tabIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  tabBar: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppInner;
