/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Backend 상태에서 오는 데이터 메시지를 처리하기 위한 핸들러
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM][background] message received', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
