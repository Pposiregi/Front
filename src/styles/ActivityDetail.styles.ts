import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import {
  cardRadius,
  Colors,
  Fonts,
  screenPadding,
  Shadows,
  Spacing,
  Typography,
} from './theme';

const colors = {
  background: Colors.background,
  surface: Colors.surface,
  textPrimary: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textMuted: Colors.textMuted,
  divider: Colors.divider,
};

const cardShadow = Shadows.surfaceRaised;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: Typography.action,
    color: colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
  mapFrame: {
    height: SCREEN_HEIGHT * 0.36,
    width: SCREEN_WIDTH - screenPadding * 2,
    borderRadius: cardRadius,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
    ...cardShadow,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapRelocatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceOverlay,
  },
  mapRelocatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceOverlaySolid,
    ...Shadows.surfaceRaised,
  },
  mapRelocatingText: {
    marginLeft: 8,
    fontSize: Typography.caption,
    color: colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  chip: {
    backgroundColor: Colors.surfaceOverlaySolid,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderOverlay,
  },
  chipText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.h1,
    lineHeight: Math.round(Typography.h1 * 1.16),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: Spacing.md,
  },
  specCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: 6,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  specLabel: {
    fontSize: Typography.bodySmall,
    color: colors.textSecondary,
    fontFamily: Fonts.Pretendard,
    fontWeight: '600',
  },
  specValue: {
    fontSize: Typography.cardTitle,
    color: colors.textPrimary,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
  },
  specValueGroup: {
    alignItems: 'flex-end',
  },
  specSubValue: {
    marginTop: 2,
    fontSize: Typography.bodySmall,
    color: colors.textMuted,
    fontFamily: Fonts.Pretendard,
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  mapBlocker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: Typography.label,
    color: colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
});
