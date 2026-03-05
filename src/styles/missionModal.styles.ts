import { StyleSheet } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

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
    width: '95%',
    height: '83%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },

  missionTitle: {
    fontSize: Typography.h1,
    marginBottom: 12,
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
  },

  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  tabButtonActive: {
    backgroundColor: Colors.accentStrong,
  },

  tabText: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.body,
    color: Colors.textPrimary,
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

  missionUICard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: Colors.divider,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderRadius: 12,
  },

  missionUICardReadbyBorder: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 12,
  },

  missionUICardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  missionIcon: {
    fontSize: Typography.h2,
    marginRight: 8,
  },

  missionUITextTitle: {
    fontSize: Typography.h2,
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
  },

  flexEndContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  completeButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    minWidth: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  completeButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  completeButtonText: {
    fontSize: Typography.body,
    color: Colors.surface,
    fontFamily: Fonts.Roboto_VariableFont,
  },

  completeButtonTextDisabled: {
    color: Colors.textSecondary,
  },

  missionUIText: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontFamily: Fonts.Roboto_VariableFont,
    fontWeight: 'bold',
  },

  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface,
    marginVertical: 8,
    overflow: 'hidden',
  },

  progressBarForeground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },

  missionUIExitButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  missionUIExitText: {
    color: Colors.surface,
    fontSize: Typography.h2,
    fontFamily: Fonts.JUA,
  },

  summaryBox: {
    width: '85%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
  },

  summaryTitle: {
    fontSize: Typography.h1,
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
    fontFamily: Fonts.JUA,
  },

  summaryValue: {
    fontSize: Typography.bodyLarge,
    color: Colors.textPrimary,
    fontFamily: Fonts.JUA,
  },

  summaryValueGroup: {
    alignItems: 'flex-end',
  },

  summarySubValue: {
    marginTop: 2,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontFamily: Fonts.Roboto_VariableFont,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },

  summaryCaption: {
    marginTop: 4,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    fontFamily: Fonts.JUA,
    textAlign: 'right',
  },
});
