import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts } from './theme';

const LOGIN_APP_ICON_SIZE = Math.min(SCREEN_WIDTH * 0.32, 128);

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: Colors.surface,
  },
  loginIntro: {
    width: SCREEN_WIDTH * 0.7,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.08,
  },
  appIcon: {
    width: LOGIN_APP_ICON_SIZE,
    height: LOGIN_APP_ICON_SIZE,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  mainText: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    fontFamily: Fonts.JUA,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: Fonts.GowunDodum,
    color: Colors.textSecondary,
  },
  kakaoButton: {
    backgroundColor: Colors.kakao,
    borderRadius: 40,
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: 7,
    marginTop: SCREEN_HEIGHT * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kakaoIcon: {
    width: 35,
    height: 35,
    marginRight: 22,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderRadius: 40,
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: 7,
    marginTop: SCREEN_HEIGHT * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 33,
  },
  text: {
    textAlign: 'center',
    fontFamily: Fonts.JUA,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
});
