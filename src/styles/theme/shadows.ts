import { Platform } from 'react-native';
import { Colors } from './colors';

/** 플랫폼별 공용 shadow preset 모음이다. */
export const Shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  medium: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 7,
    },
    android: {
      elevation: 7,
    },
    default: {},
  }),
  accent: Platform.select({
    ios: {
      shadowColor: Colors.shadowAccent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    android: {
      shadowColor: Colors.shadowAccent,
      elevation: 5,
    },
    default: {},
  }),
};
