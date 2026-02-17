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
  shadowOpacity: 0.07,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
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
    marginBottom: spacing.lg,
  },
  monthHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTextWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    fontFamily: 'JUA',
    fontSize: 24,
    color: colors.textTitle,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  arrowButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  arrowText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontFamily: 'JUA',
  },
  arrowTextDisabled: {
    color: colors.textMuted,
  },
  subHeaderText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    ...cardShadow,
  },
  summaryMetaRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  summaryDateText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textMuted,
  },
  summaryNotice: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressValue: {
    fontFamily: 'JUA',
    fontSize: 20,
    color: colors.textPrimary,
  },
  progressTarget: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  heroMetrics: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  heroMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  heroMetricLabel: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textSecondary,
  },
  heroMetricValue: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: colors.textPrimary,
  },
  heroMetricDivider: {
    height: 1,
    backgroundColor: colors.divider,
    alignSelf: 'stretch',
  },
  heroComment: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
    fontFamily: 'Roboto-VariableFont',
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
    fontFamily: 'Roboto-VariableFont',
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
    fontFamily: 'Roboto-VariableFont',
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
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'JUA',
    fontSize: 18,
    color: colors.textTitle,
    marginRight: spacing.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 999,
    padding: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  segmentedButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: Math.max(64, Math.round(deviceWidth * 0.18)),
  },
  segmentedButtonActive: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    ...cardShadow,
  },
  segmentedText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textSecondary,
  },
  segmentedTextActive: {
    fontFamily: 'JUA',
    color: colors.accent,
  },
  itemContainer: {
    padding: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...cardShadow,
  },
  listCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.divider,
    ...cardShadow,
  },
  listMarker: {
    width: Math.max(10, Math.round(deviceWidth * 0.03)),
    height: Math.max(10, Math.round(deviceWidth * 0.03)),
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: spacing.md,
  },
  listTextColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  listTitle: {
    fontFamily: 'JUA',
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  listSubtitle: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    lineHeight: 16,
  },
  listMeta: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  listRight: {
    minWidth: Math.max(92, Math.round(deviceWidth * 0.24)),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: spacing.lg,
    marginRight: spacing.xs,
  },
  listDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listValue: {
    fontFamily: 'JUA',
    fontSize: 14,
    color: colors.textPrimary,
  },
  listValueAccent: {
    color: colors.accent,
  },
  listValueNumber: {
    fontSize: 15,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  listValueUnit: {
    marginLeft: spacing.xxs,
    fontFamily: 'Roboto-VariableFont',
    fontSize: 11,
    color: colors.textSecondary,
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
    fontFamily: 'Roboto-VariableFont',
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
    fontSize: 16,
    color: colors.textMuted,
    fontFamily: 'JUA',
    marginLeft: spacing.sm,
    lineHeight: 16,
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
    fontFamily: 'Roboto-VariableFont',
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
    fontFamily: 'Roboto-VariableFont',
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
    borderWidth: 1,
    borderColor: colors.divider,
    ...cardShadow,
  },
  emptyCardTitle: {
    fontFamily: 'JUA',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCardText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  chartEmptyText: {
    fontFamily: 'Roboto-VariableFont',
    fontSize: 12,
    color: colors.textMuted,
  },
});
