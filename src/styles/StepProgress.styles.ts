import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts } from './theme';

const CARD_WIDTH = Math.max(
  150,
  Math.min(220, Math.round(SCREEN_WIDTH * 0.42))
);
const CARD_HEIGHT = Math.max(
  80,
  Math.min(110, Math.round(SCREEN_HEIGHT * 0.08))
);

export default StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontFamily: Fonts.Pretendard,
    fontSize: 16,
    marginBottom: 8,
  },
  completeHint: {
    position: 'absolute',
    left: '10%', // 가로 중앙
    width: 130, // 크기 조절
    height: 80,
  },
  text: {
    fontFamily: Fonts.Pretendard,
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },
  readyCard: {
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
    shadowOpacity: 0.15,
    elevation: 6,
  },
});
