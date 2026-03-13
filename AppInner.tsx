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
import { DEV_PET_ID, GOOGLE_CLIENT_ID } from '@env';
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Index from './src/pages/SignUpFlow/IntroPage';
import SplashScreen from 'react-native-splash-screen';
import { tabIcons, TabIconKey } from '@assets/icons';
import { refreshAccessToken } from '@api/authApi';
import ProfileStack from '@navigation/profileStack';
import { getDeviceUuid } from '@utils/deviceUuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  patchPushToken,
  postPushToken,
  type PushTokenPayload,
} from '@api/pushTokenApi';
import {
  clearSessionExpiredHandler,
  notifySessionExpired,
  resetSessionExpiredState,
  setSessionExpiredHandler,
} from '@api/authSession';
import { PET_TYPE_STORAGE_KEY } from '@shared/config/petConfig';
import { ensurePetIdStored } from '@utils/petIdStorage';
import {
  getLastSentPushToken,
  setLastSentPushToken,
} from '@utils/pushTokenStorage';

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

/**
 * Google OAuth 설정 (로그인).
 */
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 탭바 아이콘 생성 함수.
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

/**
 * 탭 스크린 옵션을 생성한다.
 */
const getTabScreenOptions = (routeName: TabIconKey) => ({
  headerShown: false,
  tabBarItemStyle: styles.tabBarItem,
  tabBarIcon: createTabBarIcon(routeName),
  tabBarShowLabel: false,
});

/**
 * 지정 시간(ms) 대기 유틸.
 */
const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

/**
 * FCM 권한 상태를 라벨로 변환한다.
 */
const getPermissionLabel = (status: number) => {
  switch (status) {
    case messaging.AuthorizationStatus.AUTHORIZED:
      return 'AUTHORIZED';
    case messaging.AuthorizationStatus.PROVISIONAL:
      return 'PROVISIONAL';
    case messaging.AuthorizationStatus.DENIED:
      return 'DENIED';
    case messaging.AuthorizationStatus.NOT_DETERMINED:
      return 'NOT_DETERMINED';
    default:
      return `UNKNOWN(${status})`;
  }
};

/**
 * 작업을 최대 attempts 만큼 재시도한다.
 * - 실패 시 지수적 딜레이로 재시도
 */
const runWithRetry = async <T,>(
  label: string,
  task: () => Promise<T>,
  attempts = 3
) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (err) {
      if (__DEV__) {
        console.error(
          `>>> [FCM][PushToken] ${label} 실패 (시도 ${attempt}/${attempts})`,
          err
        );
      }
      if (attempt >= attempts) {
        throw err;
      }
      const delayMs = [1000, 3000, 5000][attempt - 1] ?? 5000;
      console.log(`>>> [FCM][PushToken] 재시도 대기 ${delayMs}ms`);
      await wait(delayMs);
    }
  }
};

/**
 * 앱 진입 루트 컴포넌트.
 * - 로그인/회원가입 상태에 따라 스택을 분기한다.
 */
function AppInner() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Redux 상태를 선택

  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken
  );
  const isSignUpInProgress = useSelector(
    (state: RootState) => state.user.isSignUpInProgress
  );
  const isRunningActive = useSelector(
    (state: RootState) => state.user.isRunningActive
  );
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    setSessionExpiredHandler(async (reason) => {
      // refresh 재시도 중의 일시 실패(네트워크/5xx)는 세션 파기 사유가 아니므로
      // latch만 풀고 사용자 상태는 유지한다.
      if (reason !== 'REFRESH_TOKEN_INVALID') {
        resetSessionExpiredState();
        return;
      }

      // 실제 refresh token 만료일 때만 로컬 인증 정보와 사용자별 캐시를 함께 정리한다.
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('serverAccessToken');
      await AsyncStorage.multiRemove([
        'isSignUpInProgress',
        PET_TYPE_STORAGE_KEY,
      ]);
      dispatch(userSlice.actions.resetUser());
      Alert.alert('로그인 만료', '로그인이 만료되었어요. 다시 로그인해 주세요.');
    });

    return () => {
      clearSessionExpiredHandler();
    };
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) {
      // 새 access token을 확보한 시점에는 이전 만료 처리 latch를 반드시 초기화한다.
      resetSessionExpiredState();
    }
  }, [accessToken]);

  /**
   * 앱 진입 시 자동 로그인 처리.
   * - refreshToken 갱신 및 유저 상태 초기화
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        try {
          // 앱 진입 시 deviceUuid를 항상 확보해 둔다.
          const deviceUuid = await getDeviceUuid();

          if (__DEV__) {
            // 개발환경에서만 env 값을 AsyncStorage에 시드한다.
            await ensurePetIdStored(DEV_PET_ID);
            console.log('>>> [FCM][DeviceUuid] device UUID: ', deviceUuid);
          }
        } catch (err) {
          console.warn(
            '>>> [FCM][DeviceUuid] UUID 생성 실패 || Storagy 저장 실패',
            err
          );
        }
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const result = await refreshAccessToken();
            if (result?.serverAccessToken) {
              await EncryptedStorage.setItem(
                'serverAccessToken',
                result.serverAccessToken
              );
              dispatch(
                userSlice.actions.setAuth({
                  accessToken: result.serverAccessToken,
                })
              );
              dispatch(
                userSlice.actions.setSignUpInProgress(
                  result.registrationStatus === 'INCOMPLETE'
                )
              );
            }
          } catch (err: any) {
            const status = err?.response?.status;
            if (status === 401) {
              await notifySessionExpired('REFRESH_TOKEN_INVALID');
            }
            console.error('[AuthError] 자동로그인 실패', err);
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

  /**
   * 푸시 토큰 등록 처리.
   */
  useEffect(() => {
    const registerPushToken = async () => {
      // 로그인 || 회원가입 상태에서만.
      if (!isLoggedIn || isSignUpInProgress || !accessToken) {
        return;
      }

      try {
        // 로그인 직후/앱 재시작 시 알림 권한 요청 → 토큰 획득 → 서버 등록
        const authStatus = await messaging().requestPermission();

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.warn(
            '>>> [FCM][PushToken] 알림 권한 거부',
            getPermissionLabel(authStatus)
          );
          return;
        }

        const deviceUuid = await getDeviceUuid();
        const send = async () => {
          const fcmToken = await messaging().getToken();
          if (!fcmToken) {
            throw new Error('FCM 토큰 없음');
          }

          // 최근 전송 토큰과 동일하면 중복 전송을 스킵한다.
          const lastToken = await getLastSentPushToken();
          if (lastToken === fcmToken) {
            console.log('>>> [FCM][PushToken] 동일 토큰, 전송 스킵');
            return { skipped: true };
          }

          const payload: PushTokenPayload = {
            deviceUuid: deviceUuid,
            deviceOs: 'ANDROID',
            deviceToken: fcmToken,
          };

          if (__DEV__) {
            console.log('>>> [FCM][PushToken] POST /devices/push-token', {
              deviceUuid: payload.deviceUuid,
              deviceOs: payload.deviceOs,
              deviceToken: `${payload.deviceToken.slice(0, 8)}...`,
            });
          }
          await postPushToken(payload, accessToken);
          await setLastSentPushToken(fcmToken);
          return { skipped: false };
        };

        // 전송 실패 시 재시도한다.
        await runWithRetry('POST /devices/push-token', send);
      } catch (err) {
        console.error('>>> [FCM][PushToken] POST 실패', err);
      }
    };

    registerPushToken();
  }, [accessToken, isLoggedIn, isSignUpInProgress]);

  /**
   * FCM 토큰 갱신 시 서버 반영.
   */
  useEffect(() => {
    if (!isLoggedIn || isSignUpInProgress || !accessToken) {
      return;
    }

    // FCM 토큰 갱신 이벤트를 듣고 즉시 서버에 반영한다.
    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      try {
        if (!fcmToken) {
          console.warn('>>> [FCM][PushToken] 갱신 토큰 없음');
          return;
        }

        const deviceUuid = await getDeviceUuid();
        // 최근 전송 토큰과 동일하면 중복 전송을 스킵한다.
        const lastToken = await getLastSentPushToken();
        if (lastToken === fcmToken) {
          console.log('>>> [FCM][PushToken] 동일 토큰, 전송 스킵');
          return;
        }

        const payload: PushTokenPayload = {
          deviceUuid: deviceUuid,
          deviceOs: 'ANDROID',
          deviceToken: fcmToken,
        };
        const send = async () => {
          if (__DEV__) {
            console.log('>>> [FCM][PushToken] PATCH /devices/push-token', {
              deviceUuid: payload.deviceUuid,
              deviceOs: payload.deviceOs,
              deviceToken: `${payload.deviceToken.slice(0, 8)}...`,
            });
          }
          await patchPushToken(payload, accessToken);
          await setLastSentPushToken(fcmToken);
          return { skipped: false };
        };

        // 전송 실패 시 재시도한다.
        await runWithRetry('PATCH /devices/push-token', send);
      } catch (err) {
        console.error('>>> [FCM][PushToken] PATCH 실패', err);
      }
    });

    return unsubscribe;
  }, [accessToken, isLoggedIn, isSignUpInProgress]);

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
            screenOptions={({ route }) => ({
              ...getTabScreenOptions(route.name as TabIconKey),
              tabBarStyle: [
                styles.tabBar,
                isRunningActive ? styles.tabBarLocked : null,
              ],
            })}
            screenListeners={({ route }) => ({
              tabPress: (event) => {
                // 러닝 중에는 메인 탭 이외의 하단 탭 전환을 막는다.
                if (isRunningActive && route.name !== 'Main') {
                  event.preventDefault();
                  Alert.alert(
                    '러닝 진행 중',
                    '러닝이 끝날 때까지 다른 화면으로 이동할 수 없어요.'
                  );
                }
              },
            })}
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
    height: 60,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  tabBarLocked: {
    backgroundColor: '#D1D5DB',
    borderTopColor: '#9CA3AF',
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppInner;
