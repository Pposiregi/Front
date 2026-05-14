import { Platform, StyleSheet, Dimensions } from 'react-native';
import { SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

const { width: deviceWidth } = Dimensions.get('window');
const baseUnit = deviceWidth / 24; // 반응형 기준 단위
const avatarSize = Math.max(80, Math.round(deviceWidth * 0.24));
const gearSize = Math.max(28, Math.round(deviceWidth * 0.09));
const cardRadius = Math.max(12, Math.round(deviceWidth * 0.04));
const cardPadding = Math.max(12, Math.round(deviceWidth * 0.04));
const sectionTitleFont = Typography.h1;
const sectionTitleLineHeight = Math.round(sectionTitleFont * 1.16);
const bodyFont = Math.max(Typography.caption, Math.round(deviceWidth * 0.034));
const smallFont = Math.max(
  Typography.caption,
  Math.round(deviceWidth * 0.03)
);
const titleFont = Math.max(Typography.h2, Math.round(deviceWidth * 0.053));
const metricNumberFont = Math.max(
  Typography.bodyLarge,
  Math.min(20, Math.round(deviceWidth * 0.046))
);
const chartRadius = Math.max(10, Math.round(deviceWidth * 0.03));
const chartPadding = Math.max(10, Math.round(deviceWidth * 0.035));
const contentPadding = Math.max(16, Math.round(deviceWidth * 0.048));
const progressHeight = Math.max(6, Math.round(deviceWidth * 0.02));
const progressRadius = Math.round(progressHeight * 1.2);
const bottomPadding = Math.max(100, Math.round(deviceWidth * 0.28));
const topPadding = Math.max(Spacing.lg, Math.round(deviceWidth * 0.036));
const headerBottomSpacing = Math.max(Spacing.md, Math.round(baseUnit * 1.5));
const titleTopSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 0.95));
const captionTopSpacing = Math.max(Spacing.xs, Math.round(baseUnit * 0.45));
const sectionTopSpacing = Spacing.xxl;
const sectionBottomSpacing = Spacing.md;
const cardBottomSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 0.95));
const progressTopSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 1.1));
const metricCardVerticalPadding = Math.max(12, Math.round(cardPadding * 0.9));
const sectionHeaderMinHeight = Math.max(34, sectionTitleLineHeight);
const captionLineHeight = Math.max(bodyFont + 4, Math.round(bodyFont * 1.35));
const recordButtonHorizontalPadding = Math.max(8, Math.round(baseUnit * 0.95));
const recordButtonVerticalPadding = Math.max(4, Math.round(baseUnit * 0.45));
const chartCardTopPadding = Math.max(
  chartPadding + 2,
  Math.round(chartPadding * 1.1)
);
const chartCardBottomPadding = Math.max(
  chartPadding + 4,
  Math.round(chartPadding * 1.2)
);
const metricRightMinWidth = Math.max(110, Math.round(deviceWidth * 0.29));
const metricLabelFont = Math.max(
  Typography.bodySmall,
  Math.min(15, Math.round(deviceWidth * 0.038))
);
const metricLabelLineHeight = Math.round(metricLabelFont * 1.35);
const metricValueFont = Math.max(
  Typography.caption,
  Math.min(14, Math.round(deviceWidth * 0.034))
);
const metricValueLineHeight = Math.round(metricValueFont * 1.35);

const cardShadow = Shadows.surfaceRaised;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: contentPadding,
    paddingTop: Platform.select({ ios: topPadding, android: topPadding }),
    paddingBottom: bottomPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: headerBottomSpacing,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: Math.round(avatarSize / 2),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  avatarEmoji: {
    fontSize: Math.max(32, Math.round(avatarSize * 0.48)),
  },
  gearButton: {
    position: 'absolute',
    bottom: -Math.round(gearSize * 0.12),
    right: -Math.round(gearSize * 0.15),
    width: gearSize,
    height: gearSize,
    borderRadius: Math.round(gearSize / 2),
    backgroundColor: Colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  gearText: {
    fontSize: Math.max(14, Math.round(gearSize * 0.52)),
  },
  name: {
    marginTop: titleTopSpacing,
    fontFamily: Fonts.JUA,
    fontSize: titleFont,
    color: Colors.textPrimary,
  },
  caption: {
    marginTop: captionTopSpacing,
    fontFamily: Fonts.Pretendard,
    fontSize: bodyFont,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: captionLineHeight,
    maxWidth: Math.round(deviceWidth * 0.62),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: sectionHeaderMinHeight,
    marginTop: sectionTopSpacing,
    marginBottom: sectionBottomSpacing,
  },
  sectionTitle: {
    fontFamily: Fonts.Pretendard,
    fontSize: sectionTitleFont,
    lineHeight: sectionTitleLineHeight,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: recordButtonHorizontalPadding,
    paddingVertical: recordButtonVerticalPadding,
    borderRadius: Radius.sm,
  },
  recordIcon: {
    marginRight: Math.max(Spacing.xs, Math.round(baseUnit * 0.45)),
  },
  recordText: {
    fontFamily: Fonts.Pretendard,
    fontSize: bodyFont,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingVertical: metricCardVerticalPadding,
    paddingHorizontal: cardPadding,
    marginBottom: cardBottomSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricCardSingle: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingVertical: metricCardVerticalPadding,
    paddingHorizontal: cardPadding,
    marginBottom: cardBottomSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...cardShadow,
  },
  metricLabel: {
    fontFamily: Fonts.Pretendard,
    fontSize: metricLabelFont,
    lineHeight: metricLabelLineHeight,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricAim: {
    fontFamily: Fonts.Pretendard,
    fontSize: smallFont,
    color: Colors.textSecondary,
    marginTop: Math.max(2, Math.round(baseUnit * 0.5)),
  },
  metricRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: metricRightMinWidth,
  },
  metricValue: {
    fontFamily: Fonts.Pretendard,
    fontSize: metricValueFont,
    lineHeight: metricValueLineHeight,
    color: Colors.textSecondary,
  },
  metricNumber: {
    fontFamily: Fonts.Pretendard,
    fontSize: metricNumberFont,
    lineHeight: Math.max(metricNumberFont, Math.round(metricNumberFont * 1.05)),
    color: Colors.textPrimary,
  },
  metricUnit: {
    fontFamily: Fonts.Pretendard,
    fontSize: metricValueFont,
    lineHeight: metricValueLineHeight,
    color: Colors.textSecondary,
  },
  progressTrack: {
    width: Math.max(140, SCREEN_WIDTH * 0.35),
    height: progressHeight,
    borderRadius: progressRadius,
    backgroundColor: Colors.divider,
    marginTop: progressTopSpacing,
  },
  progressBar: {
    height: progressHeight,
    borderRadius: progressRadius,
    backgroundColor: Colors.dataWeight,
  },
  chartHeader: {
    marginTop: sectionTopSpacing,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: cardRadius,
    paddingTop: chartCardTopPadding,
    paddingBottom: chartCardBottomPadding,
    paddingHorizontal: chartPadding,
    ...cardShadow,
  },
  chartStyle: {
    borderRadius: chartRadius,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
