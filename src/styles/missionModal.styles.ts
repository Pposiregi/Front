import { StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

/**
 * 미션 UI
 */
export default StyleSheet.create({
  missionView: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '92%',
    maxHeight: '82%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.divider,
    ...Shadows.floatingAction,
  },

  missionTitle: {
    fontSize: Typography.screenTitle,
    marginBottom: Spacing.md,
    fontFamily: Fonts.Pretendard,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  tabRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    padding: 4,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },

  tabButton: {
    flex: 1,
    minHeight: 38,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },

  tabButtonActive: {
    backgroundColor: Colors.textPrimary,
  },

  tabText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  tabTextActive: {
    color: Colors.surface,
  },

  emptyMissionText: {
    fontSize: Typography.bodyLarge,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
  missionList: {
    marginHorizontal: -Spacing.xs,
  },
  missionListContent: {
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  devMissionNotice: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  missionUICard: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.md,
  },

  missionUICardReadbyBorder: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.divider,
  },

  missionUICardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  missionIcon: {
    fontSize: Typography.h2,
    width: 34,
    height: 34,
    marginRight: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.infoSoft,
    textAlign: 'center',
    lineHeight: 34,
  },

  missionUITextTitle: {
    fontSize: Typography.sectionTitle,
    fontFamily: Fonts.Pretendard,
    fontWeight: '800',
    color: Colors.textPrimary,
    flexShrink: 1,
  },

  flexEndContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  completeButton: {
    backgroundColor: Colors.accentStrong,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 58,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  completeButtonDisabled: {
    backgroundColor: Colors.background,
  },

  completeButtonText: {
    fontSize: Typography.bodySmall,
    color: Colors.surface,
    fontFamily: Fonts.Pretendard,
    fontWeight: '800',
  },

  completeButtonTextDisabled: {
    color: Colors.textSecondary,
  },

  missionUIText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
    fontWeight: '800',
    textAlign: 'right',
  },

  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },

  progressBarForeground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },

  missionUIExitButton: {
    marginTop: Spacing.sm,
    minHeight: 46,
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  missionUIExitText: {
    color: Colors.surface,
    fontSize: Typography.action,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
  },

  summaryBox: {
    width: '85%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
  },

  summaryTitle: {
    fontSize: Typography.screenTitle,
    marginBottom: 12,
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  summaryList: {
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  summaryLabel: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },

  summaryValue: {
    fontSize: Typography.bodyLarge,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },

  summaryValueGroup: {
    alignItems: 'flex-end',
  },

  summarySubValue: {
    marginTop: 2,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontFamily: Fonts.Pretendard,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },

  summaryCaption: {
    marginTop: 4,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontFamily: Fonts.Pretendard,
    textAlign: 'right',
  },
});
