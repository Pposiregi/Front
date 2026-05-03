import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Spacing } from './theme';

const METRIC_LAYER_TOP = Math.max(18, Math.round(SCREEN_HEIGHT * 0.028));
const METRIC_GRID_GAP = Math.max(Spacing.sm, Math.round(SCREEN_WIDTH * 0.022));
const METRIC_CARD_MIN_HEIGHT = Math.max(48, Math.round(SCREEN_HEIGHT * 0.06));
const METRIC_CARD_PRIMARY_MIN_HEIGHT = Math.max(
  72,
  Math.round(SCREEN_HEIGHT * 0.09)
);
const METRIC_CARD_RADIUS = Math.max(Radius.md + 2, Math.round(SCREEN_WIDTH * 0.036));
const METRIC_CARD_VERTICAL_PADDING = Math.max(
  Spacing.sm,
  Math.round(SCREEN_HEIGHT * 0.009)
);
const METRIC_CARD_PRIMARY_VERTICAL_PADDING = Math.max(
  Spacing.sm + 2,
  Math.round(SCREEN_HEIGHT * 0.012)
);
const METRIC_LABEL_FONT_SIZE = Math.max(
  13,
  Math.min(15, Math.round(SCREEN_WIDTH * 0.034))
);
const METRIC_LABEL_LINE_HEIGHT = Math.round(METRIC_LABEL_FONT_SIZE * 1.25);
const METRIC_LABEL_MARGIN_BOTTOM = Math.max(4, Math.round(SCREEN_HEIGHT * 0.005));
const METRIC_VALUE_FONT_SIZE = Math.max(
  17,
  Math.min(19, Math.round(SCREEN_WIDTH * 0.046))
);
const METRIC_VALUE_LINE_HEIGHT = Math.round(METRIC_VALUE_FONT_SIZE * 1.2);
const METRIC_VALUE_PRIMARY_FONT_SIZE = Math.max(
  22,
  Math.min(24, Math.round(SCREEN_WIDTH * 0.058))
);
const METRIC_VALUE_PRIMARY_LINE_HEIGHT = Math.round(
  METRIC_VALUE_PRIMARY_FONT_SIZE * 1.18
);

export default StyleSheet.create({
  metricLayer: {
    position: 'absolute',
    left: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    right: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    top: METRIC_LAYER_TOP,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: METRIC_GRID_GAP,
  },
  metricCardShell: {
    flex: 1,
    minHeight: METRIC_CARD_MIN_HEIGHT,
    borderRadius: METRIC_CARD_RADIUS,
  },
  metricCardShellPrimary: {
    flex: 1.45,
    minHeight: METRIC_CARD_PRIMARY_MIN_HEIGHT,
  },
  metricCard: {
    flex: 1,
    minHeight: METRIC_CARD_MIN_HEIGHT,
    backgroundColor: Colors.surfaceOverlayStrong,
    borderRadius: METRIC_CARD_RADIUS,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
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
  },
  metricLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: METRIC_LABEL_FONT_SIZE,
    lineHeight: METRIC_LABEL_LINE_HEIGHT,
    fontWeight: '700',
    letterSpacing: 0,
    color: Colors.textSecondary,
    marginBottom: METRIC_LABEL_MARGIN_BOTTOM,
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
  metricValuePrimary: {
    fontFamily: Fonts.Pretendard,
    fontSize: METRIC_VALUE_PRIMARY_FONT_SIZE,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: METRIC_VALUE_PRIMARY_LINE_HEIGHT,
    includeFontPadding: false,
  },
});
