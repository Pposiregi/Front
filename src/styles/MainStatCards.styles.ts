import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Spacing } from './theme';

const METRIC_CARD_SURFACE = 'rgba(255, 255, 255, 0.78)';
const METRIC_CARD_BORDER = 'rgba(255, 255, 255, 0.6)';

export default StyleSheet.create({
  metricLayer: {
    position: 'absolute',
    left: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    right: Math.max(Spacing.md - 2, Math.round(SCREEN_WIDTH * 0.03)),
    top: Math.max(18, Math.round(SCREEN_HEIGHT * 0.028)),
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: Spacing.md - 2,
  },
  metricCardShell: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radius.md + 2,
  },
  metricCardShellPrimary: {
    flex: 1.45,
    minHeight: 72,
  },
  metricCard: {
    flex: 1,
    minHeight: 48,
    backgroundColor: METRIC_CARD_SURFACE,
    borderRadius: Radius.md + 2,
    borderWidth: 1,
    borderColor: METRIC_CARD_BORDER,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  metricCardPrimary: {
    flex: 1,
    minHeight: 72,
    paddingVertical: Spacing.sm,
  },
  metricLabel: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(16, Math.round(SCREEN_WIDTH * 0.045)),
    color: Colors.textPrimary,
    lineHeight: Math.max(19, Math.round(SCREEN_WIDTH * 0.052)),
    includeFontPadding: false,
  },
  metricValuePrimary: {
    fontFamily: Fonts.JUA,
    fontSize: Math.max(22, Math.round(SCREEN_WIDTH * 0.058)),
    color: Colors.textPrimary,
    lineHeight: Math.max(26, Math.round(SCREEN_WIDTH * 0.064)),
    includeFontPadding: false,
  },
});
