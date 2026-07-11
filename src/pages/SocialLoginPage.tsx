import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { login } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../AppInner';
import { styles } from '@styles/SocialLogin.styles';
import { Colors } from '@styles/theme';
import { getSocialLogin } from '@api/socialLoginApi';
import { getUser } from '@api/mainApi';
import { logLogin } from '@utils/analytics';
import { API_BASE_URL } from '@env';

const LOGIN_APP_ICON = require('../../app_icon.png');
type SocialPlatform = 'kakao' | 'google';

const SocialLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      console.log('초기화 버튼 클릭: 초기화 시작');
      await GoogleSignin.signOut();
      // 저장소의 모든 데이터 삭제
      await AsyncStorage.clear();
      await EncryptedStorage.clear();

      console.log('저장소 초기화 완료');

      // 리덕스 상태를 초기화
      dispatch(userSlice.actions.resetUser());
      console.log('리덕스 resetUser 액션 디스패치 완료');

      // 앱을 로그인 화면으로 강제 리셋 (가장 확실한 방법)
      navigation.reset({
        index: 0,
        routes: [{ name: 'SocialLogin' }],
      });
      console.log('앱 초기 화면으로 강제 리셋');
    } catch (e) {
      console.error('초기화 실패', e);
    }
  };

  // 로딩 상태를 관리하는 함수
  const handleLogin = async (loginFunction: () => Promise<void>) => {
    try {
      setLoading(true);
      await loginFunction();
    } catch (err) {
      console.error('로그인 에러', err);
      // firstLoginCheck 내부의 서버 오류 Alert와 중복되지 않도록
      // SDK 레벨(앱 미설치, 사용자 취소 제외) 오류만 표시
      const code = (err as any)?.code;
      const isCancelled =
        code === 'SIGN_IN_CANCELLED' || code === 'E_CANCELLED';
      if (!isCancelled) {
        Alert.alert(
          '로그인 실패',
          '로그인 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 서버에 소셜 로그인 + 최초 로그인 체크 요청 함수
  const firstLoginCheck = async ({
    idToken,
    accessToken,
    platform,
  }: {
    idToken: string;
    accessToken: string;
    platform: SocialPlatform;
  }) => {
    try {
      console.log('>>> firstLoginCheck request', {
        platform,
        hasIdToken: Boolean(idToken),
        hasAccessToken: Boolean(accessToken),
      });

      const result = await getSocialLogin({
        idToken,
        accessToken,
        platform,
      });
      console.log('로그인 성공 후 전달받은 result : ', result);
      if (!result.success) {
        throw new Error('서버 로그인 실패');
      }

      // 서버 액세스 토큰 저장
      await EncryptedStorage.setItem(
        'serverAccessToken',
        result.serverAccessToken
      );

      // 기존 회원이면 dispatch 전에 petId를 먼저 읽어둔다.
      // (setAuth dispatch 직후 렌더에서 hasPet=false로 PetCreatePage가 노출되는 것을 방지)
      // AsyncStorage에 없으면(재설치 등) 서버에서 조회해 복원한다.
      let storedPetId: string | null = null;
      if (result.registrationStatus !== 'INCOMPLETE') {
        try {
          storedPetId = await AsyncStorage.getItem('petId');
          if (!storedPetId) {
            const userData = await getUser();
            if (userData.pet?.petId) {
              storedPetId = String(userData.pet.petId);
              await AsyncStorage.setItem('petId', storedPetId);
            }
          }
        } catch (err) {
          console.warn('petId 복원 실패', err);
          Alert.alert(
            '데이터 로드 실패',
            '사용자 정보를 불러오는 데 실패했습니다.\n잠시 후 다시 시도해주세요.'
          );
          return;
        }
      }

      // 모든 async 작업 완료 후 dispatch를 한꺼번에 처리 → 렌더 1회로 일관된 상태 적용
      dispatch(
        userSlice.actions.setAuth({
          accessToken: result.serverAccessToken,
          platform,
        })
      );

      if (result.registrationStatus === 'INCOMPLETE') {
        dispatch(userSlice.actions.setSignUpInProgress(true));
        console.log('회원가입이 완료 되지 않은 사용자');
      } else {
        if (storedPetId) {
          dispatch(userSlice.actions.setPet(Number(storedPetId)));
        }
        dispatch(userSlice.actions.setSignUpInProgress(false));
        console.log('회원가입이 완료된 사용자');
        await logLogin(platform);
      }
    } catch (err: any) {
      console.error('>>> API BASE URL: ' + API_BASE_URL);
      console.error('>>> firstLoginCheck error', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      const status = err?.response?.status;
      Alert.alert(
        '로그인 실패',
        status === 503
          ? '현재 로그인 서버가 일시적으로 응답하지 않습니다.\n잠시 후 다시 시도해주세요.'
          : '서버 통신에 오류가 발생했습니다.'
      );
    }
  };

  // 카카오 로그인 // 라이브러리 삭제 후 웹뷰 형식으로 변경 예정
  const signInWithKakao = async (): Promise<void> => {
    const token = await login();
    if (!token.idToken) {
      Alert.alert(
        '로그인 실패',
        'Kakao idToken을 받아오지 못했습니다.\nKakao OIDC 설정을 확인해주세요.'
      );
      return;
    }
    await AsyncStorage.setItem('platform', 'kakao');
    await firstLoginCheck({
      platform: 'kakao',
      idToken: token.idToken,
      accessToken: token.accessToken,
    });
  };

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      const profile = await GoogleSignin.signIn();
      const idToken = profile.data?.idToken;
      if (!idToken) {
        throw new Error('idToken 없음');
      }
      await AsyncStorage.setItem('platform', 'google');
      await firstLoginCheck({
        platform: 'google',
        idToken,
        accessToken: '',
      });
    } catch (err) {
      console.error('error', err);
      throw err;
    }
  };
  return (
    <View style={styles.container}>
      {loading ? (
        // loading이 true일 때 로딩 스피너를 보여줍니다.
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.textPrimary} />
        </View>
      ) : (
        // loading이 false일 때 버튼들을 보여줍니다.
        <>
          <View style={styles.loginIntro}>
            <Image source={LOGIN_APP_ICON} style={styles.appIcon} />
            <Text style={styles.mainText}>나와 함께 건강해지는 펫</Text>
            <Text style={styles.subText}>
              내가 건강해지면 펫도 건강해져요,{'\n'}귀여운 펫을 지금 만나요!
            </Text>
          </View>
          {__DEV__ && (
            <Pressable style={styles.kakaoButton} onPress={handleReset}>
              <Text style={styles.text}>앱 초기화 (테스트용)</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.kakaoButton}
            onPress={() => handleLogin(signInWithKakao)}
          >
            <Image
              source={require('../assets/images/icon/kakao_icon.png')}
              style={styles.kakaoIcon}
            />
            <Text style={styles.text}>카카오 계정으로 계속</Text>
          </Pressable>
          <Pressable
            style={styles.googleButton}
            onPress={() => handleLogin(signInWithGoogle)}
          >
            <Image
              source={require('../assets/images/icon/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.text}>구글 계정으로 계속</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default SocialLoginPage;
