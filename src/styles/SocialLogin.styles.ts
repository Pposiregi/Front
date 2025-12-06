import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  mainText: {
    fontSize: 50,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: SCREEN_HEIGHT * 0.23,
    fontFamily: 'JUA',
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
