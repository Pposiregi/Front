import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Typography, Radius } from './theme';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'flex-start',
    marginTop: -SCREEN_HEIGHT * 0.02,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.screenTitle,
    fontWeight: '800',
    marginVertical: Spacing.sm,
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
    marginTop: SCREEN_HEIGHT * 0.07,
  },
  subtitle: {
    fontSize: Typography.body,
    fontWeight: '400',
    lineHeight: 23,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.Pretendard,
    color: Colors.textSecondary,
  },
  label: {
    fontWeight: '700',
    fontSize: Typography.label,
    fontFamily: Fonts.Pretendard,
    marginLeft: Spacing.xs,
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  requiredInfo: {
    fontSize: Typography.caption,
    color: Colors.accentStrong,
    marginBottom: SCREEN_HEIGHT * 0.04,
    fontFamily: Fonts.Pretendard,
    fontWeight: '600',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  textInputFlex: {
    flex: 1,
    fontSize: Typography.body,
    paddingVertical: Spacing.xs,
    color: Colors.textPrimary,
  },
  unit: {
    fontSize: Typography.body,
    marginLeft: Spacing.xs,
    color: Colors.textSecondary,
  },
  startButton: {
    backgroundColor: Colors.accentStrong,
    padding: 15,
    borderRadius: Radius.sm,
    marginTop: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.4,
    marginBottom: SCREEN_HEIGHT * 0.1,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.surface,
    fontSize: Typography.action,
    fontWeight: '700',
    fontFamily: Fonts.Pretendard,
  },
});
