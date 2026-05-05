import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Typography } from './theme';

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
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
    ...Shadows.surfaceFlat,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.action,
    color: Colors.textPrimary,
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
    fontSize: Typography.caption,
    fontWeight: '700',
    textAlign: 'right',
    color: Colors.accentStrong,
  },
  readyCard: {
    backgroundColor: Colors.accentStrong,
    borderColor: Colors.accentStrong,
  },
  readyTitle: {
    color: Colors.surface,
  },
  readyText: {
    color: Colors.surface,
  },
});
