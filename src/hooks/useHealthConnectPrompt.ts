import { useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  SdkAvailabilityStatus,
  getSdkStatus,
  initialize,
} from 'react-native-health-connect';

type UseHealthConnectPromptOptions = {
  enabled: boolean;
};

/**
 * 안드로이드에서 Health Connect 앱의 설치 및 업데이트를 사용자에게 요청하는 훅
 * 사실, Android 14 이상에서는 Health Connect가 기본 내장되어 있지만,
 * 하위 버전에서는 별도의 설치가 필요하다.
 *
 * @param enabled 훅이 활성화될지 여부를 결정하는 플래그
 * @returns noting
 */
const alertTitle = 'Health Connect 설치 필요';
const installMessage =
  'FitPet의 주요 기능을 사용하려면 Health Connect 앱 설치가 필요합니다. 지금 설치하시겠어요?';
const updateMessage =
  'FitPet의 주요 기능을 사용하려면 Health Connect 앱을 최신 버전으로 업데이트해야 합니다. 지금 이동할까요?';
const marketUrl = 'market://details?id=com.google.android.apps.healthdata';
const webUrl =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

/**
 * Health Connect 앱의 스토어 페이지를 여는 함수
 * @returns nothing
 */
const openStorePage = async () => {
  const tryOpen = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  };

  const openedMarket = await tryOpen(marketUrl);
  if (!openedMarket) {
    await tryOpen(webUrl);
  }
};

/**
 *  헬스 커넥트 권한 요청 훅
 * @param param0  enabled: 훅 활성화 여부
 * @returns  nothing
 */
const useHealthConnectPrompt = ({ enabled }: UseHealthConnectPromptOptions) => {
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android' || hasPromptedRef.current) {
      if (__DEV__) {
        console.log(
          '[HealthConnect] prompt skipped',
          JSON.stringify({
            enabled,
            platform: Platform.OS,
            alreadyPrompted: hasPromptedRef.current,
          })
        );
      }
      return;
    }

    /**
     *  Health Connect SDK 상태를 확인하고,
     *  필요시 사용자에게 설치 또는 업데이트를 요청하는 함수
     * @returns  nothing
     */
    const ensureHealthConnect = async () => {
      try {
        const status = await getSdkStatus();
        if (__DEV__) {
          console.log('[HealthConnect] SDK status', status);
        }

        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
          const initialized = await initialize();
          if (__DEV__) {
            console.log('[HealthConnect] initialize result', initialized);
          }
          return;
        }

        hasPromptedRef.current = true;

        const message =
          status ===
          SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
            ? updateMessage
            : installMessage;

        Alert.alert(alertTitle, message, [
          { text: '나중에', style: 'cancel' },
          {
            text: '설치/업데이트',
            onPress: () => {
              openStorePage();
            },
          },
        ]);
      } catch (error) {
        if (__DEV__) {
          console.log('[HealthConnect] status check error', error);
        }
        console.warn('[HealthConnect] 상태 확인 실패', error);
      }
    };

    ensureHealthConnect();
  }, [enabled]);
};

export default useHealthConnectPrompt;
