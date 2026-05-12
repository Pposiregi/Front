import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, layoutScale, Radius, Shadows, Spacing } from './theme';

const METRIC_LAYER_BOTTOM = layoutScale(26, 22, 32);
const METRIC_GRID_GAP = 0;
const METRIC_CARD_MIN_HEIGHT = Math.max(84, Math.round(SCREEN_HEIGHT * 0.082));
const METRIC_CARD_PRIMARY_MIN_HEIGHT = METRIC_CARD_MIN_HEIGHT;
const METRIC_CARD_RADIUS = Math.max(Radius.md + 2, Math.round(SCREEN_WIDTH * 0.036));
const METRIC_CARD_VERTICAL_PADDING = Math.max(
  Spacing.sm,
  Math.round(SCREEN_HEIGHT * 0.009)
);
const METRIC_CARD_PRIMARY_VERTICAL_PADDING = METRIC_CARD_VERTICAL_PADDING;
const METRIC_LABEL_FONT_SIZE = Math.max(12, Math.min(14, Math.round(SCREEN_WIDTH * 0.032)));
const METRIC_LABEL_LINE_HEIGHT = Math.round(METRIC_LABEL_FONT_SIZE * 1.25);
const METRIC_VALUE_FONT_SIZE = Math.max(
  21,
  Math.min(24, Math.round(SCREEN_WIDTH * 0.054))
);
const METRIC_VALUE_LINE_HEIGHT = Math.round(METRIC_VALUE_FONT_SIZE * 1.2);
const METRIC_VALUE_PRIMARY_FONT_SIZE = Math.max(
  22,
  Math.min(24, Math.round(SCREEN_WIDTH * 0.058))
);
const METRIC_VALUE_PRIMARY_LINE_HEIGHT = Math.round(
  METRIC_VALUE_PRIMARY_FONT_SIZE * 1.18
);
const METRIC_RUN_ICON_SIZE = layoutScale(54, 50, 62);
const METRIC_RUN_ICON_WRAP_SIZE = layoutScale(48, 44, 54);

export default StyleSheet.create({
  metricLayer: {
    position: 'absolute',
    left: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    right: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    bottom: METRIC_LAYER_BOTTOM,
    zIndex: 20,
    elevation: 20,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: METRIC_GRID_GAP,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
    overflow: 'hidden',
    ...Shadows.surfaceRaised,
  },
  metricCardShell: {
    flex: 1,
    minHeight: METRIC_CARD_MIN_HEIGHT,
    borderRadius: METRIC_CARD_RADIUS,
  },
  metricCardShellPrimary: {
    flex: 1,
    minHeight: METRIC_CARD_PRIMARY_MIN_HEIGHT,
  },
  metricCard: {
    flex: 1,
    minHeight: METRIC_CARD_MIN_HEIGHT,
    backgroundColor: 'rgba(224, 231, 255, 0.24)',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.sm,
    paddingVertical: METRIC_CARD_VERTICAL_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  metricCardPrimary: {
    flex: 1,
    minHeight: METRIC_CARD_PRIMARY_MIN_HEIGHT,
    paddingVertical: METRIC_CARD_PRIMARY_VERTICAL_PADDING,
    backgroundColor: 'rgba(255, 246, 234, 0.44)',
    borderColor: 'transparent',
    gap: 3,
  },
  metricCardKcal: {
    backgroundColor: 'rgba(255, 242, 226, 0.34)',
    borderColor: 'transparent',
  },
  metricDivider: {
    width: 1,
    alignSelf: 'center',
    height: '56%',
    backgroundColor: 'rgba(107, 114, 128, 0.14)',
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 7,
  },
  metricSmallIcon: {
    fontSize: 12,
    lineHeight: 14,
    opacity: 0.72,
  },
  metricStepIcon: {
    color: Colors.dataWeight,
  },
  metricKcalIcon: {
    color: Colors.accentDeep,
  },
  metricLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: METRIC_LABEL_FONT_SIZE,
    lineHeight: METRIC_LABEL_LINE_HEIGHT,
    fontWeight: '700',
    letterSpacing: 0,
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
  metricValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: METRIC_VALUE_FONT_SIZE,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: METRIC_VALUE_LINE_HEIGHT,
    includeFontPadding: false,
  },
  metricUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: Math.max(11, Math.min(13, Math.round(SCREEN_WIDTH * 0.03))),
    fontWeight: '700',
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
  metricGoalRow: {
    width: '100%',
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricGoalText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
  metricMiniTrack: {
    width: Math.max(32, Math.round(SCREEN_WIDTH * 0.085)),
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(107, 114, 128, 0.14)',
    overflow: 'hidden',
  },
  metricMiniFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  metricMiniFillStep: {
    backgroundColor: 'rgba(37, 99, 235, 0.72)',
  },
  metricMiniFillKcal: {
    backgroundColor: 'rgba(220, 38, 38, 0.68)',
  },
  metricValuePrimary: {
    fontFamily: Fonts.Pretendard,
    fontSize: METRIC_VALUE_PRIMARY_FONT_SIZE,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: METRIC_VALUE_PRIMARY_LINE_HEIGHT,
    includeFontPadding: false,
  },
  metricRunIcon: {
    width: Math.round(METRIC_RUN_ICON_SIZE * 0.72),
    height: Math.round(METRIC_RUN_ICON_SIZE * 0.72),
  },
  metricRunIconWrap: {
    width: METRIC_RUN_ICON_WRAP_SIZE,
    height: METRIC_RUN_ICON_WRAP_SIZE,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
    ...Shadows.floatingAction,
  },
});
