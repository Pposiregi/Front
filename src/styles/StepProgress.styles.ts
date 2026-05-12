import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

const CARD_WIDTH = Math.max(
  128,
  Math.min(138, Math.round(SCREEN_WIDTH * 0.345))
);
const CARD_HEIGHT = Math.max(
  60,
  Math.min(68, Math.round(SCREEN_HEIGHT * 0.061))
);

export default StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 17,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
    overflow: 'hidden',
    ...Shadows.surfaceRaised,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 5,
  },
  cardIcon: {
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.58,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.JUA,
    fontSize: Typography.caption,
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(107, 114, 128, 0.18)',
    overflow: 'hidden',
  },
  readyProgressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  progressFillGloss: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  completeHint: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 96,
    height: 60,
    opacity: 0.3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },
  currentValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    fontWeight: '800',
  },
  goalValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.meta,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  readyCard: {
    backgroundColor: Colors.surfaceOverlaySolid,
    borderColor: Colors.accent,
  },
  readyTitle: {
    color: Colors.textPrimary,
  },
  readyText: {
    color: Colors.textPrimary,
  },
});
