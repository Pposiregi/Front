import { StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

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
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    fontFamily: Fonts.Pretendard,
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
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    color: Colors.textPrimary,
  },
  rowMuted: {
    color: Colors.textMuted,
  },
  arrow: {
    fontSize: Typography.cardTitle,
    color: Colors.accentStrong,
  },
  actionArea: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  actionButton: {
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Shadows.surfaceRaised,
  },
  actionButtonDisabled: {
    opacity: 0.58,
  },
  actionButtonText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.label,
    fontWeight: '800',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  logoutText: {
    color: Colors.surface,
  },
  withdrawButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.errorSoft,
  },
  withdrawText: {
    color: Colors.errorText,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl + 4,
  },
  keyboardModalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.cardTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalBody: {
    marginTop: Spacing.sm + 2,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
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
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  modalConfirm: {
    backgroundColor: Colors.accentStrong,
  },
  modalCloseButton: {
    marginTop: Spacing.md,
  },
  modalConfirmText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: Colors.surface,
  },
  faqList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.background,
  },
  faqListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  faqListTitle: {
    flex: 1,
    paddingRight: Spacing.md,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.label,
    color: Colors.textPrimary,
  },
  faqDetail: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.background,
  },
  faqQuestion: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.label,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  faqAnswer: {
    marginTop: Spacing.sm,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  input: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.label,
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
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
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
