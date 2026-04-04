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
  Spacing.xs + 1,
  Math.round(SCREEN_HEIGHT * 0.007)
);
const METRIC_CARD_PRIMARY_VERTICAL_PADDING = Math.max(
  Spacing.sm,
  Math.round(SCREEN_HEIGHT * 0.01)
);
const METRIC_LABEL_FONT_SIZE = Math.max(10, Math.round(SCREEN_WIDTH * 0.026));
const METRIC_LABEL_MARGIN_BOTTOM = Math.max(2, Math.round(SCREEN_HEIGHT * 0.003));
const METRIC_VALUE_FONT_SIZE = Math.max(16, Math.round(SCREEN_WIDTH * 0.045));
const METRIC_VALUE_LINE_HEIGHT = Math.max(19, Math.round(SCREEN_WIDTH * 0.052));
const METRIC_VALUE_PRIMARY_FONT_SIZE = Math.max(
  22,
  Math.round(SCREEN_WIDTH * 0.058)
);
const METRIC_VALUE_PRIMARY_LINE_HEIGHT = Math.max(
  26,
  Math.round(SCREEN_WIDTH * 0.064)
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
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: METRIC_LABEL_FONT_SIZE,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: Colors.textSecondary,
    marginBottom: METRIC_LABEL_MARGIN_BOTTOM,
  },
  metricValue: {
    fontFamily: Fonts.JUA,
    fontSize: METRIC_VALUE_FONT_SIZE,
    color: Colors.textPrimary,
    lineHeight: METRIC_VALUE_LINE_HEIGHT,
    includeFontPadding: false,
  },
  metricValuePrimary: {
    fontFamily: Fonts.JUA,
    fontSize: METRIC_VALUE_PRIMARY_FONT_SIZE,
    color: Colors.textPrimary,
    lineHeight: METRIC_VALUE_PRIMARY_LINE_HEIGHT,
    includeFontPadding: false,
  },
});
