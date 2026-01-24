import { Dimensions, StyleSheet } from 'react-native';

const { width: deviceWidth } = Dimensions.get('window');
const spacing = {
  xxs: Math.max(2, Math.round(deviceWidth * 0.005)),
  xs: Math.max(4, Math.round(deviceWidth * 0.01)),
  sm: Math.max(6, Math.round(deviceWidth * 0.015)),
  md: Math.max(8, Math.round(deviceWidth * 0.02)),
  lg: Math.max(12, Math.round(deviceWidth * 0.03)),
  xl: Math.max(16, Math.round(deviceWidth * 0.04)),
  xxl: Math.max(20, Math.round(deviceWidth * 0.05)),
};
const contentPadding = spacing.xl;
const chartPadding = spacing.lg;
const cardRadius = Math.max(14, Math.round(deviceWidth * 0.04));
const chartRadius = Math.max(10, Math.round(deviceWidth * 0.03));

const colors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textTitle: '#1F2937',
  divider: '#E5E7EB',
  accent: '#F97316',
  accentSoft: '#FDE68A',
  badgeSuccess: '#DCFCE7',
  badgeProgress: '#E0E7FF',
  shadow: '#000',
};

const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const activityTheme = {
  colors,
  spacing,
  radius: {
    card: cardRadius,
    chart: chartRadius,
    pill: 999,
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: contentPadding,
    paddingBottom: spacing.xxl * 2,
  },
  topSection: {
    marginBottom: spacing.md,
  },
  monthHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  header: {
    fontFamily: 'JUA',
    fontSize: 24,
    color: colors.textTitle,
    textAlign: 'center',
    flex: 1,
  },
  arrowButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  arrowText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontFamily: 'JUA',
  },
  subHeaderText: {
    fontFamily: 'GowunDodum',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    marginTop: spacing.md,
    ...cardShadow,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: colors.textPrimary,
  },
  summaryDateText: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: colors.badgeSuccess,
  },
  badgeProgress: {
    backgroundColor: colors.badgeProgress,
  },
  badgeMuted: {
    backgroundColor: colors.background,
  },
  badgeText: {
    fontFamily: 'GowunDodum',
    fontSize: 11,
    color: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: 'JUA',
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  summaryUnit: {
    fontFamily: 'GowunDodum',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  summaryDivider: {
    width: 1,
    height: 46,
    backgroundColor: colors.divider,
  },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: colors.textTitle,
  },
  itemContainer: {
    padding: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sessionTextColumn: {
    flexDirection: 'column',
  },
  dateText: {
    fontFamily: 'JUA',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  timeText: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: spacing.xxl,
  },
  distanceText: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: colors.accent,
    marginLeft: 'auto',
  },
  detailLink: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginLeft: spacing.lg,
    fontFamily: 'JUA',
  },
  indexText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: spacing.xl,
    fontFamily: 'JUA',
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    paddingVertical: chartPadding,
    paddingHorizontal: chartPadding,
    overflow: 'hidden',
    ...cardShadow,
  },
  chartMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  chartMetaItem: {
    flex: 1,
  },
  chartMetaDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  chartMetaLabel: {
    fontFamily: 'GowunDodum',
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  chartMetaValue: {
    fontFamily: 'JUA',
    fontSize: 15,
    color: colors.textPrimary,
  },
  chartMetaUnit: {
    fontFamily: 'GowunDodum',
    fontSize: 10,
    color: colors.textMuted,
  },
  lineChartStyle: {
    borderRadius: chartRadius,
    alignSelf: 'center',
    backgroundColor: colors.surface,
  },
  loadingIndicator: {
    marginTop: spacing.xxl,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  emptyCardTitle: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCardText: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  chartEmptyText: {
    fontFamily: 'GowunDodum',
    fontSize: 12,
    color: colors.textMuted,
  },
});
