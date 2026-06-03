import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows, Spacing, Typography } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.screenTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  pageSubtitle: {
    marginTop: Spacing.xxs,
    marginBottom: Spacing.md,
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  tabHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    ...Shadows.surfaceRaised,
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: Colors.textPrimary,
  },
  tabText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.surface,
  },
  // 모달
  modalBackground: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '85%',
  },
  fullScreenImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTextContainer: {
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: Typography.screenTitle,
    marginBottom: 5,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
  },
  modalKcalText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
});
