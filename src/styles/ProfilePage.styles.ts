import { Platform, StyleSheet, Dimensions } from 'react-native';
import { SCREEN_WIDTH } from './dimensions';
import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from './theme';

const { width: deviceWidth } = Dimensions.get('window');
const baseUnit = deviceWidth / 24; // 반응형 기준 단위
const avatarSize = Math.max(80, Math.round(deviceWidth * 0.24));
const gearSize = Math.max(28, Math.round(deviceWidth * 0.09));
const cardRadius = Math.max(12, Math.round(deviceWidth * 0.04));
const cardPadding = Math.max(12, Math.round(deviceWidth * 0.04));
const headerFont = Math.max(
  Typography.bodyLarge,
  Math.round(deviceWidth * 0.05)
);
const bodyFont = Math.max(Typography.caption, Math.round(deviceWidth * 0.034));
const smallFont = Math.max(
  Typography.caption - 1,
  Math.round(deviceWidth * 0.03)
);
const titleFont = Math.max(Typography.h2, Math.round(deviceWidth * 0.053));
const metricNumberFont = Math.max(
  Typography.body,
  Math.round(deviceWidth * 0.05)
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
const sectionTopSpacing = Math.max(Spacing.xl, Math.round(baseUnit * 2.1));
const sectionBottomSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 0.85));
const cardBottomSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 0.95));
const progressTopSpacing = Math.max(Spacing.sm, Math.round(baseUnit * 1.1));
const metricCardVerticalPadding = Math.max(12, Math.round(cardPadding * 0.9));
const sectionHeaderMinHeight = Math.max(38, Math.round(deviceWidth * 0.1));
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
const metricLabelFont = Math.max(10, Math.round(baseUnit * 1.1));
const metricLabelLineHeight = Math.max(12, Math.round(baseUnit * 1.4));
const metricValueFont = Math.max(10, Math.round(baseUnit * 1.1));
const metricValueLineHeight = Math.max(13, Math.round(baseUnit * 1.5));

const cardShadow = {
  ...Shadows.soft,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 4,
};

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
    fontFamily: Fonts.Roboto_VariableFont,
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
    fontFamily: Fonts.JUA,
    fontSize: headerFont,
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
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: bodyFont,
    fontWeight: '600',
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
    fontFamily: Fonts.JUA,
    fontSize: metricLabelFont,
    lineHeight: metricLabelLineHeight,
    color: Colors.textPrimary,
  },
  metricAim: {
    fontFamily: Fonts.Roboto_VariableFont,
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
    fontFamily: Fonts.Roboto_VariableFont,
    fontSize: metricValueFont,
    lineHeight: metricValueLineHeight,
    color: Colors.textSecondary,
  },
  metricNumber: {
    fontFamily: Fonts.JUA,
    fontSize: metricNumberFont,
    lineHeight: Math.max(metricNumberFont, Math.round(metricNumberFont * 1.05)),
    color: Colors.textPrimary,
  },
  metricUnit: {
    fontFamily: Fonts.Roboto_VariableFont,
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
    backgroundColor: Colors.infoStrong,
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
