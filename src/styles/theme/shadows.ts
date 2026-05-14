import { Platform } from 'react-native';
import { Colors } from './colors';

const surfaceFlat = Platform.select({
  ios: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  android: {
    elevation: 0,
  },
  default: {},
});

const surfaceRaised = Platform.select({
  ios: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

const floatingAction = Platform.select({
  ios: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

/** 화면 전체에서 쓰는 3단계 shadow preset이다. */
export const Shadows = {
  surfaceFlat,
  surfaceRaised,
  floatingAction,
};
