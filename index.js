/**
 * @format
 */

import { AppRegistry, NativeModules, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundMessageHandler } from './src/services/backgroundMessaging';

if (__DEV__) {
  console.log('>>> Platform.OS =', Platform.OS);
  console.log('>>> RNDeviceInfo =', NativeModules.RNDeviceInfo);
}
// FCM 백그라운드 데이터 메시지 핸들러 등록
registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
