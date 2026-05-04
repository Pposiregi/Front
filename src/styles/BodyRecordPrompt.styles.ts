import { Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, Typography } from './theme';

const cardShadow = {
  shadowColor: Colors.shadow,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 6,
};

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlaySoft,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.cardTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  badgeIcon: {
    fontSize: Typography.sectionTitle,
  },
  field: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: cardShadow,
      android: { ...cardShadow, elevation: 2 },
    }),
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fieldLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    fontWeight: '700',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  fieldRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fieldInput: {
    minWidth: 64,
    textAlign: 'right',
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodyLarge,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.textSecondary,
    paddingVertical: Platform.select({ ios: 4, android: 0 }),
    paddingHorizontal: 0,
  },
  fieldValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  fieldNumber: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodyLarge,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fieldUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 10,
    backgroundColor: Colors.divider,
    marginTop: 8,
  },
  progressTrackFat: {
    backgroundColor: Colors.accentSoft,
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
  },
  weightProgressBar: {
    backgroundColor: Colors.dataWeight,
  },
  fatProgressBar: {
    backgroundColor: Colors.dataBodyFat,
  },
  aimText: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    lineHeight: 17,
    color: Colors.textMuted,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: Typography.bodySmall,
    marginRight: 6,
  },
  infoText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accentStrong,
  },
  primaryText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: Colors.surface,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.background,
  },
  secondaryText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  skipToday: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipTodayText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
