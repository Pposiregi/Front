import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

const LOGIN_TEXT_COLOR = '#2B2B2B';
const LOGIN_BACKGROUND_COLOR = '#FFFFFF';
const LOGIN_APP_ICON_SIZE = Math.min(SCREEN_WIDTH * 0.32, 128);

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: LOGIN_BACKGROUND_COLOR,
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
    fontFamily: 'GowunDodum',
    fontWeight: '800',
    color: LOGIN_TEXT_COLOR,
  },
  subText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'GowunDodum',
    color: '#686868',
  },
  kakaoButton: {
    backgroundColor: '#FDDC3F',
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
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'GowunDodum',
    fontWeight: '800',
    color: LOGIN_TEXT_COLOR,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LOGIN_BACKGROUND_COLOR,
  },
});
