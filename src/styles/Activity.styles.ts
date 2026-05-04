import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

const { width: deviceWidth } = Dimensions.get('window');
const spacing = {
  xxs: Math.max(Spacing.xxs, Math.round(deviceWidth * 0.005)),
  xs: Math.max(Spacing.xs, Math.round(deviceWidth * 0.01)),
  sm: Math.max(Spacing.sm - 2, Math.round(deviceWidth * 0.015)),
  md: Math.max(Spacing.sm, Math.round(deviceWidth * 0.02)),
  lg: Math.max(Spacing.md, Math.round(deviceWidth * 0.03)),
  xl: Math.max(Spacing.lg, Math.round(deviceWidth * 0.04)),
  xxl: Math.max(Spacing.xl, Math.round(deviceWidth * 0.05)),
};
const contentPadding = spacing.xl;
const chartPadding = spacing.lg;
const cardRadius = Math.max(Radius.md + 2, Math.round(deviceWidth * 0.04));
const chartRadius = Math.max(Radius.sm + 2, Math.round(deviceWidth * 0.03));
const headerFont = Math.max(Typography.h1, Math.round(deviceWidth * 0.06));
const subHeaderFont = Math.max(
  Typography.bodySmall,
  Math.round(deviceWidth * 0.035)
);
const metaFont = Math.max(Typography.caption, Math.round(deviceWidth * 0.03));
const metricFont = Math.max(Typography.body, Math.round(deviceWidth * 0.042));
const statNumberFont = Math.max(
  Typography.h2,
  Math.min(24, Math.round(deviceWidth * 0.056))
);
const weeklyStatNumberFont = Math.max(
  Typography.bodyLarge,
  Math.min(20, Math.round(deviceWidth * 0.048))
);
const statUnitFont = Math.max(
  Typography.caption,
  Math.min(14, Math.round(deviceWidth * 0.034))
);
const sectionTitleFont = Typography.h1;
const sectionTitleLineHeight = Math.round(sectionTitleFont * 1.16);
const runningColors = {
  background: Colors.background,
  surface: Colors.surface,
  surfaceHigh: Colors.surface,
  surfaceSoft: Colors.background,
  textPrimary: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textMuted: Colors.textMuted,
  divider: Colors.divider,
  border: Colors.divider,
  orange: Colors.accentStrong,
  orangeStrong: Colors.accentStrong,
  white: Colors.surface,
};

const cardShadow = {
  ...Shadows.soft,
  shadowColor: Colors.shadow,
  shadowOpacity: 0.045,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 1,
};

export const activityTheme = {
  colors: {
    ...Colors,
    background: runningColors.background,
    surface: runningColors.surface,
    textPrimary: runningColors.textPrimary,
    textSecondary: runningColors.textSecondary,
    textMuted: runningColors.textMuted,
    divider: runningColors.divider,
    accent: runningColors.orange,
    accentStrong: runningColors.orange,
    accentDeep: runningColors.orangeStrong,
  },
  spacing,
  radius: {
    card: cardRadius,
    chart: chartRadius,
    pill: Radius.pill,
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: runningColors.background,
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
    fontFamily: Fonts.Pretendard,
    fontSize: headerFont,
    fontWeight: '700',
    color: runningColors.textPrimary,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textMuted,
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
    fontSize: Typography.sectionTitle,
    color: runningColors.textPrimary,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
  },
  arrowTextDisabled: {
    color: runningColors.textMuted,
  },
  subHeaderText: {
    fontFamily: Fonts.Pretendard,
    fontSize: subHeaderFont,
    color: runningColors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    position: 'relative',
    backgroundColor: runningColors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: runningColors.border,
    ...cardShadow,
  },
  cardSurfaceLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: runningColors.surface,
  },
  summaryMetaRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  summaryDateText: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textMuted,
  },
  summaryNotice: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textSecondary,
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
    fontFamily: Fonts.Pretendard,
    fontSize: statNumberFont,
    lineHeight: Math.round(statNumberFont * 1.16),
    fontWeight: '800',
    color: runningColors.textPrimary,
  },
  progressTarget: {
    fontFamily: Fonts.Pretendard,
    fontSize: statUnitFont,
    lineHeight: Math.round(statUnitFont * 1.25),
    color: runningColors.orange,
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
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textSecondary,
  },
  heroMetricValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: statNumberFont,
    lineHeight: Math.round(statNumberFont * 1.16),
    fontWeight: '800',
    color: runningColors.textPrimary,
  },
  heroMetricDivider: {
    height: 1,
    backgroundColor: runningColors.divider,
    alignSelf: 'stretch',
  },
  heroComment: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
    marginTop: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: Radius.pill,
  },
  badgeSuccess: {
    backgroundColor: runningColors.orange,
  },
  badgeProgress: {
    backgroundColor: runningColors.surfaceSoft,
  },
  badgeMuted: {
    backgroundColor: runningColors.surfaceSoft,
  },
  badgeText: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textPrimary,
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
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
  },
  summaryValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.h2,
    color: runningColors.textPrimary,
    marginTop: spacing.sm,
  },
  summaryUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textMuted,
    marginTop: spacing.xxs,
  },
  summaryDivider: {
    width: 1,
    height: 46,
    backgroundColor: runningColors.divider,
  },
  sectionHeader: {
    minHeight: Math.max(34, sectionTitleLineHeight),
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    minHeight: Math.max(34, sectionTitleLineHeight),
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleIcon: {
    width: 26,
    height: 26,
    marginRight: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: sectionTitleFont,
    lineHeight: sectionTitleLineHeight,
    fontWeight: '700',
    color: runningColors.textPrimary,
    marginRight: spacing.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: runningColors.surfaceSoft,
    borderRadius: Radius.pill,
    padding: spacing.xxs,
    borderWidth: 1,
    borderColor: runningColors.border,
  },
  segmentedButton: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: Math.max(58, Math.round(deviceWidth * 0.16)),
  },
  segmentedButtonActive: {
    backgroundColor: runningColors.surface,
    borderColor: runningColors.orange,
  },
  segmentedText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
  },
  segmentedTextActive: {
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    color: runningColors.orange,
  },
  itemContainer: {
    padding: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: runningColors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...cardShadow,
  },
  listCard: {
    position: 'relative',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: 0,
    marginBottom: spacing.sm,
    backgroundColor: runningColors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: runningColors.border,
    ...cardShadow,
  },
  listMarker: {
    width: Math.max(10, Math.round(deviceWidth * 0.03)),
    height: Math.max(10, Math.round(deviceWidth * 0.03)),
    borderRadius: Radius.pill,
    backgroundColor: runningColors.orange,
    marginRight: spacing.md,
  },
  listTextColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  listTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.label,
    fontWeight: '700',
    color: runningColors.textPrimary,
    lineHeight: 20,
  },
  listSubtitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
    marginTop: spacing.xxs,
    lineHeight: 18,
  },
  listMeta: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textMuted,
    marginTop: spacing.xxs,
  },
  listRight: {
    minWidth: Math.max(92, Math.round(deviceWidth * 0.24)),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: spacing.lg,
    marginRight: spacing.xs,
    // 우상단 x 버튼과 시각적으로 겹치지 않도록 거리/화살표 묶음을 살짝 내린다.
    transform: [{ translateY: spacing.xs }],
  },
  sessionDeleteButton: {
    // 카드 레이아웃을 밀지 않고 삭제 액션만 우상단에 고정한다.
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: runningColors.surfaceSoft,
    borderWidth: 1,
    borderColor: runningColors.border,
  },
  sessionDeleteText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    lineHeight: 18,
    color: runningColors.textMuted,
  },
  sessionReloadRow: {
    // 숨긴 항목 복구 버튼은 러닝별 탭의 보조 액션으로 카드 목록 바로 위에 둔다.
    alignItems: 'stretch',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sessionReloadButton: {
    minHeight: 42,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: Radius.md,
    backgroundColor: runningColors.textPrimary,
    borderWidth: 1,
    borderColor: runningColors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionReloadButtonPressed: {
    opacity: 0.75,
  },
  sessionReloadText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    fontWeight: '700',
    color: runningColors.white,
    lineHeight: 18,
  },
  listDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: runningColors.textPrimary,
  },
  listValueAccent: {
    color: runningColors.orange,
  },
  listValueNumber: {
    fontSize: Typography.label,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  listValueUnit: {
    marginLeft: spacing.xxs,
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textSecondary,
  },
  sessionTextColumn: {
    flexDirection: 'column',
  },
  dateText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.bodySmall,
    color: runningColors.textPrimary,
    marginBottom: spacing.xxs,
  },
  timeText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
    marginRight: spacing.xxl,
  },
  distanceText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    color: runningColors.orange,
    marginLeft: 'auto',
  },
  detailLink: {
    fontSize: Typography.action,
    color: runningColors.textMuted,
    fontFamily: Fonts.Pretendard,
    fontWeight: '700',
    marginLeft: spacing.sm,
    lineHeight: 16,
  },
  indexText: {
    fontSize: Typography.cardTitle,
    fontWeight: 'bold',
    marginRight: spacing.xl,
    fontFamily: Fonts.Pretendard,
    color: runningColors.textPrimary,
  },
  chartCard: {
    position: 'relative',
    backgroundColor: runningColors.surface,
    borderRadius: cardRadius,
    paddingVertical: chartPadding,
    paddingHorizontal: chartPadding,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: runningColors.border,
    ...cardShadow,
  },
  chartMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  chartMetaItem: {
    flex: 1,
    minHeight: 78,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: Radius.md,
    backgroundColor: runningColors.surfaceSoft,
    justifyContent: 'space-between',
  },
  chartMetaItemAccent: {
    marginLeft: spacing.md,
    backgroundColor: runningColors.orange,
  },
  chartMetaLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: runningColors.textMuted,
    marginBottom: spacing.xxs,
  },
  chartMetaLabelAccent: {
    color: Colors.surfaceOverlayStrong,
  },
  chartMetaValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: weeklyStatNumberFont,
    lineHeight: Math.round(weeklyStatNumberFont * 1.18),
    fontWeight: '800',
    color: runningColors.textPrimary,
  },
  chartMetaValueAccent: {
    color: runningColors.white,
  },
  chartMetaUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: statUnitFont,
    lineHeight: Math.round(statUnitFont * 1.25),
    fontWeight: '600',
    color: runningColors.orange,
  },
  chartMetaUnitAccent: {
    color: Colors.surfaceOverlaySolid,
  },
  barChartStyle: {
    borderRadius: chartRadius,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  loadingIndicator: {
    marginTop: spacing.xxl,
  },
  emptyCard: {
    position: 'relative',
    backgroundColor: runningColors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: runningColors.border,
    ...cardShadow,
  },
  emptyCardTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.action,
    fontWeight: '700',
    color: runningColors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCardText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textSecondary,
  },
  chartEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  chartEmptyText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: runningColors.textMuted,
  },
});
