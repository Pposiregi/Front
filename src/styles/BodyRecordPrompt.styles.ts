import { Platform, StyleSheet } from 'react-native';
import { Fonts } from './theme';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 6,
};

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
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
    fontFamily: Fonts.JUA,
    fontSize: 18,
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 13,
    color: '#6B7280',
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FBBF77',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  badgeIcon: {
    fontSize: 22,
  },
  field: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontFamily: Fonts.JUA,
    fontSize: 15,
    color: '#111827',
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
    fontFamily: Fonts.JUA,
    fontSize: 20,
    color: '#6B7280',
    paddingVertical: Platform.select({ ios: 4, android: 0 }),
    paddingHorizontal: 0,
  },
  fieldValue: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 13,
    color: '#4B5563',
  },
  fieldNumber: {
    fontFamily: Fonts.JUA,
    fontSize: 20,
    color: '#111827',
  },
  fieldUnit: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  progressTrackFat: {
    backgroundColor: '#EAE8FD',
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
  },
  weightProgressBar: {
    backgroundColor: '#7385F5',
  },
  fatProgressBar: {
    backgroundColor: '#7B5EF7',
  },
  aimText: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 10,
    color: '#9CA3AF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 13,
    color: '#6B7280',
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
    backgroundColor: '#F29E3E',
  },
  primaryText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
  },
  secondaryText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: '#6B7280',
  },
  skipToday: {
    marginTop: 12,
    alignItems: 'center',
  },
  skipTodayText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
