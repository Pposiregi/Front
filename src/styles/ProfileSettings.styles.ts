import { StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Spacing, Typography } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Math.max(60, Spacing.xxl * 2 + Spacing.lg),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm - 2,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: Typography.h1,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontFamily: Fonts.JUA,
    fontSize: Typography.h1,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  section: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.background,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 2,
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  rowLabel: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  rowMuted: {
    color: Colors.textMuted,
  },
  arrow: {
    fontSize: 18,
    color: Colors.accentStrong,
  },
  actionArea: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.background,
    marginBottom: Spacing.sm + 2,
  },
  logoutText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  withdrawButton: {
    backgroundColor: Colors.errorSoft,
  },
  withdrawText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 15,
    color: Colors.errorText,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl + 4,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontFamily: Fonts.JUA,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  modalBody: {
    marginTop: Spacing.sm + 2,
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.xl - 2,
  },
  modalButton: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm + 2,
    marginLeft: Spacing.sm + 2,
  },
  modalCancel: {
    backgroundColor: Colors.background,
  },
  modalCancelText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  modalConfirm: {
    backgroundColor: Colors.accentStrong,
  },
  modalCloseButton: {
    marginTop: Spacing.md,
  },
  modalConfirmText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: Colors.surface,
  },
  input: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chipSelected: {
    borderColor: Colors.accentStrong,
    backgroundColor: Colors.accentSoft,
  },
  chipText: {
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.accentDeep,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default styles;
