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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  android: {
    elevation: 1,
  },
  default: {},
});

const floatingAction = Platform.select({
  ios: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
  default: {},
});

/** 화면 전체에서 쓰는 3단계 shadow preset이다. */
export const Shadows = {
  surfaceFlat,
  surfaceRaised,
  floatingAction,
};
