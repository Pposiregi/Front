import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Typography } from './theme';

const colors = {
  background: Colors.background,
  surface: Colors.surface,
  textPrimary: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textMuted: Colors.textMuted,
  divider: Colors.divider,
  chipBackground: Colors.devButton,
  chipText: Colors.surface,
  shadow: Colors.shadow,
};

const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    width: SCREEN_WIDTH - 40,
    borderRadius: 18,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: 16,
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
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mapRelocatingText: {
    marginLeft: 8,
    fontSize: Typography.caption,
    color: colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  chip: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: colors.chipText,
  },
  sectionTitle: {
    fontSize: Typography.cardTitle,
    marginBottom: 12,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  specCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  specLabel: {
    fontSize: Typography.bodySmall,
    color: colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
  specValue: {
    fontSize: Typography.bodySmall,
    color: colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  specValueGroup: {
    alignItems: 'flex-end',
  },
  specSubValue: {
    marginTop: 2,
    fontSize: Typography.caption,
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
