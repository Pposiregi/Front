import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Typography, Radius } from './theme';
import { SCREEN_HEIGHT } from './dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
    paddingTop: SCREEN_HEIGHT * 0.04,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: '800',
    marginVertical: Spacing.md,
    textAlign: 'center',
    fontFamily: Fonts.JUA,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.body,
    fontWeight: 'thin',
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontFamily: Fonts.GowunDodum,
    color: Colors.textPrimary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  checkboxWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allCheckboxLabel: {
    marginLeft: Spacing.sm,
    fontSize: Typography.body,
    fontFamily: Fonts.Pretendard,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.body,
    fontFamily: Fonts.Pretendard,
    color: Colors.textPrimary,
  },
  requiredBadge: {
    color: Colors.accentStrong,
    fontWeight: '600',
  },
  optionalBadge: {
    color: Colors.textSecondary,
  },
  // 약관 항목 행 (체크 영역 + 화살표 버튼)
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  termCheckArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  arrowText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontFamily: Fonts.Pretendard,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.sm,
  },
  startButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: Radius.sm,
    marginTop: Spacing.xxl,
    alignItems: 'center',
    width: 150,
  },
  startButtonText: {
    color: Colors.surface,
    fontSize: Typography.body,
    fontFamily: Fonts.JUA,
  },
});
