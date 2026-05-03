import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Typography } from './theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.body,
    fontWeight: '700',
    fontFamily: Fonts.Pretendard,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontFamily: Fonts.Pretendard,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    fontSize: Typography.caption,
    fontFamily: Fonts.Pretendard,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  errorText: {
    padding: Spacing.lg,
    fontSize: Typography.caption,
    fontFamily: Fonts.Pretendard,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
