/**
 * @format
 */

import { AppRegistry, NativeModules, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundMessageHandler } from './src/services/backgroundMessaging';
import notifee, { EventType } from '@notifee/react-native';

// 알림창이 떠 있는 동안 백그라운드 프로세스를 유지해주는 등록 로직
notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // 이 핸들러는 포그라운드 서비스가 실행되는 동안 유지됩니다.
    // 특별한 작업을 하지 않아도 알림 유지를 위해 Promise를 유지합니다.
  });
});

// 2. 백그라운드 이벤트 핸들러 설정 (이게 있어야 지금 뜨는 에러 해결)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // 사용자가 알림을 클릭했을 때 등의 로직을 처리할 수 있습니다.
  if (type === EventType.PRESS && pressAction?.id === 'default') {
    console.log('사용자가 백그라운드에서 알림을 클릭함');
    // 필요한 경우 알림 제거
    // await notifee.cancelNotification(notification.id);
  }
});

if (__DEV__) {
  console.log('>>> Platform.OS =', Platform.OS);
  console.log('>>> RNDeviceInfo =', NativeModules.RNDeviceInfo);
}
// FCM 백그라운드 데이터 메시지 핸들러 등록
registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
