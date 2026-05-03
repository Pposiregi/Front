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
const subHeaderFont = Math.max(Typography.bodySmall, Math.round(deviceWidth * 0.035));
const metaFont = Math.max(Typography.caption - 1, Math.round(deviceWidth * 0.028));
const metricFont = Math.max(Typography.body, Math.round(deviceWidth * 0.042));

const cardShadow = {
  ...Shadows.soft,
  shadowOpacity: 0.07,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export const activityTheme = {
  colors: Colors,
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
    backgroundColor: Colors.background,
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
    fontFamily: Fonts.JUA,
    fontSize: headerFont,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textMuted,
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
    fontSize: Typography.h2,
    color: Colors.textSecondary,
    fontFamily: Fonts.JUA,
  },
  arrowTextDisabled: {
    color: Colors.textMuted,
  },
  subHeaderText: {
    fontFamily: Fonts.Pretendard,
    fontSize: subHeaderFont,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    ...cardShadow,
  },
  summaryMetaRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  summaryDateText: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textMuted,
  },
  summaryNotice: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textSecondary,
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
    fontSize: Typography.h2,
    color: Colors.textPrimary,
  },
  progressTarget: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textMuted,
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
    color: Colors.textSecondary,
  },
  heroMetricValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: metricFont,
    color: Colors.textPrimary,
  },
  heroMetricDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    alignSelf: 'stretch',
  },
  heroComment: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: Radius.pill,
  },
  badgeSuccess: {
    backgroundColor: Colors.badgeSuccess,
  },
  badgeProgress: {
    backgroundColor: Colors.badgeProgress,
  },
  badgeMuted: {
    backgroundColor: Colors.background,
  },
  badgeText: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.h2,
    color: Colors.textPrimary,
    marginTop: spacing.sm,
  },
  summaryUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textMuted,
    marginTop: spacing.xxs,
  },
  summaryDivider: {
    width: 1,
    height: 46,
    backgroundColor: Colors.divider,
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
    fontFamily: Fonts.JUA,
    fontSize: 18,
    color: Colors.textPrimary,
    marginRight: spacing.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    padding: spacing.xxs,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  segmentedButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: Math.max(64, Math.round(deviceWidth * 0.18)),
  },
  segmentedButtonActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.accentStrong,
    ...cardShadow,
  },
  segmentedText: {
    fontFamily: Fonts.Pretendard,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  segmentedTextActive: {
    fontFamily: Fonts.JUA,
    color: Colors.accentStrong,
  },
  itemContainer: {
    padding: spacing.lg,
    marginVertical: spacing.xs,
    backgroundColor: Colors.surface,
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
    marginVertical: spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.divider,
    ...cardShadow,
  },
  listMarker: {
    width: Math.max(10, Math.round(deviceWidth * 0.03)),
    height: Math.max(10, Math.round(deviceWidth * 0.03)),
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentStrong,
    marginRight: spacing.md,
  },
  listTextColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  listTitle: {
    fontFamily: Fonts.JUA,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  listSubtitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: spacing.xxs,
    lineHeight: 16,
  },
  listMeta: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textMuted,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sessionDeleteText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 16,
    lineHeight: 18,
    color: Colors.textMuted,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionReloadButtonPressed: {
    opacity: 0.75,
  },
  sessionReloadText: {
    fontFamily: Fonts.JUA,
    fontSize: 14,
    color: Colors.accentStrong,
    lineHeight: 18,
  },
  listDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  listValueAccent: {
    color: Colors.accentStrong,
  },
  listValueNumber: {
    fontSize: 15,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  listValueUnit: {
    marginLeft: spacing.xxs,
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textSecondary,
  },
  sessionTextColumn: {
    flexDirection: 'column',
  },
  dateText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  timeText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: spacing.xxl,
  },
  distanceText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 16,
    color: Colors.accentStrong,
    marginLeft: 'auto',
  },
  detailLink: {
    fontSize: 16,
    color: Colors.textMuted,
    fontFamily: Fonts.JUA,
    marginLeft: spacing.sm,
    lineHeight: 16,
  },
  indexText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: spacing.xl,
    fontFamily: Fonts.Pretendard,
  },
  chartCard: {
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.divider,
    marginHorizontal: spacing.lg,
  },
  chartMetaLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: metaFont,
    color: Colors.textMuted,
    marginBottom: spacing.xxs,
  },
  chartMetaValue: {
    fontFamily: Fonts.JUA,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  chartMetaUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: 10,
    color: Colors.textMuted,
  },
  lineChartStyle: {
    borderRadius: chartRadius,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
  },
  loadingIndicator: {
    marginTop: spacing.xxl,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: Colors.divider,
    ...cardShadow,
  },
  emptyCardTitle: {
    fontFamily: Fonts.JUA,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCardText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chartEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  chartEmptyText: {
    fontFamily: Fonts.Pretendard,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
