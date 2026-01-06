import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocialLogin from './src/pages/SocialLoginPage';
import ActivityStack from './src/navigation/activityStack';
import Main from '@pages/main/MainPage';
import Meal from '@pages/meal/MealPage';
import Achievement from '@pages/achievement/AchievementPage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAppDispatch } from './src/store';
import userSlice from './src/slices/user';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Index from './src/pages/SignUpFlow/IntroPage';
import SplashScreen from 'react-native-splash-screen';
import { tabIcons, TabIconKey } from '@assets/icons';
import { refreshAccessToken } from '@api/authApi';
import ProfileStack from '@navigation/profileStack';

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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (refreshToken) {
          const result = await refreshAccessToken();
          if (result?.serverAccessToken) {
            dispatch(
              userSlice.actions.setUser({
                accessToken: result.serverAccessToken,
              })
            );
            dispatch(
              userSlice.actions.setSignUpInProgress(
                result.registrationStatus === 'INCOMPLETE'
              )
            );
          }
        }
      } catch (err) {
        console.error('[AuthError] 자동로그인 실패', err);
      } finally {
        SplashScreen.hide();
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (loading) {
    console.log('>>> Rendering loading indicator');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#000000' />
      </View>
    );
  }

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
            <Tab.Screen name='Activity' component={ActivityStack} />
            <Tab.Screen name='Meal' component={Meal} />
            <Tab.Screen name='Main' component={Main} />
            <Tab.Screen name='Achievement' component={Achievement} />
            <Tab.Screen name='Profile' component={ProfileStack} />
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
